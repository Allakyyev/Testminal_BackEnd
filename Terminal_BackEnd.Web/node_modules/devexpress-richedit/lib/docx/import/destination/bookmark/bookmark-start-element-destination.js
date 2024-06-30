import { BookmarkElementDestination } from './bookmark-element-destination';
export class BookmarkStartElementDestination extends BookmarkElementDestination {
    assignBookmarkPosition(bookmark) {
        bookmark.start = this.data.subDocumentInfo.positionImporter.currPosition;
    }
}
