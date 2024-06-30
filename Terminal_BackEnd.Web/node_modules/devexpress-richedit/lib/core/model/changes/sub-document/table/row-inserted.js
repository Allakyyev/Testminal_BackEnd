import { ModelChangeType } from '../../enums';
export class TableRowInsertedSubDocumentChange {
    constructor(subDocumentId, table, rowIndex) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.rowIndex = rowIndex;
        this.type = ModelChangeType.TableRowInserted;
    }
}
