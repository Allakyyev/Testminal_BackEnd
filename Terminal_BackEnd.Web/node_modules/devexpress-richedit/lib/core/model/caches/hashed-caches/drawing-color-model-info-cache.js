import { DrawingColorModelInfo } from '../../drawing/drawing-color-model-info';
import { HashBasedCache } from '../hash-based-cache';
export class DrawingColorModelInfoCache extends HashBasedCache {
    constructor() {
        super();
        this.getItem(DrawingColorModelInfo.empty);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
    }
    clone() {
        const result = new DrawingColorModelInfoCache();
        result.copyFrom(this);
        return result;
    }
}
DrawingColorModelInfoCache.defaultItem = new DrawingColorModelInfo();
