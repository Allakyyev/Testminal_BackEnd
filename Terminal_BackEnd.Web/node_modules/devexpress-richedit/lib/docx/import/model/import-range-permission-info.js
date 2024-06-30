import { ImportBookmarkInfoCore } from '../../../core/formats/utils/import-bookmark-info-core';
export class ImportRangePermissionInfo extends ImportBookmarkInfoCore {
    constructor() {
        super(...arguments);
        this.columnFirst = -1;
        this.columnLast = -1;
        this.userName = '';
        this.group = '';
    }
}
