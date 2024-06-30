import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { HistoryItem } from '../../base/history-item';
export class TableBasedHistoryItem extends HistoryItem {
    constructor(modelManipulator, boundSubDocument, tableIndex) {
        super(modelManipulator);
        this.boundSubDocument = boundSubDocument;
        this.tableIndex = tableIndex;
    }
    getTable() {
        return this.boundSubDocument.tables[this.tableIndex];
    }
    static getRowCellsRanges(tableRow) {
        return ListUtils.map(tableRow.cells, (cell) => cell.interval);
    }
    static getTableCellsRanges(table) {
        return ListUtils.map(table.rows, (row) => TableBasedHistoryItem.getRowCellsRanges(row));
    }
}
export class CreateTableHistoryItem extends TableBasedHistoryItem {
    constructor(modelManipulator, subDocument, firstParagraphIndex, rowCount, cellCount) {
        super(modelManipulator, subDocument, -1);
        this.firstParagraphIndex = firstParagraphIndex;
        this.rowCount = rowCount;
        this.cellCount = cellCount;
    }
    redo() {
        this.tableIndex = this.modelManipulator.table.createTable(this.boundSubDocument, this.firstParagraphIndex, this.rowCount, this.cellCount).index;
    }
    undo() {
        this.modelManipulator.table.removeTable(this.boundSubDocument, this.getTable());
    }
}
