import { TableBasedHistoryItem } from './create-table-history-item';
export class SplitTableCellToTheLeftHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, copyProperties) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        this.copyProperties = copyProperties;
    }
    redo() {
        this.modelManipulator.table.splitTableCellHorizontally(this.boundSubDocument, this.getTable(), this.rowIndex, this.cellIndex, false, this.copyProperties);
    }
    undo() {
        this.modelManipulator.table.restoreSplittedCellHorizontally(this.boundSubDocument, this.getTable(), this.rowIndex, this.cellIndex + 1, false);
    }
}
export class SplitTableCellToTheRightHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex, rowIndex, cellIndex, copyProperties) {
        super(modelManipulator, boundSubDocument, tableIndex);
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        this.copyProperties = copyProperties;
    }
    redo() {
        this.modelManipulator.table.splitTableCellHorizontally(this.boundSubDocument, this.getTable(), this.rowIndex, this.cellIndex, true, this.copyProperties);
    }
    undo() {
        this.modelManipulator.table.restoreSplittedCellHorizontally(this.boundSubDocument, this.getTable(), this.rowIndex, this.cellIndex, true);
    }
}
