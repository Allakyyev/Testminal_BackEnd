import { TableBasedHistoryItem } from './create-table-history-item';
export class RemoveTableHistoryItem extends TableBasedHistoryItem {
    redo() {
        this.table = this.getTable();
        this.cellsRanges = TableBasedHistoryItem.getTableCellsRanges(this.table);
        this.modelManipulator.table.removeTable(this.boundSubDocument, this.table);
    }
    undo() {
        this.modelManipulator.table.restoreRemovedTable(this.boundSubDocument, this.table, this.cellsRanges);
    }
}
