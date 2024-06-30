import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { ColumnCalculator } from '../../../../layout-formatter/formatter/utils/columns-calculator';
import { InlinePicturesUpdatedSubDocumentChange } from '../../../changes/sub-document/picture/inline-pictures-updated';
import { UpdatedImageInfo } from './updated-image-info';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { ExtensionHelper } from '../../../../formats/utils/extension-helper';
import { AnchoredTextBoxRun } from '../../../runs/anchored-text-box-run';
import { BoundsCalculator } from '../../../../layout-formatter/formatter/utils/bounds-calculator';
export class PicSizeUpdaterData {
    constructor(subDocument, runPosition, run, options, histItemSize) {
        this.subDocument = subDocument;
        this.runPosition = runPosition;
        this.run = run;
        this.options = options;
        this.histItemSize = histItemSize;
    }
}
class PicSizeUpdater {
    constructor(modelManipulator, pictureLoadedListener) {
        this.loadingData = {};
        this.modelManipulator = modelManipulator;
        this.pictureLoadedListener = pictureLoadedListener;
    }
    getImageLoadingOptions(run) {
        const existingData = this.loadingData[run.cacheInfo.tmpId];
        if (existingData) {
            const data = existingData.find(val => (val instanceof PicSizeUpdaterData) && val.run === run);
            if (data)
                return data.options;
        }
        return null;
    }
    addLoadListener(cacheInfo, callback) {
        const existingData = this.loadingData[cacheInfo.tmpId];
        if (!existingData)
            return;
        existingData.push(callback);
    }
    allPicturesLoaded() {
        return NumberMapUtils.isEmpty(this.loadingData);
    }
    addSizes(subDocPos, options, run, histItemSize) {
        const cacheInfo = run.info.cacheInfo;
        let existingData = this.loadingData[cacheInfo.tmpId];
        if (!existingData)
            existingData = this.loadingData[cacheInfo.tmpId] = [];
        const pos = subDocPos.subDocument.positionManager.registerNotLoadedPicturePosition(subDocPos.position);
        existingData.push(new PicSizeUpdaterData(subDocPos.subDocument, pos, run, options, histItemSize));
    }
    update(cacheInfo, notify) {
        const existingData = this.loadingData[cacheInfo.tmpId];
        if (existingData) {
            delete this.loadingData[cacheInfo.tmpId];
            this.modelManipulator.batchUpdatableObject.beginUpdate();
            for (let extData of existingData) {
                if (extData instanceof PicSizeUpdaterData)
                    this.updateInner(extData, notify);
                else
                    extData();
            }
            this.modelManipulator.batchUpdatableObject.endUpdate();
            this.pictureLoadedListener.notifyPictureLoaded();
        }
    }
    updateInner(data, notify) {
        const options = data.options;
        const originalSize = data.run.info.cacheInfo.size;
        let scaleSize = null;
        if (options.actualSize) {
            scaleSize = Size.initByCommonAction(adp => 100 * adp(options.actualSize) / adp(originalSize));
        }
        else if (options.calculateActualSize) {
            const section = this.modelManipulator.model.getSectionByPosition(data.runPosition.value);
            let maxPictureSize;
            if (data.subDocument.isTextBox()) {
                const anchoredRun = this.getAnchoredTextBoxRun(data.subDocument.info);
                const size = anchoredRun.size;
                const boundsCalculator = new BoundsCalculator();
                boundsCalculator.init(section);
                const margins = anchoredRun.textBoxProperties.getContentMargins();
                let width = (size.useAbsoluteWidth() ? size.absoluteSize.width : UnitConverter.pixelsToTwipsF(size.getActualRelativeWidth(boundsCalculator))) - margins.horizontal;
                let height;
                if (anchoredRun.textBoxProperties.resizeShapeToFitText)
                    height = originalSize.height;
                else
                    height = size.useAbsoluteHeight() ? size.absoluteSize.height : UnitConverter.pixelsToTwipsF(size.getActualRelativeHeight(boundsCalculator)) - margins.vertical;
                maxPictureSize = new Size(width, height);
            }
            else
                maxPictureSize = ColumnCalculator.findMinimalColumnSize(section.sectionProperties)
                    .applyConverter(UnitConverter.pixelsToTwips);
            const scale = 100 * Math.min(maxPictureSize.width / Math.max(1, originalSize.width), maxPictureSize.height / Math.max(1, originalSize.height));
            const resultScale = Math.max(1, Math.min(scale, 100));
            scaleSize = new Size(resultScale, resultScale);
        }
        if (scaleSize) {
            if (data.histItemSize)
                data.histItemSize.scale = scaleSize.clone();
            data.run.size.scale = scaleSize.clone();
            if (notify && data.subDocument.getRunByPosition(data.runPosition.value) === data.run)
                this.modelManipulator.notifyModelChanged(new InlinePicturesUpdatedSubDocumentChange(data.subDocument.id, new UpdatedImageInfo(data.runPosition.value, data.run.info.cacheInfo, data.run.size)));
        }
        data.subDocument.positionManager.unregisterNotLoadedPicturePosition(data.runPosition);
        data.options.imageLoadedEvent.forEach(cb => cb(new FixedInterval(data.runPosition.value, 1), data.run.info.cacheInfo));
    }
    getAnchoredTextBoxRun(info) {
        const parentSubDocument = this.modelManipulator.model.subDocuments[info.parentSubDocumentId];
        const iterator = parentSubDocument.getRunIterator(parentSubDocument.interval);
        while (iterator.moveNext()) {
            const run = iterator.currentRun;
            if (run instanceof AnchoredTextBoxRun) {
                const anchoredRun = run;
                if (anchoredRun.subDocId === info.subDocumentId)
                    return anchoredRun;
            }
        }
        return null;
    }
}
class CallbacksInfo {
    constructor(callback, timeoutId) {
        this.callback = callback;
        this.timeoutId = timeoutId;
    }
}
export class PictureLoader {
    constructor(modelManipulator) {
        this.callbacksInfo = [];
        this.modelManipulator = modelManipulator;
        this.sizeUpdater = new PicSizeUpdater(modelManipulator, this);
    }
    get imageCache() { return this.modelManipulator.model.cache.imageCache; }
    notifyPictureLoaded() {
        if (this.sizeUpdater.allPicturesLoaded()) {
            const clbs = this.callbacksInfo;
            this.callbacksInfo = [];
            clbs.forEach(info => {
                clearTimeout(info.timeoutId);
                info.callback(true);
            });
        }
    }
    ensureAllPicturesLoaded(timeout, callback) {
        if (this.sizeUpdater.allPicturesLoaded()) {
            callback(true);
            return;
        }
        const info = new CallbacksInfo(callback, setTimeout(() => {
            const index = this.callbacksInfo.indexOf(info);
            if (index >= 0) {
                this.callbacksInfo.splice(index, 1);
                info.callback(false);
            }
        }, timeout));
        this.callbacksInfo.push(info);
    }
    ensureAllPicturesPdfCompatible(timeout, convertImageToCompatibleFormat, callback) {
        this.ensureAllPicturesLoaded(timeout, (_isLoaded) => {
            if (isDefined(convertImageToCompatibleFormat)) {
                const infos = this.modelManipulator.model.getAllImages();
                const promises = [];
                NumberMapUtils.forEach(infos, (info) => {
                    if (info.shouldMakeImagePdfCompatible()) {
                        const promise = convertImageToCompatibleFormat(info.base64);
                        if (promise instanceof Promise) {
                            promises.push(promise.
                                then(converted => {
                                info.setPdfCompatibleBase64(converted);
                            }).catch((reason) => console.log(reason)));
                        }
                    }
                });
                Promise.all(promises).then(() => callback());
            }
            else
                callback();
        });
    }
    load(data) {
        if (data.isLoaded)
            return;
        this.loadInner(data);
    }
    finalizeLoading(loadedData, existingInfo) {
        if (!existingInfo)
            existingInfo = this.imageCache.getPictureData(loadedData.tmpId !== undefined ? loadedData.tmpId : loadedData.actualId);
        if (!existingInfo.isLoaded)
            this.imageCache.finalizeLoading(existingInfo, loadedData);
        this.sizeUpdater.update(existingInfo, true);
    }
    loadPictureByBase64(data, imageLoaded) {
        const img = new Image();
        img.onload = () => {
            data.size = new Size(img.width, img.height).applyConverter(UnitConverter.pixelsToTwips);
            const contentType = ExtensionHelper.getMimeTypeFromBase64Uri(data.base64);
            if (contentType == 'image/bmp')
                this.convertBmpToPng(data, img);
            imageLoaded(data);
        };
        img.src = data.base64;
    }
    convertBmpToPng(data, img) {
        const canvas = document.createElement('canvas');
        if (!canvas)
            return;
        const originalSize = data.size.clone().applyConverter(UnitConverter.twipsToPixelsF);
        const context2d = canvas.getContext('2d');
        if (!context2d)
            return;
        canvas.width = originalSize.width;
        canvas.height = originalSize.height;
        context2d.drawImage(img, 0, 0);
        data.base64 = canvas.toDataURL();
    }
    loadPictureByUrl(data, imageLoaded) {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            Base64Utils.fromBlobAsDataUrl(xhr.response, base64 => {
                data.base64 = base64;
                this.loadPictureByBase64(data, (data) => imageLoaded(data));
            });
        };
        xhr.onerror = () => imageLoaded(this.imageCache.emptyImage);
        try {
            xhr.open('GET', data.imageUrl, true);
            xhr.responseType = 'blob';
            xhr.send();
        }
        catch (_a) {
            imageLoaded(this.imageCache.emptyImage);
        }
    }
    loadPictureByFile(data, imageLoaded) {
        Base64Utils.fromBlobAsDataUrl(data.file, base64 => {
            data.base64 = base64;
            data.file = undefined;
            this.loadPictureByBase64(data, data => imageLoaded(data));
        });
    }
}
