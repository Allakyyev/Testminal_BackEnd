import { Constants } from '@devexpress/utils/lib/constants';
export class RtfFontInfo {
    constructor() {
        this.charset = -1;
        this.name = "";
        this._shouldLoad = false;
    }
    get shouldLoad() { return this._shouldLoad; }
    get cachedInfo() { return this._cachedInfo; }
    getCoreObjectByName(documentModel) {
        if (this._cachedInfo)
            return this._cachedInfo;
        this._cachedInfo = documentModel.cache.fontInfoCache.getItemByName(this.name);
        if (!this._cachedInfo) {
            this._shouldLoad = true;
            this._cachedInfo = documentModel.cache.fontInfoCache.addFont(this.name, this.name);
        }
        return this._cachedInfo;
    }
    static createDefaultRtfFontInfo() {
        const info = new RtfFontInfo();
        info.name = "Times New Roman";
        info.id = Constants.MAX_SAFE_INTEGER;
        return info;
    }
    static getFontInfo(fontInfoCache, name) {
        const fontInfo = fontInfoCache.getItemByName(name);
        return fontInfo ? fontInfo : fontInfoCache.addFont(name, name);
    }
}
