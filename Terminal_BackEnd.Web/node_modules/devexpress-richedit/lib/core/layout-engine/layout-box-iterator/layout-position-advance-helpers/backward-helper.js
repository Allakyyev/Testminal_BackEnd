import { Errors } from '@devexpress/utils/lib/errors';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { LayoutPositionDiscardHelper } from '../../../layout/layout-position';
import { TableCellBoundFlags } from '../../../layout/table/layout-table-cell-info';
import { LayoutPositionBaseAdvanceHelper } from './base-advance-helper';
export class LayoutPositionAdvanceBackwardHelper extends LayoutPositionBaseAdvanceHelper {
    advance() {
        if (this.lp.charOffset != 0) {
            LayoutPositionDiscardHelper.onEndCharLevel(this.lp);
            return true;
        }
        return this.finalHandle(this.advanceBoxSimple(false, false) ? true : this.moveToPrevRow());
    }
    moveToPrevRow() {
        const oldCell = this.lp.row.tableCellInfo;
        if (!oldCell) {
            if (!this.advanceRowSimple(true, false))
                return false;
            const cellInfo = this.lp.row.tableCellInfo;
            if (!cellInfo)
                return true;
            this.setOnLastCellOnTable(cellInfo.parentRow.parentTable.logicInfo);
            return true;
        }
        if (this.advanceRowSimple(false, false)) {
            const newCell = this.lp.row.tableCellInfo;
            if (newCell) {
                if (newCell == oldCell || oldCell.parentRow.parentTable.parentCell == newCell)
                    return true;
                if (newCell.parentRow.parentTable.parentCell == oldCell) {
                    this.setOnLastCellOnTable(newCell.parentRow.parentTable.logicInfo);
                    return true;
                }
            }
        }
        return this.moveToPrevCell(oldCell);
    }
    setOnLastCellOnTable(logicInfo) {
        const grid = logicInfo.grid;
        const rowIndex = grid.tableCellInfos.length - 1;
        const cellIndex = grid.tableCellInfos[rowIndex].length - 1;
        const prevTableCellGridInfo = LayoutPositionBaseAdvanceHelper.getNextTableCellGridInfo(false, grid, null, rowIndex, cellIndex);
        this.setRowByGridInfo(false, logicInfo, prevTableCellGridInfo, false, false);
    }
    moveToPrevCell(cell) {
        const logicInfo = cell.parentRow.parentTable.logicInfo;
        const grid = logicInfo.grid;
        const rowIndex = cell.parentRow.rowIndex;
        const info = grid.tableCellGridInfos[rowIndex][cell.cellGridIndex];
        if (!cell.boundFlags.get(TableCellBoundFlags.StartOnThisColumn)) {
            this.setRowByGridInfo(false, logicInfo, info, false, true);
            return true;
        }
        const prevTableCellGridInfo = LayoutPositionBaseAdvanceHelper.getNextTableCellGridInfo(false, grid, info, rowIndex, info.getCellIndex(rowIndex - info.getStartRowIndex()) - 1);
        if (prevTableCellGridInfo) {
            const moveToNext = prevTableCellGridInfo.getEndRowIndex() - 1 >= rowIndex;
            const tmpLp = this.lp.clone();
            if (!this.setRowByGridInfo(false, logicInfo, prevTableCellGridInfo, moveToNext, false)) {
                this.lp.copyFrom(tmpLp);
                if (moveToNext)
                    this.setRowByGridInfo(false, logicInfo, prevTableCellGridInfo, false, true);
                else
                    throw new Error(Errors.InternalException);
            }
            return true;
        }
        const parentTbl = cell.parentRow.parentTable;
        const parentCell = parentTbl.parentCell;
        if (parentCell) {
            const indInternalTable = NumberMapUtils.keyBy(parentCell.internalTables, (tbl) => tbl == parentTbl);
            const row = parentCell.layoutRows[indInternalTable - 1];
            if (row) {
                this.setLayoutRow(row.indexInColumn, false);
                return true;
            }
            if (cell.boundFlags.get(TableCellBoundFlags.StartOnThisColumn))
                return this.moveToPrevCell(parentCell);
            const parentRow = parentCell.parentRow;
            const logicInfo = parentRow.parentTable.logicInfo;
            const info = logicInfo.grid.tableCellGridInfos[parentRow.rowIndex][parentCell.cellGridIndex];
            this.setRowByGridInfo(false, logicInfo, info, false, true);
            return true;
        }
        this.lp.copyFrom(this.oldLp);
        return this.advanceRowSimple(true, false);
    }
}
