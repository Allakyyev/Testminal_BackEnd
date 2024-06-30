import { ModelChangeType } from '../../enums';
export class TableCellRemovedSubDocumentChange {
    constructor(subDocumentId, table, rowIndex, cellIndex) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        this.type = ModelChangeType.TableCellRemoved;
    }
}
