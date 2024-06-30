import { ModelChangeType } from '../../enums';
export class FieldDeletedSubDocumentChange {
    constructor(subDocumentId, endPosition) {
        this.subDocumentId = subDocumentId;
        this.endPosition = endPosition;
        this.type = ModelChangeType.FieldDeleted;
    }
}
