import { HashBasedCache } from '../hash-based-cache';
export class MaskedCharacterPropertiesCache extends HashBasedCache {
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new MaskedCharacterPropertiesCache();
        result.copyFrom(this);
        return result;
    }
}
