import { rotatePoint } from '../../../base-utils/utils';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { AnchoredObjectLevelType } from '../../../core/layout/main-structures/layout-boxes/layout-anchored-object-box';
import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { Metrics } from '@devexpress/utils/lib/geometry/metrics';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { HitTestDeviation, Rectangle, RectangleDeviation } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { HitTestResult } from './hit-test-result';
const TEXTBOX_AREA_MARGIN = 5;
export class HitTestManager {
    constructor(documentLayout, measurer) {
        this.documentLayout = documentLayout;
        this.measurer = measurer;
        this.result = null;
        this.point = null;
    }
    calculate(point, requestDetailsLevel, subDocument, excludeTextBoxesFromSubDocuments = false) {
        this.point = point;
        this.subDocument = subDocument;
        this.excludeTextBoxesFromSubDocuments = excludeTextBoxesFromSubDocuments;
        this.result = new HitTestResult(subDocument);
        this.result.detailsLevel = requestDetailsLevel;
        this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.None;
        if (point && !point.isEmpty())
            this.calcPage();
        return this.result;
    }
    calcPage() {
        const page = this.documentLayout.pages[this.point.pageIndex];
        this.result.pageIndex = this.point.pageIndex;
        this.result.page = page;
        const pageDeviation = HitTestManager.getDeviation(this.point, new Rectangle(0, 0, page.width, page.height));
        this.result.deviations[DocumentLayoutDetailsLevel.Page] = pageDeviation;
        if (pageDeviation == HitTestDeviation.None)
            this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.Page;
        this.calcFloatingObject(false);
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Page)
            this.calcPageArea(this.point.x, this.point.y);
    }
    calcFloatingObject(considerBehindTextWrap) {
        var _a, _b;
        if (this.result.floatingObject)
            return;
        const anchoredObjects = this.result.page.anchoredObjectHolder.getObjectsForRenderer(this.documentLayout.anchorObjectsPositionInfo).reverse();
        for (let i = 0, obj; obj = anchoredObjects[i]; i++) {
            const isHeaderFooter = (_b = (_a = this.subDocument) === null || _a === void 0 ? void 0 : _a.isHeaderFooter()) !== null && _b !== void 0 ? _b : NumberMapUtils.anyOf(this.result.page.otherPageAreas, pa => pa.subDocument.id === obj.belongsToSubDocId && pa.subDocument.isHeaderFooter());
            const compatibilityMode = this.documentLayout.pages[0].mainSubDocumentPageAreas[0].subDocument.documentModel.compatibilitySettings.compatibilityMode;
            if (considerBehindTextWrap || obj.anchorInfo.getLevelTypeForRendering(isHeaderFooter, compatibilityMode) != AnchoredObjectLevelType.BehindText) {
                let rotatedPoint = obj.rotationInRadians == 0 ? this.point : rotatePoint(this.point, -obj.rotationInRadians, obj.center);
                if (obj.containsPoint(rotatedPoint)) {
                    this.result.floatingObject = obj;
                    return;
                }
            }
        }
    }
    calcPageArea(pointX, pointY) {
        const point = new Point(pointX, pointY);
        let pageArea;
        let pageAreaIndex;
        if (this.subDocument) {
            if (this.subDocument.isMain()) {
                const pageAreas = this.result.page.mainSubDocumentPageAreas;
                pageAreaIndex = HitTestManager.findNearest(pointY, pageAreas, (pa) => pa.y, (pa) => pa.bottom);
                pageArea = pageAreas[pageAreaIndex];
            }
            else {
                pageArea = this.result.page.otherPageAreas[this.subDocument.id];
                pageAreaIndex = 0;
                if (!pageArea)
                    return;
            }
        }
        else {
            const pageAreas = ListUtils.shallowCopy(this.result.page.mainSubDocumentPageAreas);
            NumberMapUtils.forEach(this.result.page.otherPageAreas, (pa) => {
                if (pa.subDocument.isHeaderFooter())
                    pageAreas.push(pa);
            });
            const textBoxPaList = [];
            if (!this.excludeTextBoxesFromSubDocuments) {
                ListUtils.forEach(this.result.page.anchoredObjectHolder.getObjectsForRenderer(this.documentLayout.anchorObjectsPositionInfo).reverse(), (obj) => {
                    if (obj.getType() == LayoutBoxType.AnchorTextBox)
                        textBoxPaList.push(this.result.page.otherPageAreas[obj.internalSubDocId]);
                });
            }
            ListUtils.addListOnTail(textBoxPaList, pageAreas);
            pageArea = HitTestManager.hitTestRectangles(point, textBoxPaList)[0].obj;
            pageAreaIndex = pageArea.subDocument.isMain() ? this.result.page.mainSubDocumentPageAreas.indexOf(pageArea) : 0;
            this.result.subDocument = pageArea.subDocument;
        }
        this.result.pageArea = pageArea;
        this.result.pageAreaIndex = pageAreaIndex;
        const pageAreaDeviation = HitTestManager.getDeviation(point, pageArea)
            | this.result.deviations[DocumentLayoutDetailsLevel.Page];
        this.result.deviations[DocumentLayoutDetailsLevel.PageArea] = pageAreaDeviation;
        if (pageAreaDeviation == HitTestDeviation.None)
            this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.PageArea;
        else
            this.calcFloatingObject(true);
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.PageArea)
            this.calcColumn(pointX - pageArea.x, pointY - pageArea.y);
    }
    calcColumn(pointX, pointY) {
        let columns = this.result.pageArea.columns;
        let columnIndex = HitTestManager.findNearest(pointX, columns, (col) => col.x, (col) => col.right);
        let column = columns[columnIndex];
        this.result.columnIndex = columnIndex;
        this.result.column = column;
        const columnDeviation = HitTestManager.getDeviation(new Point(pointX, pointY), column)
            | this.result.deviations[DocumentLayoutDetailsLevel.PageArea];
        this.result.deviations[DocumentLayoutDetailsLevel.Column] = columnDeviation;
        if (columnDeviation == HitTestDeviation.None)
            this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.Column;
        else
            this.calcFloatingObject(true);
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Column)
            this.calcRow(pointX - column.x, pointY - column.y);
    }
    calcRow(pointX, pointY) {
        const rows = this.result.column.rows;
        const closestTable = this.getClosestTable(pointX, pointY);
        this.result.rowIndex = closestTable ?
            this.getLayoutRowIndexCaseInTable(pointX, pointY, closestTable) :
            Math.max(0, SearchUtils.normedInterpolationIndexOf(rows, (r) => r.y, pointY));
        const row = rows[this.result.rowIndex];
        this.result.row = row;
        const rowDeviation = HitTestManager.getDeviation(new Point(pointX, pointY), row)
            | this.result.deviations[DocumentLayoutDetailsLevel.Column];
        this.result.deviations[DocumentLayoutDetailsLevel.Row] = rowDeviation;
        if (rowDeviation == HitTestDeviation.None)
            this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.Row;
        else
            this.calcFloatingObject(true);
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Row)
            this.calcBox(pointX - row.x, pointY - row.y);
    }
    calcBox(pointX, pointY) {
        const boxes = this.result.row.boxes;
        const boxIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(boxes, (b) => b.x, pointX));
        const box = boxes[boxIndex];
        const boxLeftBorder = box.x;
        const boxRightBorder = boxLeftBorder + box.width;
        const boxTopBorder = this.result.row.baseLine - box.getAscent();
        let boxBottomBorder = box.height + boxTopBorder;
        if (boxBottomBorder > this.result.row.height)
            boxBottomBorder = this.result.row.height;
        this.result.boxIndex = boxIndex;
        this.result.box = this.result.row.boxes[boxIndex];
        const boxDeviation = HitTestManager.getDeviation(new Point(pointX, pointY), new Rectangle(boxLeftBorder, boxTopBorder, boxRightBorder - boxLeftBorder, boxBottomBorder - boxTopBorder))
            | this.result.deviations[DocumentLayoutDetailsLevel.Row];
        this.result.deviations[DocumentLayoutDetailsLevel.Box] = boxDeviation;
        if (boxDeviation == HitTestDeviation.None)
            this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.Box;
        else
            this.calcFloatingObject(true);
        if (this.result.detailsLevel > DocumentLayoutDetailsLevel.Box)
            this.calcCharacter(pointX - boxLeftBorder, pointY - boxTopBorder);
    }
    calcCharacter(pointX, _pointY) {
        const boxDeviation = this.result.deviations[DocumentLayoutDetailsLevel.Box];
        let boxOffset = -1;
        if (boxDeviation & HitTestDeviation.Left)
            boxOffset = 0;
        else if (boxDeviation & HitTestDeviation.Right)
            boxOffset = this.result.box.getLength();
        else
            boxOffset = this.result.box.calculateCharOffsetByPointX(this.measurer, pointX);
        this.result.charOffset = boxOffset;
        this.result.deviations[DocumentLayoutDetailsLevel.Character] = boxDeviation;
        if (boxDeviation == HitTestDeviation.None)
            this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.Character;
        else
            this.calcFloatingObject(true);
    }
    static getDeviation(point, rect) {
        return new RectangleDeviation(rect, point).calcDeviation().deviation.getValue();
    }
    static findNearest(point, objects, minBound, maxBound) {
        let currObj = objects[0];
        let nextObjIndex = 1;
        for (let nextObj; nextObj = objects[nextObjIndex]; nextObjIndex++) {
            if (point - maxBound(currObj) <= minBound(nextObj) - point)
                break;
            currObj = nextObj;
        }
        return nextObjIndex - 1;
    }
    getClosestTable(pointX, pointY) {
        const tableColumnInfos = this.result.column.tablesInfo;
        if (tableColumnInfos.length == 0)
            return null;
        const belowPosition = [];
        const abovePosition = [];
        const leftRightDeviation = [];
        const exactlyColumn = ListUtils.reverseElementBy(tableColumnInfos, (currTableColumnInfo) => {
            const deviationResult = new RectangleDeviation(currTableColumnInfo, new Point(pointX, pointY)).calcDeviation();
            const deviation = deviationResult.deviation;
            if (deviation.getValue() == HitTestDeviation.None)
                return true;
            if (deviation.get(HitTestDeviation.Top))
                belowPosition.push(deviationResult);
            else if (deviation.get(HitTestDeviation.Bottom))
                abovePosition.push(deviationResult);
            else
                leftRightDeviation.push(deviationResult);
            return false;
        });
        if (exactlyColumn)
            return exactlyColumn;
        const isCollectBelowTables = this.result.column.rows[0].tableCellInfo && pointY <= tableColumnInfos[0].y;
        if (belowPosition.length && isCollectBelowTables)
            return HitTestManager.choiseClosestTable(belowPosition, false);
        const isCollectAboveTables = ListUtils.last(this.result.column.rows).tableCellInfo && pointY >= ListUtils.last(tableColumnInfos).y;
        if (abovePosition.length && isCollectAboveTables)
            return HitTestManager.choiseClosestTable(abovePosition, true);
        if (leftRightDeviation.length)
            return HitTestManager.choiseClosestTable(leftRightDeviation, false);
        return null;
    }
    static choiseClosestTable(tblList, isUseMax) {
        ListUtils.forEach(tblList, (elem) => elem.calcAdditionalParams());
        return ((isUseMax ? ListUtils.max : ListUtils.min)(tblList, a => a.offsetToInside.y).initRectangle);
    }
    getLayoutRowIndexCaseInTable(pointX, pointY, closestTable) {
        let cell;
        while (true) {
            cell = this.getCell(pointX, pointY, closestTable);
            if (cell.layoutRows.length)
                break;
            closestTable = cell.internalTables[0];
        }
        const pnt = new Point(pointX, pointY);
        const cellDeviation = new RectangleDeviation(cell, pnt).calcDeviation().deviation.getValue();
        this.result.deviations[DocumentLayoutDetailsLevel.TableCell] = cellDeviation;
        if (cellDeviation == HitTestDeviation.None)
            this.result.exactlyDetailLevel = DocumentLayoutDetailsLevel.TableCell;
        const deviations = [];
        const bestSuitableTbl = NumberMapUtils.elementBy(cell.internalTables, (tbl) => {
            if (tbl.containsPoint(pnt))
                return true;
            deviations.push(new RectangleDeviation(tbl, pnt).calcDeviation().calcAdditionalParams());
            return false;
        });
        if (bestSuitableTbl)
            return this.getLayoutRowIndexCaseInTable(pointX, pointY, bestSuitableTbl);
        const layoutRowAndIndex_Index = Math.max(0, SearchUtils.normedInterpolationIndexOf(cell.layoutRows, (r) => r.y, pointY));
        const layoutRow = cell.layoutRows[layoutRowAndIndex_Index];
        const bestSuitableTblDeviation = ListUtils.min(deviations, a => a.offsetToInside.y);
        if (!bestSuitableTblDeviation ||
            new RectangleDeviation(layoutRow, new Point(pointX, pointY)).calcDeviation().calcAdditionalParams().offsetToInside.y <=
                bestSuitableTblDeviation.offsetToInside.y)
            return layoutRow.indexInColumn;
        return this.getLayoutRowIndexCaseInTable(pointX, pointY, bestSuitableTblDeviation.initRectangle);
    }
    static getCellInRow(pointX, pointY, row, isForceGetCell) {
        const cells = row.rowCells;
        const cellIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(cells, (c) => c.x, pointX));
        const cell = cells[cellIndex];
        return isForceGetCell || cell.containsPoint(new Point(pointX, pointY)) ? cell : null;
    }
    getCell(pointX, pointY, closestTable) {
        const rows = closestTable.tableRows;
        const rowIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(rows, (r) => r.y, pointY));
        const row = rows[rowIndex];
        const cell = HitTestManager.getCellInRow(pointX, pointY, row, true);
        if (cell.containsPoint(new Point(pointX, pointY)))
            return cell;
        const exactlyCalculatedCell = ListUtils.unsafeReverseAnyOf(rows, (row) => HitTestManager.getCellInRow(pointX, pointY, row, false), rowIndex - 1);
        if (exactlyCalculatedCell)
            return exactlyCalculatedCell;
        return cell;
    }
    static isPointInTexBoxArea(point, box, angle) {
        let rotatedPoint = angle == 0 ? point : rotatePoint(point, -angle, box.center);
        return rotatedPoint.x > box.x + TEXTBOX_AREA_MARGIN &&
            rotatedPoint.x < box.x + box.width - TEXTBOX_AREA_MARGIN &&
            rotatedPoint.y > box.y + TEXTBOX_AREA_MARGIN &&
            rotatedPoint.y < box.y + box.height - TEXTBOX_AREA_MARGIN;
    }
    static hitTestRectangles(point, rectangles) {
        const perfectHit = [];
        const hit = ListUtils.map(rectangles, (r) => {
            const dev = new RectangleDeviation(r, point).calcDeviation().calcAdditionalParams();
            if (dev.deviation.getValue() == HitTestDeviation.None)
                perfectHit.push(new HitTestOfRectanglesResult(r, dev));
            return new HitTestOfRectanglesResult(r, dev);
        });
        return perfectHit.length ? perfectHit : [ListUtils.min(hit, a => Metrics.euclideanDistance(new Point(0, 0), a.deviation.offsetToInside))];
    }
}
export class HitTestOfRectanglesResult {
    constructor(obj, deviation) {
        this.obj = obj;
        this.deviation = deviation;
    }
}
