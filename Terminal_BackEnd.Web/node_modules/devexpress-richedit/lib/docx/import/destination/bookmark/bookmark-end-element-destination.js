import { BookmarkElementDestination } from './bookmark-element-destination';
export class BookmarkEndElementDestination extends BookmarkElementDestination {
    assignBookmarkPosition(bookmark) {
        bookmark.end = this.data.subDocumentInfo.positionImporter.currPosition;
    }
}
