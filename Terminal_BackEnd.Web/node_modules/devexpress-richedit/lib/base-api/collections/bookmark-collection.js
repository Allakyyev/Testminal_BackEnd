import { BookmarkCollection } from '../../model-api/collections/bookmark-collection';
import { BookmarkBaseApi } from '../bookmark';
export class BookmarkCollectionBaseApi extends BookmarkCollection {
    constructor(core, subDocument) {
        super(core, subDocument);
        this._core = core;
    }
    _getItem(coreItem) {
        return new BookmarkBaseApi(this._core, this._subDocument, coreItem);
    }
}
