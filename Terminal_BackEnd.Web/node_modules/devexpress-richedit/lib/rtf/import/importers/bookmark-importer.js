import { Bookmark } from '../../../core/model/bookmarks';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { ImportBookmarkInfo } from '../model/bookmark/import-bookmark-info';
import { RtfBaseImporter } from './importer-base';
export class RtfBookmarkImporter extends RtfBaseImporter {
    get bookmarks() { return this.data.positionStates.last.bookmarks; }
    ;
    constructor(data) {
        super(data);
    }
    getBookmarkByName(bookmarkName) {
        let bookmark = this.bookmarks[bookmarkName];
        if (!bookmark) {
            bookmark = new ImportBookmarkInfo();
            bookmark.name = bookmarkName;
            this.bookmarks[bookmarkName] = bookmark;
        }
        return bookmark;
    }
    insertBookmarks() {
        StringMapUtils.forEach(this.bookmarks, (bookmark, name) => {
            if (bookmark.validate(this.subDocument))
                this.subDocument.bookmarks.push(new Bookmark(this.subDocument.positionManager, new BoundaryInterval(bookmark.start, bookmark.end), name));
        });
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
        this.insertBookmarks();
    }
}
