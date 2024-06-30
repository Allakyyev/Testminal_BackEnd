import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { TableCellBoundFlags } from '../../../layout/table/layout-table-cell-info';
import { LayoutPositionBaseAdvanceHelper } from './base-advance-helper';
export class LayoutPositionAdvanceForwardHelper extends LayoutPositionBaseAdvanceHelper {
    advance() {
        return this.finalHandle(this.advanceBoxSimple(false, true) ? true : this.moveToNextRow());
    }
    moveToNextRow() {
        const oldCell = this.lp.row.tableCellInfo;
        if (!oldCell)
            return this.advanceRowSimple(true, true);
        if (this.advanceRowSimple(false, true)) {
            const newCell = this.lp.row.tableCellInfo;
            if (newCell && (newCell == oldCell || newCell.parentRow.parentTable.parentCell == oldCell))
                return true;
        }
        return this.moveToNextCell(oldCell);
    }
    moveToNextCell(cell) {
        const logicInfo = cell.parentRow.parentTable.logicInfo;
        const grid = logicInfo.grid;
        const rowIndex = cell.parentRow.rowIndex;
        const info = grid.tableCellGridInfos[rowIndex][cell.cellGridIndex];
        if (!cell.boundFlags.get(TableCellBoundFlags.EndOnThisColumn)) {
            this.setRowByGridInfo(true, logicInfo, info, true, true);
            return true;
        }
        const nextTableCellGridInfo = LayoutPositionBaseAdvanceHelper.getNextTableCellGridInfo(true, grid, info, info.getStartRowIndex(), info.getCellIndex(0) + 1);
        if (nextTableCellGridInfo) {
            const moveToPrev = nextTableCellGridInfo.getStartRowIndex() <= rowIndex;
            const tmpLp = this.lp.clone();
            if (!this.setRowByGridInfo(true, logicInfo, nextTableCellGridInfo, !moveToPrev, false)) {
                this.lp.copyFrom(tmpLp);
                if (!moveToPrev)
                    this.setRowByGridInfo(true, logicInfo, nextTableCellGridInfo, true, true);
                else
                    throw new Error(Errors.InternalException);
            }
            return true;
        }
        const parentTbl = cell.parentRow.parentTable;
        const parentCell = parentTbl.parentCell;
        if (parentCell) {
            const indInternalTable = NumberMapUtils.keyBy(parentCell.internalTables, (tbl) => tbl == parentTbl);
            const row = parentCell.layoutRows[indInternalTable];
            if (row) {
                this.setLayoutRow(row.indexInColumn, true);
                return true;
            }
            return this.toNextRowAfterTable(parentTbl);
        }
        this.lp.copyFrom(this.oldLp);
        return this.toNextRowAfterTable(cell.parentRow.parentTable);
    }
    toNextRowAfterTable(table) {
        const logicInfo = table.logicInfo;
        let prevLp = this.lp.clone();
        let sameTable = ListUtils.elementBy(this.lp.column.tablesInfo, (tbl) => tbl.logicInfo == logicInfo);
        while (this.advanceColumnSimple(true, true)) {
            const tmpSameTable = ListUtils.elementBy(this.lp.column.tablesInfo, (tbl) => tbl.logicInfo == logicInfo);
            if (!tmpSameTable)
                break;
            prevLp = this.lp.clone();
            sameTable = tmpSameTable;
        }
        this.lp.copyFrom(prevLp);
        const rowInd = ListUtils.accumulate(ListUtils.last(sameTable.tableRows).rowCells, -1, (acc, cell) => Math.max(ListUtils.last(cell.layoutRows).indexInColumn, acc)) + 1;
        const layoutRow = this.lp.column.rows[rowInd];
        if (layoutRow) {
            const parentCell = sameTable.parentCell;
            if (!parentCell)
                return this.setLayoutRow(rowInd, true);
            if (layoutRow.tableCellInfo == parentCell)
                return this.setLayoutRow(rowInd, true);
            const lInfo = parentCell.parentRow.parentTable.logicInfo;
            const info = lInfo.grid.tableCellGridInfos[parentCell.parentRow.rowIndex][parentCell.cellGridIndex];
            if (parentCell.boundFlags.get(TableCellBoundFlags.EndOnThisColumn)) {
                this.setLayoutRow(rowInd, true);
                return true;
            }
            this.setRowByGridInfo(true, lInfo, info, true, true);
            return true;
        }
        if (!this.advanceColumnSimple(true, true))
            return false;
        this.setLayoutRow(0, true);
        return true;
    }
}
