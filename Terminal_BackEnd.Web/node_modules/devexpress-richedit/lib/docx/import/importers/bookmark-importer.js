import { Bookmark } from '../../../core/model/bookmarks';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
export class BookmarkImporter {
    constructor(data) {
        this.data = data;
        this.bookmarks = {};
    }
    insertBookmarks() {
        StringMapUtils.forEach(this.bookmarks, (bkm) => {
            if (bkm.validate(this.data.subDocument))
                this.data.subDocument.bookmarks.push(new Bookmark(this.data.subDocument.positionManager, new BoundaryInterval(bkm.start, bkm.end), bkm.name));
        });
    }
}
