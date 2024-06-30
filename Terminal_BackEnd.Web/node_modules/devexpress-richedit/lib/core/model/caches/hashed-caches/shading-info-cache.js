import { HashBasedCache } from '../hash-based-cache';
export class ShadingInfoCache extends HashBasedCache {
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new ShadingInfoCache();
        result.copyFrom(this);
        return result;
    }
}
