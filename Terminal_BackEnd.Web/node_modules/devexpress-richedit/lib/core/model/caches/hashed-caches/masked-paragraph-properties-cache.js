import { HashBasedCache } from '../hash-based-cache';
export class MaskedParagraphPropertiesCache extends HashBasedCache {
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new MaskedParagraphPropertiesCache();
        result.copyFrom(this);
        return result;
    }
}
