import { HashBasedCache } from '../hash-based-cache';
export class TableCellPropertiesCache extends HashBasedCache {
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new TableCellPropertiesCache();
        result.copyFrom(this);
        return result;
    }
}
