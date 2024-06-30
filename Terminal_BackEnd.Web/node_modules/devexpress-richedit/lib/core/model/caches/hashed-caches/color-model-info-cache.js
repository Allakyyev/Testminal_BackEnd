import { ColorModelInfo } from '../../color/color-model-info';
import { HashBasedCache } from '../hash-based-cache';
export class ColorModelInfoCache extends HashBasedCache {
    constructor() {
        super();
        this.getItem(ColorModelInfo.empty);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new ColorModelInfoCache();
        result.copyFrom(this);
        return result;
    }
}
ColorModelInfoCache.defaultItem = ColorModelInfo.empty;
