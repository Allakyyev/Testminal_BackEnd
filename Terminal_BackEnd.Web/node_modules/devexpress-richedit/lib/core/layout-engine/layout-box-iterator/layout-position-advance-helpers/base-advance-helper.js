import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutPositionDiscardHelper } from '../../../layout/layout-position';
import { TableCellBoundFlags } from '../../../layout/table/layout-table-cell-info';
import { TableCellMergingState } from '../../../model/tables/secondary-structures/table-base-structures';
export class LayoutPositionBaseAdvanceHelper {
    constructor(lp, layout) {
        this.lp = lp;
        this.layout = layout;
        this.oldLp = lp.clone();
    }
    finalHandle(result) {
        if (result && !this.lp.page)
            throw new Error("Likely model is incorrect. See last table actions");
        if (result && this.lp.page.isValid)
            return true;
        this.lp.copyFrom(this.oldLp);
        return false;
    }
    setLayoutRowInCell(cell, onStart) {
        const getInternalTableIndex = onStart ?
            (_cell) => 0 :
            (cell) => cell.layoutRows.length;
        const getInternalTableCell = onStart ?
            (internalTable) => internalTable.tableRows[0].rowCells[0] :
            (internalTable) => ListUtils.last(ListUtils.last(internalTable.tableRows).rowCells);
        let internalTable;
        while (internalTable = cell.internalTables[getInternalTableIndex(cell)])
            cell = getInternalTableCell(internalTable);
        this.setLayoutRow((onStart ? cell.layoutRows[0] : ListUtils.last(cell.layoutRows)).indexInColumn, onStart);
    }
    setLayoutRow(rowIndex, onStart) {
        this.lp.rowIndex = rowIndex;
        this.lp.row = this.lp.column.rows[this.lp.rowIndex];
        if (this.lp.row) {
            (onStart ? LayoutPositionDiscardHelper.onStartBoxLevel : LayoutPositionDiscardHelper.onEndBoxLevel)(this.lp);
            return true;
        }
        return false;
    }
    advanceBoxSimple(allowChangeHighLevels, toNext) {
        toNext ? this.lp.boxIndex++ : this.lp.boxIndex--;
        this.lp.box = this.lp.row.boxes[this.lp.boxIndex];
        if (this.lp.box) {
            toNext ? LayoutPositionDiscardHelper.onStartCharLevel(this.lp) : LayoutPositionDiscardHelper.onEndCharLevel(this.lp);
            return true;
        }
        return allowChangeHighLevels ? this.advanceRowSimple(true, toNext) : false;
    }
    advanceRowSimple(allowChangeHighLevels, toNext) {
        toNext ? this.lp.rowIndex++ : this.lp.rowIndex--;
        if (this.setLayoutRow(this.lp.rowIndex, toNext))
            return true;
        return allowChangeHighLevels ? this.advanceColumnSimple(true, toNext) : false;
    }
    advanceColumnSimple(allowChangeHighLevels, toNext) {
        toNext ? this.lp.columnIndex++ : this.lp.columnIndex--;
        this.lp.column = this.lp.pageArea.columns[this.lp.columnIndex];
        if (this.lp.column) {
            toNext ? LayoutPositionDiscardHelper.onStartRowLevel(this.lp) : LayoutPositionDiscardHelper.onEndRowLevel(this.lp);
            return true;
        }
        return allowChangeHighLevels ? this.advancePageAreaSimple(true, toNext) : false;
    }
    advancePageAreaSimple(allowChangeHighLevels, toNext) {
        toNext ? this.lp.pageAreaIndex++ : this.lp.pageAreaIndex--;
        this.lp.pageArea = this.lp.page.mainSubDocumentPageAreas[this.lp.pageAreaIndex];
        if (this.lp.pageArea) {
            toNext ? LayoutPositionDiscardHelper.onStartColumnLevel(this.lp) : LayoutPositionDiscardHelper.onEndColumnLevel(this.lp);
            return true;
        }
        return allowChangeHighLevels ? this.advancePageSimple(toNext) : false;
    }
    advancePageSimple(toNext) {
        toNext ? this.lp.pageIndex++ : this.lp.pageIndex--;
        this.lp.page = this.layout.pages[this.lp.pageIndex];
        if (!this.lp.page)
            return false;
        toNext ? LayoutPositionDiscardHelper.onStartPageAreaLevel(this.lp) : LayoutPositionDiscardHelper.onEndPageAreaLevel(this.lp);
        return true;
    }
    setRowByGridInfo(isStartFindWithStartTable, logicInfo, cellGridInfo, isAdvanceToNextColumn, isNeedColumnAdvance) {
        if (isNeedColumnAdvance)
            if (!this.advanceColumnSimple(true, isAdvanceToNextColumn))
                return false;
        const sameTable = ListUtils.elementBy(this.lp.column.tablesInfo, (tbl) => tbl.logicInfo == logicInfo);
        if (!sameTable)
            return false;
        const iteratorFunc = isStartFindWithStartTable ? ListUtils.unsafeAnyOf : ListUtils.unsafeReverseAnyOf;
        const tblRowGridInfos = logicInfo.grid.tableCellGridInfos;
        const cell = iteratorFunc(sameTable.tableRows, (row) => {
            const tblRowGridInfo = tblRowGridInfos[row.rowIndex];
            return iteratorFunc(row.rowCells, (cell) => {
                const info = tblRowGridInfo[cell.cellGridIndex];
                return info == cellGridInfo ? cell : null;
            });
        });
        if (cell && (isStartFindWithStartTable ?
            (isAdvanceToNextColumn || cell.boundFlags.get(TableCellBoundFlags.StartOnThisColumn)) :
            ((!isAdvanceToNextColumn || cell.boundFlags.get(TableCellBoundFlags.EndOnThisColumn))))) {
            this.setLayoutRowInCell(cell, isStartFindWithStartTable);
            return true;
        }
        else
            return this.setRowByGridInfo(isStartFindWithStartTable, logicInfo, cellGridInfo, isAdvanceToNextColumn, true);
    }
    static getNextTableCellGridInfo(isStartFindWithStartTable, grid, startCellInfo, startRowIndex, cellIndex) {
        let result;
        const iteratorFunc = isStartFindWithStartTable ? ListUtils.unsafeAnyOf : ListUtils.unsafeReverseAnyOf;
        if (iteratorFunc(grid.table.rows, (row, rowIndex) => {
            if (cellIndex == -2)
                cellIndex = row.cells.length - 1;
            result = iteratorFunc(row.cells, (cell, cellInd) => {
                if (cell.verticalMerging != TableCellMergingState.Continue) {
                    const currCell = grid.tableCellInfos[rowIndex][cellInd];
                    return currCell == startCellInfo ? null : currCell;
                }
                return null;
            }, cellIndex);
            if (result)
                return result;
            cellIndex = isStartFindWithStartTable ? 0 : -2;
            return null;
        }, startRowIndex))
            return result;
        return null;
    }
}
