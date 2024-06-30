import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { Bookmark, BookmarkAndSubDocument, ConstBookmark } from '../bookmarks';
import { BookmarkCreatedSubDocumentChange } from '../changes/sub-document/bookmark/created';
import { BookmarkDeletedSubDocumentChange } from '../changes/sub-document/bookmark/deleted';
import { BaseManipulator } from './base-manipulator';
export class BookmarksManipulator extends BaseManipulator {
    createBookmark(subDocument, bkmTemplate, needSort) {
        subDocument.bookmarks.push(new Bookmark(subDocument.positionManager, bkmTemplate, bkmTemplate.name));
        if (needSort)
            subDocument.bookmarks = subDocument.bookmarks.sort(ConstBookmark.comparer);
        this.modelManipulator.notifyModelChanged(new BookmarkCreatedSubDocumentChange(subDocument.id, bkmTemplate));
    }
    deleteBookmark(subDocument, bkmTemplate, bookmarkIndex = ListUtils.indexBy(subDocument.bookmarks, (b) => b.constBookmark.equals(bkmTemplate))) {
        subDocument.bookmarks.splice(bookmarkIndex, 1)[0].destructor(subDocument.positionManager);
        this.modelManipulator.notifyModelChanged(new BookmarkDeletedSubDocumentChange(subDocument.id, bkmTemplate));
    }
    static findBookmark(subDocuments, name) {
        let bookmark;
        const subDocument = NumberMapUtils.elementBy(subDocuments, (subDoc) => !!(bookmark = ListUtils.elementBy(subDoc.bookmarks, (bm) => bm.name == name)));
        return subDocument ? new BookmarkAndSubDocument(bookmark, subDocument) : null;
    }
    static copyBookmarksFromSubDocumentTo(fromSubDocument, toSubDocument, fromIntervals) {
        let bkms = [];
        IntervalAlgorithms.handleAffectedObjects(fromSubDocument.bookmarks, IntervalAlgorithms.getMergedIntervalsTemplate(fromIntervals, true, new BoundaryInterval(0, 0)), (bkm, _index, interval, intersection) => {
            if (intersection.length || bkm.interval.length == 0)
                bkms.push(new ConstBookmark(new BoundaryInterval(bkm.start - interval.start, bkm.end - interval.start), bkm.name));
        }, BookmarksManipulator.findBookmarkStartIndex);
        toSubDocument.bookmarks = ListUtils.map(ListUtils.unique(bkms, ConstBookmark.comparer, ConstBookmark.comparer), (tmlBkm) => tmlBkm.createBookmark(toSubDocument.positionManager));
    }
    deleteBookmarks(subDocument, interval) {
        const bookmarks = subDocument.bookmarks;
        const result = [];
        let ind = SearchUtils.normedInterpolationIndexOf(bookmarks, (b) => b.start, interval.start);
        while (bookmarks[ind] && bookmarks[ind].start >= interval.start)
            ind--;
        ind = Math.max(0, ind);
        for (let curr; (curr = bookmarks[ind]) && curr.interval.start <= interval.end;) {
            if (interval.containsInterval(curr.interval)) {
                const tmpl = curr.constBookmark;
                this.deleteBookmark(subDocument, tmpl, ind);
                result.push(tmpl);
            }
            else
                ind++;
        }
        return result;
    }
    insertBookmarksFromSubDocument(fromSubDocument, toSubDocument, fromInterval, modelsConstOffset) {
        const bookmarks = fromSubDocument.bookmarks;
        let ind = SearchUtils.normedInterpolationIndexOf(bookmarks, (b) => b.start, fromInterval.start);
        while (bookmarks[ind] && bookmarks[ind].start >= fromInterval.start)
            ind--;
        ind = Math.max(0, ind);
        for (let bkm; (bkm = bookmarks[ind]) && bkm.start <= fromInterval.end; ind++) {
            if (fromInterval.containsInterval(bkm.interval)) {
                const template = bkm.constBookmark;
                template.interval.start += modelsConstOffset;
                template.interval.end += modelsConstOffset;
                this.createBookmark(toSubDocument, template, false);
            }
        }
        toSubDocument.bookmarks = toSubDocument.bookmarks.sort(ConstBookmark.comparer);
    }
    static findBookmarkStartIndex(_pos, _bookmarks) {
        return 0;
    }
}
