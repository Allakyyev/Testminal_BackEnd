import { __awaiter } from "tslib";
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ImportBookmarkInfo } from '../../model/import-bookmark-info';
import { LeafElementDestination } from '../destination';
export class BookmarkElementDestination extends LeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = reader.getAttributeNS('id', this.data.constants.wordProcessingNamespaceConst);
            if (id != null)
                id = StringUtils.trim(id);
            if (StringUtils.isNullOrEmpty(id))
                return;
            let name = reader.getAttributeNS('name', this.data.constants.wordProcessingNamespaceConst);
            if (!StringUtils.isNullOrEmpty(name))
                name = StringUtils.trim(name);
            let bookmark = this.data.subDocumentInfo.bookmarkImporter.bookmarks[id];
            if (!bookmark) {
                bookmark = new ImportBookmarkInfo();
                bookmark.name = name;
                this.data.subDocumentInfo.bookmarkImporter.bookmarks[id] = bookmark;
            }
            this.assignBookmarkPosition(bookmark);
        });
    }
}
