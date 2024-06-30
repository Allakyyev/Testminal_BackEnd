import { Table } from '../../../../core/model/tables/main-structures/table';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ImportBookmarkInfoCore } from '../bookmark/import-bookmark-info-core';
export class ImportRangePermissionInfo extends ImportBookmarkInfoCore {
    constructor() {
        super();
        this.columnFirst = -1;
        this.columnLast = -1;
    }
    validate(subDocument) {
        if (StringUtils.isNullOrEmpty(this.userName) && StringUtils.isNullOrEmpty(this.group))
            return false;
        if (this.end - this.start < 0)
            return false;
        if (this.columnFirst >= 0 || this.columnLast >= 0)
            if (this.columnFirst < 0 || this.columnLast < 0 || Table == null)
                return false;
        return super.validate(subDocument);
    }
}
