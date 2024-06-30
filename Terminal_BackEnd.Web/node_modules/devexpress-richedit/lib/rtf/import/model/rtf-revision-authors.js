export class RtfRevisionAuthors {
    constructor() {
        this.authors = [];
    }
    getAuthor(authorIndex) {
        if (authorIndex < 0 || authorIndex >= this.authors.length)
            return RtfRevisionAuthors.unknownAuthor;
        return this.authors[authorIndex];
    }
}
RtfRevisionAuthors.unknownAuthor = "Unknown";
