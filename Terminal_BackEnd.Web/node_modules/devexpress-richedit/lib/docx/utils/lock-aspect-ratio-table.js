import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class LockAspectRatioTable {
    constructor() {
        this.table = {};
    }
    addValue(key, value) {
        if (!StringUtils.isNullOrEmpty(key) && (value == 't' || value == 'f'))
            this.table['#' + key] = value;
    }
    getValue(key, readerHelper) {
        const lockAspectRatioStr = this.table[key];
        return lockAspectRatioStr == undefined ?
            { useLockAspectRatio: false, lockAspectRatio: false } :
            { useLockAspectRatio: true, lockAspectRatio: readerHelper.isBool(lockAspectRatioStr) };
    }
}
