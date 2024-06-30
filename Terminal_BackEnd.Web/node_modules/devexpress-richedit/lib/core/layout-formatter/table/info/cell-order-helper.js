import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { TablePositionIndexes } from '../../../model/tables/main-structures/table';
export class CellOrderHelper {
    constructor(tableInfo) {
        this.tableInfo = tableInfo;
    }
    getFirstNotFullyRenderedCell(startRowIndex) {
        const pos = ListUtils.unsafeAnyOf(this.tableInfo.rows, (_, rowInd) => this.getNextPositionOnRow(rowInd, 0, false, true, () => true), startRowIndex);
        if (ListUtils.allOf(this.tableInfo.table.rows[startRowIndex].cells, (_cell, cellIndex) => {
            const cellInfo = this.tableInfo.rows[startRowIndex].cells[cellIndex];
            return cellInfo.isContendFullyPlaced ||
                startRowIndex < this.tableInfo.grid.tableCellInfos[startRowIndex][cellIndex].getEndRowIndex() - 1 &&
                    cellInfo.isSomeLayoutRowsPlaced;
        }))
            return this.getFirstNotFullyRenderedCell(startRowIndex + 1);
        return pos;
    }
    getNextPos(currTblPos) {
        const info = this.tableInfo.grid.tableCellInfos[currTblPos.rowIndex][currTblPos.cellIndex];
        const nextGridCellIndex = info.getGridCellIndex() + info.getColumnSpan(this.tableInfo.grid.table);
        const ind = this.getNextPositionOnRow(currTblPos.rowIndex, nextGridCellIndex, false, false, () => true);
        if (ind)
            return ind;
        if (this.getNextPositionOnRow(currTblPos.rowIndex, 0, true, true, (info) => info.getEndRowIndex() - 1 == currTblPos.rowIndex))
            return null;
        const res = ListUtils.unsafeAnyOf(this.tableInfo.rows, (_, rowInd) => this.getNextPositionOnRow(rowInd, 0, false, false, (info) => info.getStartRowIndex() == rowInd), currTblPos.rowIndex + 1);
        if (res && res.rowIndex > currTblPos.rowIndex + 1) {
            const prevRowIndex = res.rowIndex - 1;
            const cells = this.tableInfo.rows[prevRowIndex].cells;
            let cantMoveToNextRow = false;
            for (let cellIndex = 0, cellInfo; cellInfo = cells[cellIndex]; cellIndex++) {
                const cellGridInfo = this.tableInfo.grid.tableCellInfos[prevRowIndex][cellIndex];
                if (cellGridInfo.getLastRowIndex() > prevRowIndex) {
                    cantMoveToNextRow = false;
                    break;
                }
                else if (cellGridInfo.getLastRowIndex() == prevRowIndex) {
                    if (!cellInfo.isContendFullyPlaced)
                        cantMoveToNextRow = true;
                }
            }
            if (cantMoveToNextRow)
                return null;
        }
        return res;
    }
    isTableFullyFormatted() {
        return !this.getNextPositionOnRow(this.tableInfo.rows.length - 1, 0, true, true, () => true);
    }
    getNextPositionOnRow(rowIndex, startGridCellIndex, isConsiderGridBeforeAndAfter, isSkipConsiderRenderInThisColumn, handleCell) {
        const numCells = this.tableInfo.grid.columns.positions.length - 1;
        const cellInfos = this.tableInfo.grid.tableCellGridInfos[rowIndex];
        const table = this.tableInfo.grid.table;
        for (let cellGridIndex = startGridCellIndex; cellGridIndex < numCells;) {
            const info = cellInfos[cellGridIndex];
            if (info) {
                if (handleCell(info)) {
                    if (!this.isCellContendFullyPlaced(info) && (isSkipConsiderRenderInThisColumn || !this.cellRenderedOnThisColumn(info)))
                        return new TablePositionIndexes(rowIndex, info.getCellIndex(rowIndex - info.getStartRowIndex()));
                }
                cellGridIndex += info.getColumnSpan(table);
            }
            else {
                if (isConsiderGridBeforeAndAfter) {
                    const rowGridInfo = this.tableInfo.grid.tableCellGridInfos[rowIndex - 1];
                    if (rowGridInfo) {
                        const elem = rowGridInfo[cellGridIndex];
                        if (elem && !this.isCellContendFullyPlaced(elem) && (isSkipConsiderRenderInThisColumn || !this.cellRenderedOnThisColumn(info)))
                            return new TablePositionIndexes(rowIndex - 1, elem.getCellIndex(rowIndex - 1 - elem.getStartRowIndex()));
                    }
                }
                cellGridIndex++;
            }
        }
        return null;
    }
    isCellContendFullyPlaced(info) {
        const rowIndex = info.getStartRowIndex();
        const cellIndex = info.getCellIndex(0);
        const cellInfo = this.tableInfo.rows[rowIndex].cells[cellIndex];
        return cellInfo.isContendFullyPlaced;
    }
    cellRenderedOnThisColumn(info) {
        const cellGridIndex = info.getGridCellIndex();
        const minRowIndex = info.getStartRowIndex();
        const rows = this.tableInfo.currLayoutTableColumnInfo.tableRows;
        for (let layoutRowIndex = rows.length - 1, row; (row = rows[layoutRowIndex]) && row.rowIndex >= minRowIndex; layoutRowIndex--)
            if (row.getCellIndexByExactlyCellGridIndex(cellGridIndex) >= 0)
                return true;
        return false;
    }
}
