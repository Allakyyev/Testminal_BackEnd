import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ImportBookmarkInfoCore } from './import-bookmark-info-core';
export class ImportBookmarkInfo extends ImportBookmarkInfoCore {
    validate(subDocument) {
        if (!this.skipNameValidation && !this.validateBookmarkName(subDocument))
            return false;
        return super.validate(subDocument);
    }
    validateBookmarkName(subDocument) {
        return StringUtils.isNullOrEmpty(this.name) ?
            false :
            !ListUtils.elementBy(subDocument.bookmarks, (bm) => bm.name == this.name);
    }
}
