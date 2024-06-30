export class ContentInsertedSubDocumentChange {
    constructor(subDocumentId, position, length) {
        this.subDocumentId = subDocumentId;
        this.position = position;
        this.length = length;
    }
    canContinuesWith(nextChange) {
        if (nextChange.subDocumentId != this.subDocumentId)
            return false;
        if (nextChange.position != (this.position + this.length))
            return false;
        return true;
    }
}
