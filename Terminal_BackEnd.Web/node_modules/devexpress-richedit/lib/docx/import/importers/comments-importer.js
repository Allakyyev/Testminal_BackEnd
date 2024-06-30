export class CommentsImporter {
    constructor(data) {
        this.data = data;
    }
    get comments() { return this.data.subDocumentInfo.comments; }
}
