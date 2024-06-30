import { TableBasedHistoryItem } from './create-table-history-item';
export class InsertTableRowHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, patternRow, targetRowIndex, cellIntervals) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.targetRowIndex = targetRowIndex;
        this.cellIntervals = cellIntervals;
        this.patternRow = patternRow;
    }
    redo() {
        this.modelManipulator.table.insertRow(this.boundSubDocument, this.tableIndex, this.patternRow, this.targetRowIndex, this.cellIntervals);
    }
    undo() {
        this.modelManipulator.table.removeRow(this.boundSubDocument, this.tableIndex, this.targetRowIndex);
    }
}
