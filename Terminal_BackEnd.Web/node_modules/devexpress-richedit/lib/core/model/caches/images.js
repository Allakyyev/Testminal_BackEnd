import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { isDefined } from '@devexpress/utils/lib/utils/common';
export class CacheImageInfo {
    constructor(base64, actualId, tmpId, imageUrl, file, referenceInfo, size, isLoaded) {
        this._base64 = base64 !== undefined ? Base64Utils.normalizeToDataUrl(base64, "image/png") : undefined;
        this.actualId = actualId;
        this.tmpId = tmpId;
        this._referenceInfo = referenceInfo;
        this._size = size ? size : CacheImageInfo.emptyPictureSize;
        this._isLoaded = isLoaded !== undefined ? isLoaded : false;
        this.imageUrl = imageUrl;
        this.file = file;
    }
    static get emptyPictureSize() { return new Size(CacheImageInfo.emptyPicDimension, CacheImageInfo.emptyPicDimension); }
    get isLoaded() { return this._referenceInfo ? this._referenceInfo._isLoaded : this._isLoaded; }
    set isLoaded(val) { this._isLoaded = val; }
    get size() { return this._referenceInfo ? this._referenceInfo._size : this._size; }
    set size(val) { this._size = val; }
    get currId() { return this.actualId !== undefined ? this.actualId : this.tmpId; }
    get base64() { return this._referenceInfo ? this._referenceInfo._base64 : this._base64; }
    set base64(val) { this._base64 = Base64Utils.normalizeToDataUrl(val, "image/png"); }
    get pdfCompatibleBase64() { var _a; return (_a = this._convertedBase64) !== null && _a !== void 0 ? _a : this.base64; }
    get referenceInfo() { return this._referenceInfo; }
    set referenceInfo(val) {
        this._referenceInfo = val;
        this._base64 = undefined;
        this._size = undefined;
        this._isLoaded = undefined;
        this.file = undefined;
    }
    equals(obj) {
        return (isDefined(this._referenceInfo) && this._referenceInfo === obj._referenceInfo) ||
            this.actualId == obj.actualId &&
                this.tmpId == obj.tmpId &&
                this.base64 === obj.base64 &&
                this.imageUrl === obj.imageUrl &&
                this.file === obj.file &&
                this.size.equals(obj.size);
    }
    clone() {
        return new CacheImageInfo(this._base64, this.actualId, this.tmpId, this.imageUrl, this.file, this._referenceInfo, this._size, this._isLoaded);
    }
    shouldMakeImagePdfCompatible() {
        if (isDefined(this._convertedBase64))
            return false;
        return !this.isPdfCompatible();
    }
    isPdfCompatible() {
        if (isDefined(this._convertedBase64))
            return true;
        if (isDefined(this.base64)) {
            const data = this.getImageHeader();
            if (data[0] === 0xff && data[1] === 0xd8)
                return true;
            else if (data[0] === 0x89 && data.toString('ascii', 1, 4) === 'PNG')
                return true;
        }
        return false;
    }
    setPdfCompatibleBase64(val) {
        this._convertedBase64 = Base64Utils.normalizeToDataUrl(val, "image/png");
    }
    getImageHeader() {
        const match = /^data:.+;base64,(.*)$/.exec(this.base64);
        const header = match[1].substring(0, 8);
        return Buffer.from(header, 'base64');
    }
}
CacheImageInfo.emptyPicDimension = UnitConverter.pixelsToTwips(32);
export class ImageCache {
    constructor() {
        this.emptyImageId = 0;
        this.lastTmpId = 0;
        this.lastActualId = 1;
        this.cache = {};
        const onePixelSize = UnitConverter.pixelsToTwips(1);
        const emptyImage = this.createUnloadedInfoByBase64(ImageCache.transparentWhiteImage1_1, new Size(onePixelSize, onePixelSize));
        emptyImage.isLoaded = false;
    }
    get emptyImage() { return this.cache[this.emptyImageId]; }
    getPictureData(id) {
        return this.cache[id];
    }
    createUnloadedInfoByUrl(imageUrl, size) {
        const info = this.findInfoByUrl(imageUrl);
        if (info)
            return info;
        return this.registerPictureData(new CacheImageInfo(this.cache[this.emptyImageId].base64, undefined, this.lastTmpId--, imageUrl, undefined, undefined, this.origSizeCorrect(size) ? size : undefined));
    }
    createUnloadedInfoByFile(file) {
        return this.registerPictureData(new CacheImageInfo(this.cache[this.emptyImageId].base64, undefined, this.lastTmpId--, undefined, file));
    }
    registerFromAnotherModel(imageInfo) {
        imageInfo.isLoaded = false;
        imageInfo.actualId = undefined;
        imageInfo.base64 = this.cache[this.emptyImageId].base64;
        imageInfo.tmpId = this.lastTmpId--;
    }
    createUnloadedInfoByBase64(base64, size) {
        const info = this.findInfoByBase64(base64);
        if (info)
            return info;
        const origSizeCorrect = this.origSizeCorrect(size);
        return this.registerPictureData(new CacheImageInfo(base64, undefined, this.lastTmpId--, undefined, undefined, undefined, origSizeCorrect ? size : undefined));
    }
    createLoadedInfo(base64, size, id) {
        const info = this.findInfoByBase64(base64);
        if (info) {
            return id === undefined || id === info.actualId ?
                info :
                this.registerPictureData(new CacheImageInfo(undefined, id, undefined, undefined, undefined, info, undefined));
        }
        if (id === undefined)
            id = this.getNextActualId();
        return this.registerPictureData(new CacheImageInfo(base64, id, undefined, undefined, undefined, undefined, size, !!size));
    }
    createUnloadedByBase64OrUrl(data, size) {
        return Base64Utils.checkPrependDataUrl(data) ?
            this.createUnloadedInfoByBase64(data, size) :
            this.createUnloadedInfoByUrl(data, size);
    }
    finalizeLoading(existingInfo, loadedInfo) {
        existingInfo.isLoaded = true;
        existingInfo.size = loadedInfo.size;
        existingInfo.actualId = loadedInfo.actualId;
        if (existingInfo.actualId === undefined)
            existingInfo.actualId = this.getNextActualId();
        this.registerPictureData(existingInfo);
        if (existingInfo.referenceInfo)
            return;
        const base64 = Base64Utils.normalizeToDataUrl(loadedInfo.base64, "image/png");
        if (!NumberMapUtils.containsBy(this.cache, cacheElem => {
            const isReference = cacheElem.base64 == base64 && cacheElem !== existingInfo && cacheElem.isLoaded;
            if (isReference)
                existingInfo.referenceInfo = cacheElem.referenceInfo ? cacheElem.referenceInfo : cacheElem;
            return isReference;
        }))
            existingInfo.base64 = base64;
    }
    getNextActualId() {
        return this.lastActualId++;
    }
    isDataRegistered(data) {
        return !!this.cache[data.actualId] || !!this.cache[data.tmpId];
    }
    registerPictureData(data) {
        let existingData = this.cache[data.actualId];
        if (!existingData)
            existingData = this.cache[data.tmpId];
        if (!existingData)
            existingData = data;
        if (data.actualId !== undefined)
            this.cache[data.actualId] = existingData;
        if (data.tmpId !== undefined)
            this.cache[data.tmpId] = existingData;
        return existingData;
    }
    loadAllPictures(picture) {
        NumberMapUtils.forEach(this.cache, cacheInfo => {
            if (this.emptyImageId != cacheInfo.actualId)
                picture.loader.load(cacheInfo);
        });
    }
    findInfoByBase64(base64) {
        base64 = Base64Utils.normalizeToDataUrl(base64, "image/png");
        return NumberMapUtils.elementBy(this.cache, info => info.base64 == base64);
    }
    findInfoByUrl(imageUrl) {
        return NumberMapUtils.elementBy(this.cache, info => info.imageUrl == imageUrl);
    }
    origSizeCorrect(size) {
        return size && !!size.width && !!size.height;
    }
    clone() {
        const result = new ImageCache();
        result.lastTmpId = this.lastTmpId;
        result.lastActualId = this.lastActualId;
        result.cache = NumberMapUtils.deepCopy(this.cache);
        NumberMapUtils.forEach(result.cache, el => {
            if (el.referenceInfo)
                el.referenceInfo = result.cache[el.currId];
        });
        return result;
    }
}
ImageCache.transparentWhiteImage1_1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAANSURBVBhXY/j///9/AAn7A/0FQ0XKAAAAAElFTkSuQmCC';
