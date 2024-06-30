import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { UnicodeStringValueDestination } from '../base/unicode-string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class BookmarkDestinationBase extends UnicodeStringValueDestination {
    get destinationType() { return DestinationType.HexContentDestination; }
    afterPopRtfState() {
        const bookmarkName = StringUtils.trim(this.value);
        if (!StringUtils.isNullOrEmpty(bookmarkName))
            this.assignBookmarkPosition(this.importer.importers.bookmark.getBookmarkByName(bookmarkName));
    }
}
