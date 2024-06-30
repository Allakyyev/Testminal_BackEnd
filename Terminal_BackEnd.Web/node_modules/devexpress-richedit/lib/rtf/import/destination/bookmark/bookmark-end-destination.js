import { DestinationType } from '../utils/destination-type';
import { BookmarkDestinationBase } from './bookmark-destination-base';
export class BookmarkEndDestination extends BookmarkDestinationBase {
    get destinationType() { return DestinationType.BookmarkEndDestination; }
    createEmptyClone() {
        return new BookmarkEndDestination(this.importer);
    }
    assignBookmarkPosition(bookmark) {
        bookmark.end = this.importer.importers.character.logPosition;
    }
}
