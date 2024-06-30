import { ImportBookmarkInfoCore } from '../../../core/formats/utils/import-bookmark-info-core';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class ImportBookmarkInfo extends ImportBookmarkInfoCore {
    constructor() {
        super(...arguments);
        this.skipNameValidation = false;
    }
    validate(subDocument) {
        return (this.skipNameValidation || this.validateBookmarkName(subDocument)) && super.validate(subDocument);
    }
    validateBookmarkName(subDocument) {
        return !StringUtils.isNullOrEmpty(this.name) && ListUtils.allOf(subDocument.bookmarks, (bkm) => bkm.name != this.name);
    }
}
