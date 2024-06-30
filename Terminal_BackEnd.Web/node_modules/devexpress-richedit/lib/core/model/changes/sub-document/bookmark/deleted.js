import { ModelChangeType } from '../../enums';
export class BookmarkDeletedSubDocumentChange {
    constructor(subDocumentId, bkmTempate, deleted = false) {
        this.subDocumentId = subDocumentId;
        this.bkmTempate = bkmTempate;
        this.deleted = deleted;
        this.type = ModelChangeType.BookmarkDeleted;
    }
    toJSON(_withPostData) {
        return this.deleted ?
            [[this.bkmTempate.name]] :
            [[this.bkmTempate.name, this.bkmTempate.start, this.bkmTempate.end]];
    }
}
