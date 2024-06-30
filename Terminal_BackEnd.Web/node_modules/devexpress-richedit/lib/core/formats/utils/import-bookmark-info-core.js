export class ImportBookmarkInfoCore {
    constructor() {
        this.start = -1;
        this.end = -1;
    }
    validate(subDocument) {
        if (this.start < 0 || this.end < 0)
            return false;
        const maxPos = subDocument.getDocumentEndPosition();
        this.start = Math.min(maxPos, this.start);
        this.end = Math.min(maxPos, this.end);
        if (this.start > this.end)
            [this.start, this.end] = [this.end, this.start];
        return true;
    }
}
