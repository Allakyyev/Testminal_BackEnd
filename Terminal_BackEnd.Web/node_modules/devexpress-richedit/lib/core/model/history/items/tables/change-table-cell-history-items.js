import { TableBasedHistoryItem } from './create-table-history-item';
export class ShiftTableStartPositionToTheRightHistoryItem extends TableBasedHistoryItem {
    redo() {
        this.modelManipulator.table.shiftTableStartPositionToTheRight(this.boundSubDocument, this.getTable());
    }
    undo() {
        this.modelManipulator.table.restoreShiftedTableStartPositionToTheRight(this.boundSubDocument, this.getTable());
    }
}
export class TableRowConditionalFormattingHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, formatting) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.formatting = formatting;
        this.rowIndex = rowIndex;
    }
    redo() {
        let row = this.getTable().rows[this.rowIndex];
        this.oldFormatting = row.conditionalFormatting;
        row.conditionalFormatting = this.formatting;
    }
    undo() {
        this.getTable().rows[this.rowIndex].conditionalFormatting = this.oldFormatting;
    }
}
export class TableCellConditionalFormattingHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, formatting) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.formatting = formatting;
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
    }
    redo() {
        let cell = this.getTable().rows[this.rowIndex].cells[this.cellIndex];
        this.oldFormatting = cell.conditionalFormatting;
        cell.conditionalFormatting = this.formatting;
    }
    undo() {
        this.getTable().rows[this.rowIndex].cells[this.cellIndex].conditionalFormatting = this.oldFormatting;
    }
}
