import { TableBasedHistoryItem } from './create-table-history-item';
export class RemoveTableRowHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, subDocument, tableIndex, rowIndex) {
        super(modelManipulator, subDocument, tableIndex);
        this.rowIndex = rowIndex;
    }
    redo() {
        const table = this.getTable();
        this.oldRow = table.rows[this.rowIndex];
        this.cellIntervals = TableBasedHistoryItem.getRowCellsRanges(this.oldRow);
        this.modelManipulator.table.removeRow(this.boundSubDocument, table.index, this.rowIndex);
    }
    undo() {
        this.modelManipulator.table.insertRow(this.boundSubDocument, this.getTable().index, this.oldRow, this.rowIndex, this.cellIntervals);
    }
}
