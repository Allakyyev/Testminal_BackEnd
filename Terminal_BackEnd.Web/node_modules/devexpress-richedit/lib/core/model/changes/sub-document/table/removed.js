import { ModelChangeType } from '../../enums';
export class TableRemovedSubDocumentChange {
    constructor(subDocumentId, startPosition, endPosition, nestedLevel, removedText) {
        this.subDocumentId = subDocumentId;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.nestedLevel = nestedLevel;
        this.removedText = removedText;
        this.type = ModelChangeType.TableRemoved;
    }
}
