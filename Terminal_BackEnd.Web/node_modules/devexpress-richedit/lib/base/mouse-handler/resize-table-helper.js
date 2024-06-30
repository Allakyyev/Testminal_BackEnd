import { PointDirectionAdaptorX, RectangleDirectionAdaptorX, SizeDirectionAdaptorX } from '../../base-utils/direction-adaptor/x-direction-adaptor';
import { PointDirectionAdaptorY, RectangleDirectionAdaptorY, SizeDirectionAdaptorY } from '../../base-utils/direction-adaptor/y-direction-adaptor';
import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { RendererClassNames } from '../../core/canvas/renderer-class-names';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { RichEditClientCommand } from '../commands/client-command';
import { RulerChangeTableColumnWidthCommandParameters, RulerChangeTableRowHeightCommandParameters } from '../commands/ruler/ruler-table-commands';
export class ResizeTableHelperBase {
    constructor(control, resizeTableVisualizer, evt) {
        this.setAdaptors();
        this.control = control;
        this.resizeTableVisualizer = resizeTableVisualizer;
        const sourceElement = EvtUtils.getEventSource(evt.mouseEvent);
        this.setIndexes(sourceElement);
        if (!this.isInited())
            return;
        const pageAreaPlusColumn = this.getPartialLayoutPosition(evt.layoutPoint.pageIndex);
        this.columnBoundsRelativePage = pageAreaPlusColumn.pageArea.createRectangle();
        this.columnBoundsRelativePage.moveRectangleByPoint(pageAreaPlusColumn.column);
        this.sourceElementSize = new Size(sourceElement.offsetWidth, sourceElement.offsetHeight);
        this.startPositionRelativeTable = new Point(DomUtils.pxToInt(sourceElement.style.left), DomUtils.pxToInt(sourceElement.style.top));
        this.pointDirAdp.init(this.startPositionRelativeTable).position += Math.round(this.sizeDirAdp.init(this.sourceElementSize).length / 2);
        this.pointDirAdp.anotherPosition = 0;
        this.currPositionRelativeTable = this.startPositionRelativeTable.clone();
        const lineSize = new Size(this.layoutTable.width, this.layoutTable.height);
        this.sizeDirAdp.init(lineSize).length = 1;
        this.resizeTableVisualizer.init(evt.layoutPoint.pageIndex, lineSize);
        this.updateVisualizer();
        this.setSpecific();
    }
    isInited() {
        return this.tableIndex !== undefined;
    }
    move(evt) {
        if (!evt.layoutPoint || !this.isInited())
            return;
        const currPosRelativeTable = this.pointDirAdp.init(evt.layoutPoint.point).position -
            this.rectDirAdp.init(this.columnBoundsRelativePage).position -
            this.rectDirAdp.init(this.layoutTable).position;
        if (currPosRelativeTable >= this.minValueRelativeTable && currPosRelativeTable <= this.maxValueRelativeTable) {
            this.pointDirAdp.init(this.currPositionRelativeTable).position = currPosRelativeTable;
            this.updateVisualizer();
        }
    }
    end(evt) {
        if (!this.isInited())
            return;
        this.move(evt);
        if (Math.abs(this.pointDirAdp.init(this.currPositionRelativeTable).position - this.pointDirAdp.init(this.startPositionRelativeTable).position)
            > ResizeTableHelperBase.DIFFERENT_BY_PIXELS_ALLOW_CHANGE_MODEL)
            this.applyChanges();
        this.resizeTableVisualizer.hide();
    }
    updateVisualizer() {
        this.resizeTableVisualizer.show(new Point(this.columnBoundsRelativePage.x + this.layoutTable.x + this.currPositionRelativeTable.x, this.columnBoundsRelativePage.y + this.layoutTable.y + this.currPositionRelativeTable.y));
    }
    getPartialLayoutPosition(pageIndex) {
        const page = this.control.layout.pages[pageIndex];
        const subDocument = this.control.selection.activeSubDocument;
        if (!subDocument.isMain()) {
            const pageArea = page.otherPageAreas[subDocument.id];
            const column = pageArea.columns[0];
            this.layoutTable = ResizeTableHelperBase.getLayoutTable(column, this.tableIndex);
            return new PageAreaPlusColumn(pageArea, column);
        }
        return ListUtils.unsafeAnyOf(page.mainSubDocumentPageAreas, (pageArea) => {
            const column = ListUtils.unsafeAnyOf(pageArea.columns, (column) => (this.layoutTable = ResizeTableHelperBase.getLayoutTable(column, this.tableIndex)) ? column : null);
            return column ? new PageAreaPlusColumn(pageArea, column) : null;
        });
    }
    static getLayoutTable(column, tableIndex) {
        return ListUtils.elementBy(column.tablesInfo, (tInfo) => tInfo.logicInfo.grid.table.index == tableIndex);
    }
    setIndexes(sourceElement) {
        this.tableIndex = sourceElement.parentNode["dxTableIndex"];
    }
}
ResizeTableHelperBase.DIFFERENT_BY_PIXELS_ALLOW_CHANGE_MODEL = 5;
ResizeTableHelperBase.TABLE_SEPARATOR_DIVISION_MARGIN_X = 7;
ResizeTableHelperBase.TABLE_SEPARATOR_DIVISION_MARGIN_Y = 7;
export class ResizeRowTableHelper extends ResizeTableHelperBase {
    setAdaptors() {
        this.rectDirAdp = new RectangleDirectionAdaptorY();
        this.pointDirAdp = new PointDirectionAdaptorY();
        this.sizeDirAdp = new SizeDirectionAdaptorY();
    }
    static canHandleResize(evt) {
        return EvtUtils.getEventSource(evt.mouseEvent).className.indexOf(RendererClassNames.TABLE_ROW_CURSOR) > -1;
    }
    isInited() {
        return super.isInited() && this.layoutRowIndex !== undefined;
    }
    setIndexes(sourceElement) {
        super.setIndexes(sourceElement);
        this.layoutRowIndex = sourceElement["dxLayoutRowIndex"];
    }
    setSpecific() {
        if (!this.isInited())
            return;
        this.minValueRelativeTable = this.layoutTable.tableRows[this.layoutRowIndex].y - this.layoutTable.y + ResizeTableHelperBase.TABLE_SEPARATOR_DIVISION_MARGIN_Y;
        this.maxValueRelativeTable = this.columnBoundsRelativePage.height - this.layoutTable.y;
    }
    applyChanges() {
        if (!this.isInited())
            return;
        this.control.commandManager.getCommand(RichEditClientCommand.RulerChangeTableRowHeight).execute(this.control.commandManager.isPublicApiCall, new RulerChangeTableRowHeightCommandParameters(this.tableIndex, this.currPositionRelativeTable.y - this.startPositionRelativeTable.y, this.layoutTable, this.layoutRowIndex));
    }
}
export class ResizeColumnTableHelper extends ResizeTableHelperBase {
    setAdaptors() {
        this.rectDirAdp = new RectangleDirectionAdaptorX();
        this.pointDirAdp = new PointDirectionAdaptorX();
        this.sizeDirAdp = new SizeDirectionAdaptorX();
    }
    static canHandleResize(evt) {
        return EvtUtils.getEventSource(evt.mouseEvent).className.indexOf(RendererClassNames.TABLE_COLUMN_CURSOR) > -1;
    }
    applyChanges() {
        this.control.commandManager.getCommand(RichEditClientCommand.RulerChangeTableColumnWidth).execute(this.control.commandManager.isPublicApiCall, new RulerChangeTableColumnWidthCommandParameters(this.tableIndex, this.currPositionRelativeTable.x - this.startPositionRelativeTable.x, this.layoutTable, this.startPositionRelativeTable.x + this.layoutTable.x, false));
    }
    setSpecific() {
        const columnsXPositions = this.layoutTable.logicInfo.grid.columns.positions;
        const columnIndex = ResizeColumnTableHelper.findNearestColumnIndex(columnsXPositions, this.startPositionRelativeTable.x);
        this.minValueRelativeTable = (columnIndex == 0 ? -this.layoutTable.x : columnsXPositions[columnIndex - 1] + ResizeTableHelperBase.TABLE_SEPARATOR_DIVISION_MARGIN_X);
        this.maxValueRelativeTable = columnIndex == columnsXPositions.length - 1 ?
            Number.MAX_VALUE :
            columnsXPositions[columnIndex + 1] - ResizeTableHelperBase.TABLE_SEPARATOR_DIVISION_MARGIN_X;
    }
    static findNearestColumnIndex(columnsXPositions, xPosRelativeTable) {
        const centralColumnIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(columnsXPositions, (x) => x, xPosRelativeTable));
        const columnIndexes = [centralColumnIndex];
        if (centralColumnIndex + 1 < columnsXPositions.length)
            columnIndexes.push(centralColumnIndex + 1);
        if (centralColumnIndex - 1 > 0)
            columnIndexes.unshift(centralColumnIndex - 1);
        return ListUtils.min(columnIndexes, (a) => Math.abs(columnsXPositions[a] - xPosRelativeTable));
    }
}
class PageAreaPlusColumn {
    constructor(pageArea, column) {
        this.pageArea = pageArea;
        this.column = column;
    }
}
