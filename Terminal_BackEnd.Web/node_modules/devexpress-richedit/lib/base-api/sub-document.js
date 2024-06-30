import { SubDocumentApi } from '../model-api/sub-document';
import { BookmarkCollectionBaseApi } from './collections/bookmark-collection';
export class SubDocumentBaseApi extends SubDocumentApi {
    constructor(core, subDocument) {
        super(core, subDocument);
        this._core = core;
    }
    get bookmarks() {
        return new BookmarkCollectionBaseApi(this._core, this._subDocument);
    }
}
