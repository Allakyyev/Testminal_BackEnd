import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { CellGridInfoManager } from '../layout-formatter/table/grid-engine/cell-grid-info-manager';
import { Table, TablePosition } from '../model/tables/main-structures/table';
import { TableCellMergingState } from '../model/tables/secondary-structures/table-base-structures';
export class SelectedTableRowInfo {
    constructor(rowIndex, cells) {
        this.rowIndex = rowIndex;
        this.cells = cells;
    }
    get row() { return this.cells[0].cell.parentRow; }
    get isSeries() {
        return ListUtils.allOf(this.cells, (cellInfo, cellInd) => cellInfo.cellIndex == this.cells[cellInd - 1].cellIndex + 1, 1);
    }
    get columnCountInSeries() {
        return this.isSeries ? ListUtils.accumulateNumber(this.cells, (cellInfo) => cellInfo.cell.columnSpan) : 0;
    }
}
export class SelectedTableCellInfo {
    constructor(cell, cellIndex) {
        this.cell = cell;
        this.cellIndex = cellIndex;
    }
}
export class TableSelectionData {
    constructor(info, rows) {
        this.info = info;
        this.rows = rows;
        if (!rows[0]) {
            this._isSquare = false;
            this._isSelectedEntireTable = false;
            this._withoutGapByRows = false;
            this._areCellsSelectedInSeries = false;
        }
    }
    get numRows() { return this.rows.length; }
    get startRowIndex() { return this.rows[0].rowIndex; }
    get isSquare() { return this._isSquare === undefined ? (this._isSquare = this.calculateIsSquare()) : this._isSquare; }
    ;
    get firstCell() { return this.firstCellInfo.cell; }
    get firstCellInfo() { return this.firstRowInfo.cells[0]; }
    get firstRowInfo() { return this.rows[0]; }
    get lastCellInfo() { return ListUtils.last(this.lastRowInfo.cells); }
    get lastCell() { return this.lastCellInfo.cell; }
    get lastRowInfo() { return ListUtils.last(this.rows); }
    get withoutGapByRows() {
        return this._withoutGapByRows === undefined ?
            (this._withoutGapByRows = ListUtils.allOf(this.rows, (row, i) => row.rowIndex == this.rows[i - 1].rowIndex + 1, 1)) : this._withoutGapByRows;
    }
    get isSelectedEntireTable() {
        return this._isSelectedEntireTable === undefined ?
            (this._isSelectedEntireTable = this.numRows == this.info.table.rows.length &&
                ListUtils.allOf2(this.rows, this.info.table.rows, (selR, modelR) => selR.cells.length == modelR.cells.length)) :
            this._isSelectedEntireTable;
    }
    get areCellsSelectedInSeries() {
        return this._areCellsSelectedInSeries === undefined ?
            (this._areCellsSelectedInSeries = ListUtils.allOf(this.rows, (rowInfo, rowInd) => (rowInd == 0 || (rowInfo.rowIndex == this.rows[rowInd - 1].rowIndex + 1)) && rowInfo.isSeries)) :
            this._areCellsSelectedInSeries;
    }
    foreach(onEachRowCallback, onEachCellCallback) {
        for (let rowOffset = 0, rowInfo; rowInfo = this.rows[rowOffset]; rowOffset++) {
            onEachRowCallback(rowInfo);
            for (let cellOffset = 0, cellInfo; cellInfo = rowInfo.cells[cellOffset]; cellOffset++)
                onEachCellCallback(cellInfo, rowInfo);
        }
    }
    allOfCells(onEachCellCallback) {
        for (let rowOffset = 0, rowInfo; rowInfo = this.rows[rowOffset]; rowOffset++) {
            for (let cellOffset = 0, cellInfo; cellInfo = rowInfo.cells[cellOffset]; cellOffset++) {
                if (!onEachCellCallback(cellInfo, rowInfo))
                    return false;
            }
        }
        return true;
    }
    calculateIsSquare() {
        let prevInterval;
        if (!this.withoutGapByRows)
            return false;
        for (let rowInfo of this.rows) {
            const rowGridInfo = this.info.gridInfoManager.tableCellInfos[rowInfo.rowIndex];
            const spans = ListUtils.map(rowInfo.cells, (cellInfo) => new FixedInterval(rowGridInfo[cellInfo.cellIndex].getGridCellIndex(), cellInfo.cell.columnSpan));
            const isSeriesofSpans = ListUtils.allOf(spans, (s, i) => s.start == spans[i - 1].end, 1);
            const currInterval = new BoundaryInterval(spans[0].start, ListUtils.last(spans).end);
            if (!isSeriesofSpans || (prevInterval && !currInterval.equals(prevInterval)))
                return false;
            prevInterval = currInterval;
        }
        return true;
    }
    atLeastOneCellFullySelected(intervals) {
        return this.numRows > 1 || (this.numRows == 1 && this.rows[0].cells.length > 1) ||
            ListUtils.unsafeAnyOf(intervals, (interval) => interval.equals(this.firstCell.interval));
    }
}
export class SelectedTableInfo {
    constructor(table, gridInfoManager, rawRowsData, extendedRowsData) {
        this.table = table;
        this.gridInfoManager = gridInfoManager;
        this.rawData = new TableSelectionData(this, rawRowsData);
        this.extendedData = new TableSelectionData(this, extendedRowsData);
    }
    get isSelected() { return !!this.rawData.rows.length; }
}
export class SelectedCellsCalculator {
    constructor() {
        this.map = {};
    }
    calculate(tables, intervals) {
        const table = this.findTable(tables, intervals);
        return table ?
            this.fillResult(table, intervals) :
            new SelectedTableInfo(null, null, [], []);
    }
    findTable(tables, intervals) {
        if (!tables.length)
            return null;
        const fullInterval = new BoundaryInterval(intervals[0].start, ListUtils.last(intervals).end);
        if (fullInterval.length == 0)
            return Table.getTableByPosition(tables, fullInterval.start, true);
        const startTable = Table.correctBoundTable(tables, Math.max(0, SearchUtils.normedInterpolationIndexOf(tables, (t) => t.getStartPosition(), fullInterval.start)), fullInterval.start, (index) => --index);
        let foundTable = null;
        let numFoundTablesOnOneLevel = 0;
        for (let tbl = startTable, tblInd = tbl.index; (tbl = tables[tblInd]) && (tbl.getStartPosition() <= fullInterval.end); tblInd++) {
            const inters = IntervalAlgorithms.getIntersection(tbl.interval, fullInterval);
            if (inters && (inters.length || inters.start != tbl.getEndPosition())) {
                if (!foundTable || tbl.nestedLevel < foundTable.nestedLevel) {
                    foundTable = tbl;
                    numFoundTablesOnOneLevel = 1;
                }
                else if (tbl.nestedLevel == foundTable.nestedLevel)
                    numFoundTablesOnOneLevel++;
            }
        }
        return foundTable && numFoundTablesOnOneLevel == 1 && foundTable.interval.containsInterval(fullInterval) ? foundTable : null;
    }
    fillResult(table, intervals) {
        let intervalInd = 0;
        let selInterval = BoundaryInterval.makeByConstInterval(intervals[intervalInd]);
        const tblPos = new TablePosition(table, -1, -1);
        while (tblPos.moveToNextRow()) {
            while (tblPos.moveToNextCell()) {
                const cellInterval = tblPos.cell.interval;
                const inters = IntervalAlgorithms.getIntersection(selInterval, cellInterval);
                if (inters && (inters.length || !selInterval.length && inters.start < cellInterval.end)) {
                    this.add(tblPos);
                    if (tblPos.cell.endParagrapPosition.value >= selInterval.end) {
                        const nextInterval = intervals[++intervalInd];
                        if (nextInterval)
                            selInterval = BoundaryInterval.makeByConstInterval(nextInterval);
                        else
                            return this.extendMergedCells(table);
                    }
                }
            }
        }
        return this.extendMergedCells(table);
    }
    add(tblPos) {
        tblPos = tblPos.clone();
        const oldVal = this.map[tblPos.rowIndex];
        if (oldVal)
            oldVal.push(tblPos);
        else
            this.map[tblPos.rowIndex] = [tblPos];
    }
    extendMergedCells(table) {
        const gridInfoManager = new CellGridInfoManager(table);
        const weakPositions = NumberMapUtils.toListBy(this.map, (poss) => ListUtils.deepCopy(poss));
        ListUtils.forEach(weakPositions, (tblPoss) => {
            ListUtils.forEach(tblPoss, (tblPos) => {
                if (tblPos.cell.verticalMerging != TableCellMergingState.None) {
                    const cellInfo = gridInfoManager.gridInfosByTablePosition(tblPos);
                    ListUtils.forEachOnInterval(cellInfo.rowIndexesInterval, (rowIndex) => {
                        this.add(new TablePosition(table, rowIndex, cellInfo.getCellIndexAbs(rowIndex)).init());
                    });
                }
            });
        });
        const rowsInfo = NumberMapUtils.toListBy(this.map, (tblPoss) => ListUtils.unique(tblPoss, (a, b) => a.cellIndex - b.cellIndex))
            .sort((a, b) => a[0].rowIndex - b[0].rowIndex);
        return new SelectedTableInfo(table, gridInfoManager, SelectedCellsCalculator.translateRowPositionsToSelectedInfo(weakPositions), SelectedCellsCalculator.translateRowPositionsToSelectedInfo(rowsInfo));
    }
    static translateRowPositionsToSelectedInfo(poss) {
        return ListUtils.map(poss, (rowCellsPoss) => new SelectedTableRowInfo(rowCellsPoss[0].rowIndex, ListUtils.map(rowCellsPoss, (tblPos) => new SelectedTableCellInfo(tblPos.cell, tblPos.cellIndex))));
    }
}
export class TableSelectionExtender {
    static correctIntervalDueToTables(subDocument, newInterval) {
        if (newInterval.length == 0 || subDocument.tables.length == 0)
            return;
        var startCell = Table.getTableCellByPosition(subDocument.tables, newInterval.start);
        var endCell = Table.getTableCellByPosition(subDocument.tables, newInterval.end);
        if (startCell == null && endCell == null)
            return;
        if (startCell == null && endCell != null) {
            if (newInterval.end != endCell.parentRow.getStartPosition())
                newInterval.expand(new FixedInterval(newInterval.end, endCell.parentRow.getEndPosition() - newInterval.end));
            return;
        }
        if (startCell != null && newInterval.end == startCell.endParagrapPosition.value) {
            newInterval.expand(startCell.interval);
            return;
        }
        if ((startCell != null && endCell == null) || TableSelectionExtender.firstCellIsParentCellForSecondCellsTable(endCell, startCell)) {
            if (newInterval.end != startCell.parentRow.parentTable.getEndPosition())
                newInterval.expand(new FixedInterval(startCell.parentRow.getStartPosition(), newInterval.start - startCell.parentRow.getStartPosition()));
            return;
        }
        var startTable = Table.getTableByPosition(subDocument.tables, newInterval.start, false);
        var endTable = Table.getTableByPosition(subDocument.tables, newInterval.end, false);
        if (startTable != endTable) {
            newInterval.expand(new FixedInterval(startCell.parentRow.getStartPosition(), newInterval.start - startCell.parentRow.getStartPosition()));
            if (newInterval.end != endCell.parentRow.getStartPosition())
                newInterval.expand(new FixedInterval(newInterval.end, endCell.parentRow.getEndPosition() - newInterval.end));
            return;
        }
        if (startCell != null && endCell != null && startCell != endCell && startCell.parentRow.parentTable == endCell.parentRow.parentTable) {
            newInterval.expand(startCell.interval);
            if (newInterval.end != endCell.startParagraphPosition.value)
                newInterval.expand(endCell.interval);
            return;
        }
    }
    static firstCellIsParentCellForSecondCellsTable(firstCell, secondCell) {
        if (firstCell == null || secondCell == null || secondCell.parentRow.parentTable.parentCell == null)
            return false;
        var parentTable = secondCell.parentRow.parentTable;
        while (parentTable.parentCell != null) {
            if (parentTable.parentCell == firstCell)
                return true;
            parentTable = parentTable.parentCell.parentRow.parentTable;
        }
        return false;
    }
}
