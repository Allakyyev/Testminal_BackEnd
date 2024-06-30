import { TableBasedHistoryItem } from './create-table-history-item';
export class RemoveTableCellHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, subDocument, tableIndex, rowIndex, cellIndex) {
        super(modelManipulator, subDocument, tableIndex);
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        this.cell = this.getTable().rows[rowIndex].cells[cellIndex];
        this.length = this.cell.interval.length;
    }
    redo() {
        this.modelManipulator.table.removeCell(this.boundSubDocument, this.getTable(), this.rowIndex, this.cellIndex);
    }
    undo() {
        this.modelManipulator.table.insertCell(this.boundSubDocument, this.getTable(), this.rowIndex, this.cellIndex, this.cell, this.length);
    }
}
