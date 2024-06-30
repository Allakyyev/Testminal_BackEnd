export class ImportBookmarkInfoCore {
    constructor() {
        this.start = -1;
        this.end = -1;
    }
    validate(subDocument) {
        if (this.start < 0 || this.end < 0)
            return false;
        if (this.start > this.end) {
            const temp = this.start;
            this.start = this.end;
            this.end = temp;
        }
        const maxPosition = subDocument.getDocumentEndPosition() + 1;
        if (this.start > maxPosition)
            this.start = maxPosition;
        if (this.end > maxPosition)
            this.end = maxPosition;
        return true;
    }
}
