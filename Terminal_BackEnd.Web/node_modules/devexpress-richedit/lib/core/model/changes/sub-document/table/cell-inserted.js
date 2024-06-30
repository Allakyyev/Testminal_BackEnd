import { ModelChangeType } from '../../enums';
export class TableCellInsertedSubDocumentChange {
    constructor(subDocumentId, table, rowIndex, cellIndex) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        this.type = ModelChangeType.TableCellInserted;
    }
}
