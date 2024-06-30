import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { AnchorObjectTextWrapType } from '../../core/model/floating-objects/enums';
import { ChangeRectangularObjectScaleHistoryItem } from '../../core/model/history/items/change-rectangular-object-history-item';
import { RunType } from '../../core/model/runs/run-type';
import { SubDocumentInterval } from '../../core/model/sub-document';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { DxMimeType, MimeTypeUtils } from '@devexpress/utils/lib/utils/mime-type';
import { IntervalApi } from '../interval';
import { SizeApi } from '../size';
import { WrapTypeApi } from './image-enums';
import { getImageApiFromRun } from './images';
import { Size as SizeCore } from '@devexpress/utils/lib/geometry/size';
import { Constants } from '@devexpress/utils/lib/constants';
export class ImageApi {
    constructor(processor, subDocument, position, run) {
        this._processor = processor;
        this._subDocument = subDocument;
        this._position = position;
        this._run = run;
    }
    get base64() { return Base64Utils.deleteDataUrlPrefix(this._run.info.cacheInfo.base64); }
    get url() { return this._run.info.cacheInfo.imageUrl; }
    get interval() { return new IntervalApi(this._position, 1); }
    get isLoaded() { return this._run.info.cacheInfo.isLoaded; }
    get extension() {
        const mimeType = Base64Utils.getKnownMimeType(this._run.info.cacheInfo.base64);
        return mimeType === DxMimeType.Unknown ? '' : MimeTypeUtils.typeToExtension(mimeType);
    }
    get originalSize() {
        const size = this._run.info.size.originalSize;
        return new SizeApi(size.width, size.height);
    }
    get actualSize() {
        const size = this._run.info.size.actualSize;
        return new SizeApi(size.width, size.height);
    }
    set actualSize(value) {
        const size = ApiParametersChecker.check(value, 1, false, [
            ApiParametersChecker.objectDescriptor('size', 'SizeApi', (val) => val)
        ]);
        const oldSize = this._run.info.size;
        const newScale = Size.initByCommonAction((adp) => adp(size) / adp(oldSize.originalSize) * 100);
        if (this._run.getType() == RunType.InlinePictureRun) {
            this._processor.modelManager.history.addAndRedo(new ChangeRectangularObjectScaleHistoryItem(this._processor.modelManager.modelManipulator, new SubDocumentInterval(this._subDocument, new FixedInterval(this._position, 1)), newScale));
        }
        else {
            const newSize = oldSize.clone();
            newSize.scale = newScale;
            this._processor.modelManager.modelManipulator.picture.changePictureSize(this._subDocument, this._position, newSize);
        }
    }
    get description() { return this._run.info.containerProperties.description; }
    set description(value) {
        this._processor.modelManager.modelManipulator.picture.changeDescription(this._subDocument, this._position, value);
    }
    changeWrapType(wrapType) {
        if (wrapType == this.getWrapType())
            return this;
        this._processor.beginUpdate();
        const charPropsBundle = this._subDocument.getRunByPosition(this._position).getCharPropsBundle(this._processor.modelManager.model);
        if (wrapType == WrapTypeApi.Inline)
            this._processor.modelManager.modelManipulator.picture.setFloatingObjectInlineTextWrapType(this._subDocument, this._position, charPropsBundle);
        else
            this._processor.modelManager.modelManipulator.picture.setFloatingObjectTextWrapType(this._subDocument, this._position, charPropsBundle, wrapType == WrapTypeApi.BehindText, wrapType == WrapTypeApi.BehindText || wrapType == WrapTypeApi.InFrontOfText ?
                AnchorObjectTextWrapType.None : wrapType);
        this._processor.endUpdate();
        return getImageApiFromRun(this._processor, this._subDocument, this._subDocument.getRunAndIndexesByPosition(this._position));
    }
    delete() {
        this._processor.beginUpdate();
        this._processor.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this._subDocument, new FixedInterval(this._position, 1)), false, false);
        this._processor.endUpdate();
    }
    onLoaded(callback) {
        this._processor.modelManager.modelManipulator.picture.loader
            .addLoadListener(this._run.cacheInfo, () => callback(this));
    }
    reload(base64, size) {
        base64 = ApiParametersChecker.check(base64, 1, false, [
            ApiParametersChecker.stringDescriptor("base64", (s) => s, false)
        ]);
        size = ApiParametersChecker.check(size, 2, true, [
            ApiParametersChecker.objectDescriptor('size', 'Size', (val) => val)
        ]);
        if (size) {
            ApiParametersChecker.check(size.width, 2, false, [
                ApiParametersChecker.numberDescriptor('size.width', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
            ]);
            ApiParametersChecker.check(size.height, 2, false, [
                ApiParametersChecker.numberDescriptor('size.height', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
            ]);
        }
        this._processor.beginUpdate();
        try {
            this._processor.modelManager.modelManipulator.picture.reloadPicture(this._subDocument, this._position, base64, this.getSizeCore(size));
        }
        finally {
            this._processor.endUpdate();
        }
    }
    getSizeCore(size) {
        if (!size)
            return null;
        return new SizeCore(size.width, size.height);
    }
}
