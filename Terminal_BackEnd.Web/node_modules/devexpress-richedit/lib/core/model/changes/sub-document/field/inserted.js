import { ModelChangeType } from '../../enums';
export class FieldInsertedSubDocumentChange {
    constructor(subDocumentId, startPosition, separatorPosition, endPosition) {
        this.subDocumentId = subDocumentId;
        this.startPosition = startPosition;
        this.separatorPosition = separatorPosition;
        this.endPosition = endPosition;
        this.type = ModelChangeType.FieldInserted;
    }
}
