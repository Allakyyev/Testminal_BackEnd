import { HashBasedCache } from '../hash-based-cache';
export class ListLevelPropertiesCache extends HashBasedCache {
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new ListLevelPropertiesCache();
        result.copyFrom(this);
        return result;
    }
}
