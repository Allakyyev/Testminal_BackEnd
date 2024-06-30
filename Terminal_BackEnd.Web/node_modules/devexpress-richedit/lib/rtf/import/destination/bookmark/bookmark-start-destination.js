import { DestinationType } from '../utils/destination-type';
import { BookmarkDestinationBase } from './bookmark-destination-base';
export class BookmarkStartDestination extends BookmarkDestinationBase {
    get destinationType() { return DestinationType.BookmarkStartDestination; }
    createEmptyClone() {
        return new BookmarkStartDestination(this.importer);
    }
    assignBookmarkPosition(bookmark) {
        bookmark.start = this.importer.importers.character.logPosition;
    }
}
