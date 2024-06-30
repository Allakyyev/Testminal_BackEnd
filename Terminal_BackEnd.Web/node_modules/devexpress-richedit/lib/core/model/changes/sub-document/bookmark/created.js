import { ModelChangeType } from '../../enums';
export class BookmarkCreatedSubDocumentChange {
    constructor(subDocumentId, bkmTempate, deleted = false) {
        this.subDocumentId = subDocumentId;
        this.bkmTempate = bkmTempate;
        this.deleted = deleted;
        this.type = ModelChangeType.BookmarkCreated;
    }
    toJSON(_withPostData) {
        return this.deleted ?
            [[this.bkmTempate.name]] :
            [[this.bkmTempate.name, this.bkmTempate.start, this.bkmTempate.end]];
    }
}
