import { ModelChangeType } from '../../enums';
export class TableCreatedSubDocumentChange {
    constructor(subDocumentId, table) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.type = ModelChangeType.TableCreated;
    }
}
