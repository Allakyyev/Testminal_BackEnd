import { DeleteBookmarkHistoryItem } from '../core/model/history/items/bookmark-history-items';
import { ApiUtils } from './api-utils/api-utils';
import { IntervalApi } from './interval';
import { SubDocumentApi } from './sub-document';
export class BookmarkApi {
    constructor(processor, subDocument, bookmark) {
        this._bookmark = bookmark;
        this._subDocument = subDocument;
        this._processor = processor;
    }
    get index() {
        return ApiUtils.getObject(this._subDocument.bookmarks, (b) => b.start, this._bookmark.start, this._bookmark);
    }
    get subDocument() {
        return new SubDocumentApi(this._processor, this._subDocument);
    }
    get interval() {
        return new IntervalApi(this._bookmark.start, this._bookmark.length);
    }
    get name() { return this._bookmark.name; }
    delete() {
        this._processor.modelManager.history.addAndRedo(new DeleteBookmarkHistoryItem(this._processor.modelManager.modelManipulator, this._subDocument, this._bookmark.constBookmark));
    }
}
