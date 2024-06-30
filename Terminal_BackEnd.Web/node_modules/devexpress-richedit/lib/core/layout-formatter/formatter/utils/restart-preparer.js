import { TableCellBoundFlags } from '../../../layout/table/layout-table-cell-info';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { DocumentLayoutDetailsLevel } from '../../../layout/document-layout-details-level';
import { LayoutPosition } from '../../../layout/layout-position';
import { LayoutBoxType } from '../../../layout/main-structures/layout-boxes/layout-box';
import { ColumnChange } from '../../changes/changes/column-change';
import { AnchoredPictureChange, LayoutChangeType } from '../../changes/changes/layout-change-base';
import { PageAreaChange } from '../../changes/changes/page-area-change';
import { PageChange } from '../../changes/changes/page-change';
import { LayoutFormatterState } from '../enums';
import { LastRowInfo } from './last-row-info';
export class RestartPreparer {
    constructor(manager) {
        this.manager = manager;
    }
    restartCommonPart(modelPosition) {
        if (this.manager.mainFormatter.rowFormatter.getPosition() < modelPosition) {
            this.manager.mainFormatter.rowFormatter.iterator.setPosition(this.manager.mainFormatter.rowFormatter.getPosition(), true, true);
            return false;
        }
        this.manager.mainFormatter.rowFormatter.numberingListCountersManager.reset();
        this.manager.mainFormatter.rowFormatter.setPosition(modelPosition, true, true);
        return true;
    }
    restartFromPage(pageIndex, isRestartNow, resetTableFormatter) {
        const restartPosition = this.calcRestartPosition(pageIndex);
        if (!this.restartCommonPart(restartPosition))
            return;
        const newLp = new LayoutPosition(DocumentLayoutDetailsLevel.None);
        newLp.pageIndex = pageIndex;
        const newLastRowInfo = new LastRowInfo(this.manager.mainFormatter.rowFormatter.subDocument.paragraphs);
        const prevPage = this.manager.layout.pages[pageIndex - 1];
        if (!prevPage)
            newLastRowInfo.reset(this.manager.mainFormatter.rowFormatter);
        else {
            const pageArea = ListUtils.last(prevPage.mainSubDocumentPageAreas);
            const column = pageArea.getLastColumn();
            newLastRowInfo.setRowInfo(column.getLastRow(), prevPage.getPosition() + pageArea.pageOffset + column.pageAreaOffset, false);
        }
        const boundsCalculator = this.manager.boundsCalculator;
        boundsCalculator.init(this.manager.model.getSectionByPosition(restartPosition));
        this.manager.mainFormatter.setParamsForRestart(LayoutFormatterState.PageStart, newLp, newLastRowInfo, resetTableFormatter);
        if (isRestartNow)
            this.manager.runFormatting(pageIndex);
    }
    calcRestartPosition(pageIndex) {
        if (pageIndex == 0)
            return 0;
        const prevPage = this.manager.layout.pages[pageIndex - 1];
        const pageArea = ListUtils.last(prevPage.mainSubDocumentPageAreas);
        const column = pageArea.getLastColumn();
        const row = column.getLastRow();
        const box = ListUtils.last(row.boxes);
        const lastPosition = prevPage.getPosition() + pageArea.pageOffset + column.pageAreaOffset + row.columnOffset + box.rowOffset + box.getLength();
        const tableCellInfo = row.tableCellInfo;
        if (!tableCellInfo || tableCellInfo.boundFlags.get(TableCellBoundFlags.StartOnThisColumn))
            return lastPosition;
        return Math.max(lastPosition, this.calcRestartPosition(pageIndex - 1));
    }
    restartHeaderFooterInternal(subDocument, pageIndex) {
        const page = this.manager.layout.pages[pageIndex];
        this.manager.changesManager.addPageChange(new PageChange(pageIndex, LayoutChangeType.Updated, [], []));
        if (subDocument.isHeader())
            this.manager.otherPageAreaFormatter.formatHeaderPageArea(page, subDocument.info);
        else
            this.manager.otherPageAreaFormatter.formatFooterPageArea(page, subDocument.info);
        this.manager.onPagesReady();
        this.restartFromPage(pageIndex, true, true);
    }
    restartFormatingAllLayout() {
        while (this.manager.layout.pages.shift())
            this.manager.changesManager.addPageChange(new PageChange(0, LayoutChangeType.Deleted, [], []));
        this.manager.layout.setEmptyLayout(this.manager.model.pageBackColor);
        this.manager.mainFormatter.rowFormatter.setPosition(0, true, true);
        this.manager.mainFormatter.rowFormatter.numberingListCountersManager.reset();
        const newLastRow = new LastRowInfo(this.manager.mainFormatter.rowFormatter.subDocument.paragraphs);
        newLastRow.reset(this.manager.mainFormatter.rowFormatter);
        this.manager.mainFormatter.setParamsForRestart(LayoutFormatterState.DocumentStart, null, newLastRow, true);
        this.manager.runFormatting(0);
    }
    restartByAnchoredObject(page) {
        const pageIndex = page.index;
        const subDocument = this.manager.mainFormatter.subDocument;
        if (!subDocument.tables.length)
            return this.restartFromPage(pageIndex, false, true);
        const lp = new LayoutPosition(DocumentLayoutDetailsLevel.Page);
        lp.pageIndex = pageIndex;
        lp.page = page;
        let table = this.manager.invalidator.isPageStartWithMultipageTable(page);
        if (!table) {
            if (!this.manager.mainFormatter.tableFormatter || this.manager.activeFormatter.subDocument.isMain())
                return this.restartFromPage(pageIndex, false, true);
            return this.restartFromPage(pageIndex, false, false);
        }
        labelEnd: for (lp.pageAreaIndex = 0; lp.pageArea = lp.page.mainSubDocumentPageAreas[lp.pageAreaIndex]; lp.pageAreaIndex++) {
            for (lp.columnIndex = 0; lp.column = lp.pageArea.columns[lp.columnIndex]; lp.columnIndex++) {
                for (lp.rowIndex = 0; lp.row = lp.column.rows[lp.rowIndex]; lp.rowIndex++) {
                    if (!lp.row.tableCellInfo ||
                        lp.row.tableCellInfo.parentRow.parentTable.getTopLevelColumn().logicInfo.grid.table.index != table.index)
                        break labelEnd;
                }
            }
        }
        if (!lp.pageArea || !lp.column || !lp.row)
            return this.restartFromPage(pageIndex, false, true);
        this.restartFromRow(lp, this.manager.invalidator.getStartModelPositionOfRow(lp), false, false);
        this.manager.floatingRestartInfoHolder.init();
    }
    restartFromRow(lp, modelPosition, isRestartNow, removePrevAncObjects = true) {
        if (lp.isFirstRowOnPage())
            return this.restartFromPage(lp.page.index, isRestartNow, true);
        const mainFormatter = this.manager.mainFormatter;
        const newLastRowInfo = new LastRowInfo(mainFormatter.rowFormatter.subDocument.paragraphs);
        const prevRowLP = lp.clone();
        if (prevRowLP.advanceToPrevRow(this.manager.layout)) {
            newLastRowInfo.setRowInfo(prevRowLP.row, lp.getLogPosition(DocumentLayoutDetailsLevel.Column) + prevRowLP.row.columnOffset, true);
        }
        else {
            newLastRowInfo.setRowInfo(null, 0, true);
        }
        if (!this.restartCommonPart(modelPosition))
            return;
        const pageChange = this.createNewLayoutPage(lp, modelPosition);
        if (removePrevAncObjects) {
            const ancPosInfo = this.manager.layout.anchorObjectsPositionInfo;
            const rowPos = this.manager.invalidator.getStartModelPositionOfRow(lp);
            lp.page.anchoredObjectHolder.objects = NumberMapUtils.reducedMap(lp.page.anchoredObjectHolder.objects, (obj) => {
                if (ancPosInfo.getPosition(obj.objectId) >= rowPos) {
                    if (obj.getType() == LayoutBoxType.AnchorTextBox) {
                        const id = obj.internalSubDocId;
                        delete lp.page.otherPageAreas[id];
                        pageChange.otherPageAreaChanges.push(new PageAreaChange(id, LayoutChangeType.Deleted));
                    }
                    else
                        pageChange.anchoredPictureChanges.push(new AnchoredPictureChange(obj.objectId, LayoutChangeType.Deleted));
                    return null;
                }
                else
                    return obj;
            });
        }
        this.setBoundsCalculatorState(modelPosition, lp.page, lp.pageIndex);
        const boundsCalculator = this.manager.boundsCalculator;
        const pageAreaBounds = ListUtils.last(boundsCalculator.mainPageAreasBounds);
        const columnsBounds = ListUtils.last(boundsCalculator.mainColumnsBounds);
        mainFormatter.setBoundsForRestart(pageAreaBounds, columnsBounds);
        const bounds = new FixedInterval(lp.pageArea.x + columnsBounds[lp.columnIndex].x, columnsBounds[lp.columnIndex].width);
        mainFormatter.layoutRowBoundsCalculator.resetByColumn(lp.page.anchoredObjectHolder.objects, bounds, false);
        mainFormatter.setParamsForRestart(LayoutFormatterState.RowFormatting, lp, newLastRowInfo, true);
        if (isRestartNow)
            this.manager.runFormatting(lp.page.index);
    }
    setBoundsCalculatorState(modelPosition, page, pageIndex) {
        const boundsCalculator = this.manager.boundsCalculator;
        boundsCalculator.init(this.manager.model.getSectionByPosition(modelPosition));
        const prevPage = this.manager.layout.pages[pageIndex - 1];
        boundsCalculator.calculatePageBounds(prevPage ? prevPage.bottom : 0);
        const layoutOtherPageAreasInfo = page.getLayoutOtherPageAreasInfo();
        if (layoutOtherPageAreasInfo.headerPageArea)
            boundsCalculator.setHeaderBounds(layoutOtherPageAreasInfo.headerPageArea.columns[0].height);
        if (layoutOtherPageAreasInfo.footerPageArea)
            boundsCalculator.setFooterBounds(layoutOtherPageAreasInfo.footerPageArea.columns[0].height);
        boundsCalculator.calculateMainPageAreaBounds(-1);
        boundsCalculator.calculateColumnBounds(boundsCalculator.mainPageAreasBounds[boundsCalculator.mainPageAreasBounds.length - 1]);
    }
    createNewLayoutPage(lp, modelPosition) {
        const pageChange = new PageChange(lp.pageIndex, LayoutChangeType.Updated, [], []);
        lp.page = lp.page.deepCopy();
        lp.pageArea = lp.page.mainSubDocumentPageAreas[lp.pageAreaIndex];
        lp.column = lp.pageArea.columns[lp.columnIndex];
        lp.row = lp.column.rows[lp.rowIndex];
        this.manager.removeRedundantHelper.removeRedundantPageAreas(lp.page, lp.pageAreaIndex + 1, pageChange);
        const pageAreaChange = new PageAreaChange(lp.pageAreaIndex, LayoutChangeType.Updated);
        pageChange.mainPageAreaChanges.push(pageAreaChange);
        this.manager.removeRedundantHelper.removeRedundantColumnsFromArea(lp.pageArea, lp.columnIndex + 1, pageAreaChange);
        const columnChange = new ColumnChange(lp.columnIndex, LayoutChangeType.Updated);
        pageAreaChange.columnChanges.push(columnChange);
        this.manager.removeRedundantHelper.removeRedundantRowsFromColumn(lp.column, lp.rowIndex, columnChange);
        const tblIndex = ListUtils.indexBy(lp.column.tablesInfo, (tbl) => tbl.logicInfo.grid.table.getStartPosition() >= modelPosition);
        this.manager.removeRedundantHelper.removeRedundantTableInfosFromColumn(lp.column, tblIndex == -1 ? lp.column.tablesInfo.length : tblIndex, columnChange);
        return pageChange;
    }
}
