import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { Bookmark, ConstBookmark } from '../../core/model/bookmarks';
import { CreateBookmarkHistoryItem, DeleteBookmarkHistoryItem } from '../../core/model/history/items/bookmark-history-items';
import { BookmarksManipulator } from '../../core/model/manipulators/bookmarks-manipulator';
import { Constants } from '@devexpress/utils/lib/constants';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { findBookmarkByName } from '../api-utils/bookmark-finder';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { BookmarkApi } from '../bookmark';
import { Collection } from './collection';
export class BookmarkCollection extends Collection {
    constructor(processor, subDocument) {
        super(processor);
        this._subDocument = subDocument;
    }
    find(position) {
        const sd = this._subDocument;
        return ListUtils.map(ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", (pos) => sd.findBookmarkByInterval([new FixedInterval(pos, 0)]), 0, Constants.MAX_SAFE_INTEGER),
            ModelParametersChecker.intervalDescriptor("interval", (interval) => sd.findBookmarkByInterval([new FixedInterval(interval.start, interval.length)]), 0, Constants.MAX_SAFE_INTEGER),
            ModelParametersChecker.intervalsDescriptor("intervals", (apiIntervals) => sd.findBookmarkByInterval(ListUtils.map(apiIntervals, (interval) => new FixedInterval(interval.start, interval.length))), 0, Constants.MAX_SAFE_INTEGER),
            ApiParametersChecker.stringDescriptor("name", (name) => findBookmarkByName(this._subDocument.documentModel, bkm => bkm.name == name), false),
            ApiParametersChecker.regExpDescriptor('regexp', (regexp) => findBookmarkByName(this._subDocument.documentModel, bkm => regexp.test(bkm.name)))
        ]), (b) => this._getItem(b));
    }
    create(interval, name) {
        const coreInterval = ApiParametersChecker.check(interval, 1, false, [
            ModelParametersChecker.intervalDescriptor("interval", (interval) => new FixedInterval(interval.start, interval.length)),
        ]);
        name = ApiParametersChecker.check(name, 2, false, [
            ApiParametersChecker.stringDescriptor("name", (v) => v, false)
        ]);
        if (!Bookmark.isValidName(name, true))
            return;
        const modelManager = this._processor.modelManager;
        modelManager.history.beginTransaction();
        let bkmInfo = BookmarksManipulator.findBookmark(modelManager.model.subDocuments, name);
        if (bkmInfo)
            modelManager.history.addAndRedo(new DeleteBookmarkHistoryItem(modelManager.modelManipulator, bkmInfo.subDocument, bkmInfo.bookmark.constBookmark));
        modelManager.history.addAndRedo(new CreateBookmarkHistoryItem(modelManager.modelManipulator, this._subDocument, new ConstBookmark(coreInterval, name)));
        modelManager.history.endTransaction();
        bkmInfo = BookmarksManipulator.findBookmark(modelManager.model.subDocuments, name);
        return this._getItem(bkmInfo.bookmark);
    }
    _getItem(coreItem) {
        return new BookmarkApi(this._processor, this._subDocument, coreItem);
    }
    _getCoreItems() {
        return this._subDocument.bookmarks;
    }
}
