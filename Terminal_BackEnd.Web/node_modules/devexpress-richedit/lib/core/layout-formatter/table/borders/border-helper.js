import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { BorderInfo } from '../../../model/borders/border-info';
import { TableCellPropertiesMergerBorderBottom, TableCellPropertiesMergerBorderLeft, TableCellPropertiesMergerBorderRight, TableCellPropertiesMergerBorderTop } from '../../../model/tables/properties-mergers/table-cell-properties-merger';
import { TableRowPropertiesMergerCellSpacing } from '../../../model/tables/properties-mergers/table-row-properties-merger';
import { TableBorderCalculator } from '../../../model/tables/secondary-structures/table-border-calculator';
import { HorizontalLineBordersInfo } from './horizontal-line-borders-info';
import { LayoutCursorVerticalTableBorder, LayoutTableBorder } from './layout-table-border';
import { LayoutTableHorizontalBorder } from './layout-table-horizontal-border';
export class TableBorderInfoProvider {
    constructor(model, table, converter) {
        this.cellSpacings = ListUtils.map(table.rows, (row) => new TableRowPropertiesMergerCellSpacing(model, table, row.tablePropertiesException)
            .getProperty(row.properties, table.style, row.conditionalFormatting, model.defaultTableRowProperties)
            .asNumberNoPercentType(converter));
        const defaultProperties = model.defaultTableProperties;
        this.leftBorder = table.getActualLeftBorder(defaultProperties);
        this.rightBorder = table.getActualRightBorder(defaultProperties);
        this.bottomBorder = table.getActualBottomBorder(defaultProperties);
        this.topBorder = table.getActualTopBorder(defaultProperties);
        this.horizontalBorder = table.getActualHorizontalBorder(defaultProperties);
        this.verticalBorder = table.getActualVerticalBorder(defaultProperties);
        this.leftBorder = TableBorderInfoProvider.borderConvertToPixels(this.leftBorder, converter);
        this.rightBorder = TableBorderInfoProvider.borderConvertToPixels(this.rightBorder, converter);
        this.topBorder = TableBorderInfoProvider.borderConvertToPixels(this.topBorder, converter);
        this.bottomBorder = TableBorderInfoProvider.borderConvertToPixels(this.bottomBorder, converter);
        this.horizontalBorder = TableBorderInfoProvider.borderConvertToPixels(this.horizontalBorder, converter);
        this.verticalBorder = TableBorderInfoProvider.borderConvertToPixels(this.verticalBorder, converter);
    }
    static borderConvertToPixels(brdInfo, converter) {
        if (!brdInfo)
            return null;
        const newBrd = brdInfo.clone();
        newBrd.width = converter(newBrd.width);
        return newBrd;
    }
}
export class BorderHelper {
    constructor(tableInfo, model) {
        this.colorProvider = model.colorProvider;
        this.tableInfo = tableInfo;
        this.tblbrdProvider = new TableBorderInfoProvider(model, tableInfo.table, UnitConverter.twipsToPixels);
    }
    rowCellSpacing(rowIndex) {
        return this.tblbrdProvider.cellSpacings[rowIndex];
    }
    get borderHorizontal() {
        return this.tblbrdProvider.horizontalBorder;
    }
    get grid() { return this.tableInfo.grid; }
    get tblStyle() { return this.tableInfo.table.style; }
    getVerticalBorders() {
        const verticalBorders = [];
        const rows = this.grid.table.rows;
        const tblInfos = this.grid.tableCellInfos;
        for (var rowIndex = 0, row; row = rows[rowIndex]; rowIndex++) {
            var cellSpacing = this.rowCellSpacing(rowIndex);
            const rowBorders = [];
            const lastRowCellIndex = row.cells.length - 1;
            var cells = row.cells;
            verticalBorders.push(rowBorders);
            for (var cellIndex = 0, cell; cell = cells[cellIndex]; cellIndex++) {
                const cellBorders = [];
                rowBorders.push(cellBorders);
                var cellInfo = tblInfos[rowIndex][cellIndex];
                const cellForBorders = cellInfo.getStartRowIndex() != rowIndex ? rows[cellInfo.getStartRowIndex()].cells[cellInfo.getCellIndex(0)] : cell;
                if (cellSpacing > 0) {
                    if (cellIndex == 0) {
                        cellBorders.push(this.mergeVerticalBorders(null, null, null, null, true, this.tblbrdProvider.leftBorder, (borderWidth) => Math.floor(this.grid.columns.positions[cellInfo.getGridCellIndex()] - borderWidth / 2)));
                        cellBorders.push(this.mergeVerticalBorders(cellForBorders, TableCellPropertiesMergerBorderLeft, null, null, false, this.tblbrdProvider.leftBorder, (_borderWidth) => Math.floor(this.grid.columns.positions[cellInfo.getGridCellIndex()] + cellSpacing * 2)));
                    }
                    else
                        cellBorders.push(this.mergeVerticalBorders(cellForBorders, TableCellPropertiesMergerBorderLeft, null, null, false, this.tblbrdProvider.verticalBorder, (_borderWidth) => Math.floor(this.grid.columns.positions[cellInfo.getGridCellIndex()] + cellSpacing)));
                    cellBorders.push(this.mergeVerticalBorders(cellForBorders, TableCellPropertiesMergerBorderRight, null, null, false, this.tblbrdProvider.verticalBorder, (borderWidth) => Math.floor(this.grid.columns.positions[cellInfo.getGridCellIndex() + cell.columnSpan] - cellSpacing * (cellIndex == cells.length - 1 ? 2 : 1) - borderWidth)));
                    if (cellIndex == lastRowCellIndex)
                        cellBorders.push(this.mergeVerticalBorders(null, null, null, null, true, this.tblbrdProvider.rightBorder, (borderWidth) => Math.floor(this.getCellEndGridPosition(rowIndex, cellIndex) - borderWidth / 2)));
                }
                else {
                    if (cellIndex == 0)
                        cellBorders.push(this.mergeVerticalBorders(cellForBorders, TableCellPropertiesMergerBorderLeft, null, null, true, this.tblbrdProvider.leftBorder, (borderWidth) => Math.floor(this.grid.columns.positions[cellInfo.getGridCellIndex()] - borderWidth / 2)));
                    else {
                        const leftCell = cells[cellIndex - 1];
                        cellBorders.push(this.mergeVerticalBorders(cellForBorders, TableCellPropertiesMergerBorderLeft, leftCell, TableCellPropertiesMergerBorderRight, false, this.tblbrdProvider.verticalBorder, (_borderWidth) => Math.floor(this.grid.columns.positions[cellInfo.getGridCellIndex()])));
                    }
                    if (cellIndex == lastRowCellIndex)
                        cellBorders.push(this.mergeVerticalBorders(cellForBorders, TableCellPropertiesMergerBorderRight, null, null, true, this.tblbrdProvider.rightBorder, (borderWidth) => Math.floor(this.getCellEndGridPosition(rowIndex, cellIndex) - borderWidth / 2)));
                }
            }
        }
        return verticalBorders;
    }
    getVerticalCursorBorders() {
        let verticalBorders = [];
        let rows = this.grid.table.rows;
        let tblInfos = this.grid.tableCellInfos;
        for (var rowIndex = 0, row; row = rows[rowIndex]; rowIndex++) {
            let rowBorders = [];
            let lastRowCellIndex = row.cells.length - 1;
            verticalBorders.push(rowBorders);
            for (var cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
                let cellBorders = [];
                rowBorders.push(cellBorders);
                if (this.rowCellSpacing(rowIndex) > 0)
                    this.populateVerticalCursorBordersWithSpacing(cellIndex, rowIndex, lastRowCellIndex, this.rowCellSpacing(rowIndex), cellBorders, tblInfos[rowIndex][cellIndex]);
                else
                    this.populateVerticalCursorBorders(cellIndex, rowIndex, lastRowCellIndex, cellBorders, tblInfos[rowIndex][cellIndex]);
            }
        }
        return verticalBorders;
    }
    populateVerticalCursorBordersWithSpacing(cellIndex, rowIndex, lastRowCellIndex, cellSpacing, cellBorders, cellInfo) {
        if (cellIndex == 0)
            cellBorders.push(this.createVerticalCursorBorder(this.grid.columns.positions[cellInfo.getGridCellIndex()]));
        else
            cellBorders.push(this.createVerticalCursorBorder(this.grid.columns.positions[cellInfo.getGridCellIndex()], cellSpacing));
        if (cellIndex == lastRowCellIndex)
            cellBorders.push(this.createVerticalCursorBorder(this.grid.columns.positions[this.getCellGridColumnIndex(rowIndex, cellIndex)]));
    }
    populateVerticalCursorBorders(cellIndex, rowIndex, lastRowCellIndex, cellBorders, cellInfo) {
        if (cellIndex == 0)
            cellBorders.push(this.createVerticalCursorBorder(this.grid.columns.positions[cellInfo.getGridCellIndex()]));
        else
            cellBorders.push(this.createVerticalCursorBorder(this.grid.columns.positions[cellInfo.getGridCellIndex()]));
        if (cellIndex == lastRowCellIndex)
            cellBorders.push(this.createVerticalCursorBorder(this.grid.columns.positions[this.getCellGridColumnIndex(rowIndex, cellIndex)]));
    }
    getCellGridColumnIndex(rowIndex, cellIndex) {
        const cellGridStartPos = this.grid.tableCellInfos[rowIndex][cellIndex].getGridCellIndex();
        const cellGridColumnEndIndex = cellGridStartPos + this.grid.table.rows[rowIndex].cells[cellIndex].columnSpan;
        return cellGridColumnEndIndex;
    }
    createVerticalCursorBorder(modelXPos, cellSpacing = -1) {
        const DEFAULT_CURSOR_BORDER_WIDTH = 4;
        let size = cellSpacing != -1 ? cellSpacing : DEFAULT_CURSOR_BORDER_WIDTH;
        return new LayoutCursorVerticalTableBorder(Math.floor(modelXPos - size / 2), 0, 0, new BorderInfo().getLayoutBorder(this.colorProvider));
    }
    mergeVerticalBorders(cellA, mergerCellA, cellB, mergerCellB, isOutsideCellBorders, tableBorderInfo, getX) {
        const brd = BorderHelper.mergeThreeBorders(this.colorProvider, cellA, mergerCellA, cellB, mergerCellB, isOutsideCellBorders, tableBorderInfo, this.tblStyle, UnitConverter.twipsToPixels);
        const tableVerticalBorder = new LayoutTableBorder(0, 0, 0, brd ? brd.getLayoutBorder(this.colorProvider) : null);
        if (tableVerticalBorder.borderInfo)
            tableVerticalBorder.xPos = getX(tableVerticalBorder.borderInfo.width);
        return tableVerticalBorder;
    }
    getHorizontalBordersByRow(rowIndex, isRowFirstInLayoutColumn, isRowLastInLayoutColumn) {
        const linesInRow = [];
        if (this.rowCellSpacing(rowIndex) > 0) {
            if (isRowFirstInLayoutColumn || rowIndex == 0)
                linesInRow.push(this.collectTableHorizontalBorders(this.tblbrdProvider.topBorder, rowIndex));
            linesInRow.push(this.collectOneCellAndTableHorizontalBorders(rowIndex, TableCellPropertiesMergerBorderTop, rowIndex - 1, this.tblbrdProvider.horizontalBorder, !isRowFirstInLayoutColumn));
            linesInRow.push(this.collectOneCellAndTableHorizontalBorders(rowIndex, TableCellPropertiesMergerBorderBottom, rowIndex + 1, this.tblbrdProvider.horizontalBorder, !isRowLastInLayoutColumn));
            if (isRowLastInLayoutColumn)
                linesInRow.push(this.collectTableHorizontalBorders(this.tblbrdProvider.bottomBorder, rowIndex));
        }
        else {
            if (isRowFirstInLayoutColumn || rowIndex == 0)
                linesInRow.push(this.collectOneCellAndTableHorizontalBorders(rowIndex, TableCellPropertiesMergerBorderTop, rowIndex - 1, this.tblbrdProvider.topBorder, false));
            else
                linesInRow.push(this.collectThreeBorders(rowIndex, TableCellPropertiesMergerBorderTop, TableCellPropertiesMergerBorderBottom, this.tblbrdProvider.horizontalBorder));
            if (isRowLastInLayoutColumn)
                linesInRow.push(this.collectOneCellAndTableHorizontalBorders(rowIndex, TableCellPropertiesMergerBorderBottom, rowIndex + 1, this.tblbrdProvider.bottomBorder, false));
        }
        return linesInRow;
    }
    collectTableHorizontalBorders(tableBorderInfo, rowIndex) {
        const cells = this.grid.table.rows[rowIndex].cells;
        const lastCellIndex = cells.length - 1;
        const lastCell = cells[lastCellIndex];
        const firstCellGridInfo = this.grid.tableCellInfos[rowIndex][0];
        const lastCellGridInfo = this.grid.tableCellInfos[rowIndex][lastCellIndex];
        const horizBorder = new LayoutTableHorizontalBorder();
        horizBorder.borderInfo = tableBorderInfo.getLayoutBorder(this.colorProvider);
        horizBorder.xPosition = Math.floor(this.grid.columns.positions[firstCellGridInfo.getGridCellIndex()]);
        horizBorder.length = Math.ceil(this.grid.columns.positions[lastCellGridInfo.getGridCellIndex() + lastCell.columnSpan]) - horizBorder.xPosition;
        const horizBordersInfo = new HorizontalLineBordersInfo(true);
        horizBordersInfo.borders.push(horizBorder);
        horizBordersInfo.updateWidth(tableBorderInfo ? tableBorderInfo.width : 0);
        return horizBordersInfo;
    }
    collectOneCellAndTableHorizontalBorders(cellBorderRowIndex, getCurrCellBorderMerger, tableBorderRowIndex, tableBorderInfo, isTableBorderRowIndexValid) {
        const rows = this.grid.table.rows;
        const cells = rows[cellBorderRowIndex].cells;
        const rowCellSpacing = this.rowCellSpacing(cellBorderRowIndex);
        const horizBordersInfo = new HorizontalLineBordersInfo(true);
        for (let cellIndex = 0, cell; cell = cells[cellIndex]; cellIndex++) {
            const currCellGridTableInfo = this.grid.tableCellInfos[cellBorderRowIndex][cellIndex];
            const currCellGridStartIndex = currCellGridTableInfo.getGridCellIndex();
            const tableCellGridTableInfo = isTableBorderRowIndexValid ?
                this.grid.tableCellGridInfos[tableBorderRowIndex][currCellGridStartIndex] :
                null;
            if (currCellGridTableInfo == tableCellGridTableInfo)
                continue;
            const currCellXPosition = Math.floor(this.grid.columns.positions[currCellGridStartIndex] + rowCellSpacing * (cellIndex == 0 ? 2 : 1));
            const currCellEndGridColumn = Math.ceil(this.grid.columns.positions[currCellGridStartIndex + cell.columnSpan] - rowCellSpacing * (cellIndex == cells.length - 1 ? 2 : 1));
            const currCellBorder = getCurrCellBorderMerger ?
                TableBorderInfoProvider.borderConvertToPixels((new getCurrCellBorderMerger(cell.parentRow.tablePropertiesException, !isTableBorderRowIndexValid))
                    .getProperty(cell.properties, this.tblStyle, cell.conditionalFormatting, null), UnitConverter.twipsToPixels) :
                null;
            const horizBorder = new LayoutTableHorizontalBorder();
            horizBorder.xPosition = currCellXPosition;
            horizBorder.length = currCellEndGridColumn - currCellXPosition;
            const brd = (currCellBorder ? currCellBorder : tableBorderInfo);
            horizBorder.borderInfo = brd ? brd.getLayoutBorder(this.colorProvider) : null;
            horizBordersInfo.borders.push(horizBorder);
            horizBordersInfo.updateWidth(horizBorder.borderInfo ? horizBorder.borderInfo.width : 0);
        }
        return horizBordersInfo;
    }
    collectThreeBorders(rowIndex, getCurrCellBorderMerger, getTopCellBorderMerger, tableBorderInfo) {
        const horizBordersInfo = new HorizontalLineBordersInfo(true);
        const gridColumnsNum = this.grid.columns.numColumns;
        const prevRowIndex = rowIndex - 1;
        const gridInfosPrevRow = this.grid.tableCellGridInfos[prevRowIndex];
        const gridInfosCurrRow = this.grid.tableCellGridInfos[rowIndex];
        const prevRowCells = this.grid.table.rows[prevRowIndex].cells;
        const currRowCells = this.grid.table.rows[rowIndex].cells;
        for (let cellGridIndex = 0; cellGridIndex < gridColumnsNum; cellGridIndex++) {
            const prevCellInfo = gridInfosPrevRow[cellGridIndex];
            const currCellInfo = gridInfosCurrRow[cellGridIndex];
            if (!prevCellInfo && !currCellInfo ||
                prevCellInfo && prevRowIndex != prevCellInfo.getStartRowIndex() + prevCellInfo.getNumRowsInCell() - 1)
                continue;
            let prevCell = prevCellInfo ? prevRowCells[prevCellInfo.getCellIndex(prevRowIndex - prevCellInfo.getStartRowIndex())] : null;
            let currCell = currCellInfo ? currRowCells[currCellInfo.getCellIndex(rowIndex - currCellInfo.getStartRowIndex())] : null;
            const horizBorder = new LayoutTableHorizontalBorder();
            horizBorder.xPosition = Math.floor(this.grid.columns.positions[cellGridIndex]);
            horizBorder.length = Math.ceil(this.grid.columns.width[cellGridIndex]);
            const brd = BorderHelper.mergeThreeBorders(this.colorProvider, currCell, getCurrCellBorderMerger, prevCell, getTopCellBorderMerger, false, tableBorderInfo, this.tblStyle, UnitConverter.twipsToPixels);
            horizBorder.borderInfo = brd ? brd.getLayoutBorder(this.colorProvider) : null;
            horizBordersInfo.updateWidth(horizBorder.borderInfo ? horizBorder.borderInfo.width : 0);
            horizBordersInfo.borders.push(horizBorder);
        }
        return horizBordersInfo;
    }
    getCellEndGridPosition(rowIndex, cellIndex) {
        const cellGridStartPos = this.grid.tableCellInfos[rowIndex][cellIndex].getGridCellIndex();
        const cellGridColumnEndIndex = cellGridStartPos + this.grid.table.rows[rowIndex].cells[cellIndex].columnSpan;
        return Math.ceil(this.grid.columns.positions[cellGridColumnEndIndex]);
    }
    static mergeThreeBorders(colorProvider, cellA, mergerCellA, cellB, mergerCellB, isOutsideCellBorders, tableBorderInfo, tblStyle, converter) {
        let tblBrd;
        if (cellA && cellB) {
            tblBrd = TableBorderCalculator.getPowerfulBorder(colorProvider, TableBorderInfoProvider.borderConvertToPixels((new mergerCellA(cellA.parentRow.tablePropertiesException, isOutsideCellBorders))
                .getProperty(cellA.properties, tblStyle, cellA.conditionalFormatting, null), converter), TableBorderInfoProvider.borderConvertToPixels((new mergerCellB(cellB.parentRow.tablePropertiesException, isOutsideCellBorders))
                .getProperty(cellB.properties, tblStyle, cellB.conditionalFormatting, null), converter));
        }
        else {
            const cell = cellA || cellB;
            if (cell)
                tblBrd = TableBorderInfoProvider.borderConvertToPixels((new (mergerCellA || mergerCellB)(cell.parentRow.tablePropertiesException, isOutsideCellBorders))
                    .getProperty(cell.properties, tblStyle, cell.conditionalFormatting, null), converter);
        }
        if (!tblBrd)
            tblBrd = tableBorderInfo;
        return tblBrd;
    }
    static getLeftBorder(colorProvider, pos, siblingCell, tblBrdProv, converter) {
        return BorderHelper.getRightLeftBorder(colorProvider, pos, siblingCell, tblBrdProv, converter, pos.cellIndex == 0, TableCellPropertiesMergerBorderLeft, TableCellPropertiesMergerBorderRight);
    }
    static getRightBorder(colorProvider, pos, siblingCell, tblBrdProv, converter) {
        return BorderHelper.getRightLeftBorder(colorProvider, pos, siblingCell, tblBrdProv, converter, pos.cellIndex == pos.row.cells.length - 1, TableCellPropertiesMergerBorderRight, TableCellPropertiesMergerBorderLeft);
    }
    static getRightLeftBorder(colorProvider, pos, siblingCell, tblBrdProv, converter, isOutsideBorder, currentMerger, siblingMerger) {
        const tableStyle = pos.table.style;
        return tblBrdProv.cellSpacings[pos.rowIndex] > 0 ?
            BorderHelper.mergeThreeBorders(colorProvider, pos.cell, currentMerger, null, null, isOutsideBorder, isOutsideBorder ? tblBrdProv.leftBorder : tblBrdProv.verticalBorder, tableStyle, converter) :
            (isOutsideBorder ?
                BorderHelper.mergeThreeBorders(colorProvider, pos.cell, currentMerger, null, null, isOutsideBorder, tblBrdProv.leftBorder, tableStyle, converter) :
                BorderHelper.mergeThreeBorders(colorProvider, pos.cell, currentMerger, siblingCell, siblingMerger, isOutsideBorder, tblBrdProv.verticalBorder, tableStyle, converter));
    }
}
