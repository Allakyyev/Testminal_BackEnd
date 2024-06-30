import { ModelChangeType } from '../../enums';
export class TableRowRemovedSubDocumentChange {
    constructor(subDocumentId, table, rowIndex) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.rowIndex = rowIndex;
        this.type = ModelChangeType.TableRowRemoved;
    }
}
