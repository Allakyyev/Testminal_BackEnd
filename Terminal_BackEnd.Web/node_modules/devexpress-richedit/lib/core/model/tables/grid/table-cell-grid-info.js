import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class CellGridInfo {
    constructor(rowIndex, gridCellIndex, cellIndexes) {
        this.rowIndex = rowIndex;
        this.gridCellIndex = gridCellIndex;
        this.cellIndexes = cellIndexes;
    }
    get rowIndexesInterval() {
        return new FixedInterval(this.rowIndex, this.cellIndexes.length);
    }
    getStartRowIndex() {
        return this.rowIndex;
    }
    getCellIndex(rowIndexInCell) {
        return this.cellIndexes[rowIndexInCell];
    }
    getCellIndexAbs(rowIndexInTable) {
        return this.cellIndexes[rowIndexInTable - this.rowIndex];
    }
    getNumRowsInCell() {
        return this.cellIndexes.length;
    }
    getGridCellIndex() {
        return this.gridCellIndex;
    }
    getGridCellIndexEnd(table) {
        return this.gridCellIndex + this.getColumnSpan(table);
    }
    addCellIndex(index) {
        this.cellIndexes.push(index);
        return this;
    }
    intersectRow(rowIndex) {
        return rowIndex >= this.rowIndex && rowIndex < this.getEndRowIndex();
    }
    getEndRowIndex() {
        return this.rowIndex + this.cellIndexes.length;
    }
    getLastRowIndex() {
        return this.getEndRowIndex() - 1;
    }
    getColumnSpan(table) {
        return table.rows[this.getStartRowIndex()].cells[this.getCellIndex(0)].columnSpan;
    }
    intersectGridColumn(columnIndex, columnSpan) {
        return columnIndex >= this.gridCellIndex && columnIndex < this.gridCellIndex + columnSpan;
    }
}
