import { ColorModelInfoCache } from '../../../core/model/caches/hashed-caches/color-model-info-cache';
export class RtfColorIndexCollection {
    constructor() {
        this.collection = [];
    }
    getRtfColorIndexById(id) {
        if (id < 0 || id >= this.collection.length)
            return ColorModelInfoCache.defaultItem;
        return this.collection[id];
    }
}
export class HsvInfo {
}
