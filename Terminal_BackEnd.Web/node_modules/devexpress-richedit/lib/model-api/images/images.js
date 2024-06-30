import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { AnchorInfo } from '../../core/model/floating-objects/anchor-info';
import { AnchorObjectTextWrapType } from '../../core/model/floating-objects/enums';
import { PictureSize } from '../../core/model/floating-objects/sizes';
import { AnchorPictureInfo, InlinePictureInfo } from '../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { ModelIterator } from '../../core/model/model-iterator';
import { RunType } from '../../core/model/runs/run-type';
import { Shape } from '../../core/model/shapes/shape';
import { SubDocumentPosition } from '../../core/model/sub-document';
import { InputPositionBase } from '../../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../../core/selection/selection-intervals-info';
import { Constants } from '@devexpress/utils/lib/constants';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { NonVisualDrawingObjectInfo } from '../../core/model/manipulators/picture-manipulator/non-visual-drawing-object-info';
import { getRestrictedInterval } from '../api-utils/api-utils';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { applyHorizontalPosition, applyVerticalPosition, FloatingImageApi } from './floating-image';
import { WrapTypeApi } from './image-enums';
import { ImageIteratorApi } from './image-iterator';
import { InlineImageApi } from './inline-image';
export function getInlineImageApiFromRun(processor, subDocument, runInfo) {
    return new InlineImageApi(processor, subDocument, runInfo.getAbsoluteRunPosition(), runInfo.run);
}
export function getFloatingImageApiFromRun(processor, subDocument, runInfo) {
    return new FloatingImageApi(processor, subDocument, runInfo.getAbsoluteRunPosition(), runInfo.run);
}
export function getImageApiFromRun(processor, subDocument, runInfo) {
    if (runInfo.run.getType() == RunType.AnchoredPictureRun)
        return getFloatingImageApiFromRun(processor, subDocument, runInfo);
    if (runInfo.run.getType() == RunType.InlinePictureRun)
        return getInlineImageApiFromRun(processor, subDocument, runInfo);
    return null;
}
function getImagesByInterval(processor, subDocument, interval) {
    const result = [];
    const it = new ModelIterator(subDocument, false);
    it.setPosition(interval.start);
    const checkRun = () => {
        const img = getImageApiFromRun(processor, subDocument, it);
        if (img)
            result.push(img);
    };
    if (interval.length == 0) {
        checkRun();
    }
    else {
        const end = interval.end;
        do {
            checkRun();
        } while (it.moveToNextRun() && it.getAbsoluteRunPosition() < end);
    }
    return result;
}
export class ImagesApi {
    constructor(processor, subDocument) {
        this._processor = processor;
        this._subDocument = subDocument;
    }
    createInline(position, options) {
        position = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor('position', (val) => val)
        ]);
        position = MathUtils.restrictValue(position, 0, this._subDocument.getDocumentEndPosition() - 1);
        ApiParametersChecker.check(options, 2, false, [
            ApiParametersChecker.objectDescriptor('options', 'IInsertInlineImageOptionsApi', (val) => val)
        ]);
        let source;
        if (options.base64) {
            source = ApiParametersChecker.check(options.base64, 2, false, [
                ApiParametersChecker.stringDescriptor("options.base64", (s) => s, false)
            ]);
        }
        else if (options.url) {
            source = ApiParametersChecker.check(options.url, 2, false, [
                ApiParametersChecker.stringDescriptor("options.url", (s) => s, false)
            ]);
        }
        else {
            throw new Error('options.base64 or options.url must be defined');
        }
        const size = ApiParametersChecker.check(options.actualSize, 2, true, [
            ApiParametersChecker.objectDescriptor('options.size', 'Size', (val) => val)
        ]);
        if (size) {
            ApiParametersChecker.check(size.width, 2, false, [
                ApiParametersChecker.numberDescriptor('options.size.width', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
            ]);
            ApiParametersChecker.check(size.height, 2, false, [
                ApiParametersChecker.numberDescriptor('options.size.height', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
            ]);
        }
        let callback = ApiParametersChecker.check(options.callback, 4, true, [
            ApiParametersChecker.functionDescriptor('options.callback', (val) => val)
        ]);
        if (!callback)
            callback = () => { };
        const imageCache = this._processor.modelManager.model.cache.imageCache;
        const cacheInfo = imageCache.createUnloadedByBase64OrUrl(source);
        const inputPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(this._subDocument, position));
        this._processor.beginUpdate();
        const info = InlinePictureInfo.defaultInfo(cacheInfo);
        info.containerProperties.description = options.description;
        this._processor.modelManager.modelManipulator.picture.insertInlinePictureViaHistory(new SubDocumentPosition(this._subDocument, position), inputPos.charPropsBundle, info, ImageLoadingOptions.initByActualSize(size ? new Size(size.width, size.height) : undefined, (_picInterval, _cacheInfo) => setTimeout(() => {
            callback(getInlineImageApiFromRun(this._processor, this._subDocument, this._subDocument.getRunAndIndexesByPosition(position)));
        }, 0)));
        this._processor.endUpdate();
        return getInlineImageApiFromRun(this._processor, this._subDocument, this._subDocument.getRunAndIndexesByPosition(position));
    }
    createFloating(position, options) {
        position = ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor('position', (val) => val)
        ]);
        position = MathUtils.restrictValue(position, 0, this._subDocument.getDocumentEndPosition() - 1);
        ApiParametersChecker.check(options, 2, false, [
            ApiParametersChecker.objectDescriptor('options', 'IInsertFloatingImageOptionsApi', (val) => val)
        ]);
        const imageCache = this._processor.modelManager.model.cache.imageCache;
        let cacheInfo;
        if (options.base64) {
            const source = ApiParametersChecker.check(options.base64, 2, false, [
                ApiParametersChecker.stringDescriptor("options.base64", (s) => s, false)
            ]);
            cacheInfo = imageCache.createUnloadedInfoByBase64(source);
        }
        else if (options.url) {
            const source = ApiParametersChecker.check(options.url, 2, false, [
                ApiParametersChecker.stringDescriptor("options.url", (s) => s, false)
            ]);
            cacheInfo = imageCache.createUnloadedInfoByUrl(source);
        }
        else {
            throw new Error('options.base64 or options.url must be defined');
        }
        const size = ApiParametersChecker.check(options.actualSize, 2, true, [
            ApiParametersChecker.objectDescriptor('options.size', 'Size', (val) => val)
        ]);
        if (size) {
            ApiParametersChecker.check(size.width, 2, false, [
                ApiParametersChecker.numberDescriptor('options.size.width', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
            ]);
            ApiParametersChecker.check(size.height, 2, false, [
                ApiParametersChecker.numberDescriptor('options.size.height', (val) => val, 1, Constants.MAX_SAFE_INTEGER)
            ]);
        }
        let callback = ApiParametersChecker.check(options.callback, 4, true, [
            ApiParametersChecker.functionDescriptor('options.callback', (val) => val)
        ]);
        if (!callback)
            callback = () => { };
        const inputPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(this._subDocument, position));
        this._processor.beginUpdate();
        const shape = new Shape();
        if (isDefined(options.outlineWidth))
            shape.outlineWidth = options.outlineWidth;
        if (isDefined(options.outlineColor))
            shape.outlineColor = ApiParametersChecker.check(options.outlineColor, 2, false, ModelParametersChecker.colorDescriptors('options.outlineColor'));
        const anchorInfo = new AnchorInfo();
        if (isDefined(options.wrapSide))
            anchorInfo.wrapSide = options.wrapSide;
        const wrapType = isDefined(options.wrapType) ? options.wrapType : WrapTypeApi.Square;
        switch (wrapType) {
            case WrapTypeApi.BehindText: {
                anchorInfo.wrapType = AnchorObjectTextWrapType.None;
                anchorInfo.isBehindDoc = true;
                break;
            }
            case WrapTypeApi.InFrontOfText: {
                anchorInfo.wrapType = AnchorObjectTextWrapType.None;
                anchorInfo.isBehindDoc = false;
                break;
            }
            default: {
                anchorInfo.wrapType = wrapType;
                anchorInfo.isBehindDoc = false;
            }
        }
        if (isDefined(options.distance)) {
            if (isDefined(options.distance.left))
                anchorInfo.leftDistance = options.distance.left;
            if (isDefined(options.distance.right))
                anchorInfo.rightDistance = options.distance.right;
            if (isDefined(options.distance.top))
                anchorInfo.topDistance = options.distance.top;
            if (isDefined(options.distance.bottom))
                anchorInfo.bottomDistance = options.distance.bottom;
        }
        const horizontalPosition = options.horizontalPosition;
        if (horizontalPosition)
            applyHorizontalPosition(horizontalPosition, anchorInfo);
        const verticalPosition = options.verticalPosition;
        if (verticalPosition)
            applyVerticalPosition(verticalPosition, anchorInfo);
        const anchorPictureInfo = new AnchorPictureInfo(new PictureSize(true, 0, cacheInfo, new Size(100, 100)), shape, anchorInfo, new NonVisualDrawingObjectInfo(), new NonVisualDrawingObjectInfo());
        anchorPictureInfo.containerProperties.description = options.description;
        this._processor.modelManager.modelManipulator.picture.insertAnchoredPictureViaHistory(new SubDocumentPosition(this._subDocument, position), inputPos.charPropsBundle, anchorPictureInfo, new ImageLoadingOptions(false, size ? new Size(size.width, size.height) : undefined, (_picInterval, _cacheInfo) => setTimeout(() => {
            callback(getFloatingImageApiFromRun(this._processor, this._subDocument, this._subDocument.getRunAndIndexesByPosition(position)));
        }, 0)));
        this._processor.endUpdate();
        return getFloatingImageApiFromRun(this._processor, this._subDocument, this._subDocument.getRunAndIndexesByPosition(position));
    }
    getIterator(startPosition = 0) {
        const pos = MathUtils.restrictValue(startPosition, 0, this._subDocument.getDocumentEndPosition() - 1);
        return new ImageIteratorApi(this._processor, this._subDocument, pos);
    }
    getAllImages() {
        return getImagesByInterval(this._processor, this._subDocument, this._subDocument.interval);
    }
    find(position) {
        const coreIntervals = ListUtils.map(ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.numberDescriptor("position", pos => [new FixedInterval(pos, 0)], 0, Constants.MAX_SAFE_INTEGER),
            ModelParametersChecker.intervalDescriptor("interval", interval => [new FixedInterval(interval.start, interval.length)]),
            ModelParametersChecker.intervalsDescriptor("intervals", (apiIntervals) => ListUtils.map(apiIntervals, interval => new FixedInterval(interval.start, interval.length)))
        ]), interval => getRestrictedInterval(interval, 0, this._subDocument.getDocumentEndPosition()));
        return ListUtils.accumulate(coreIntervals, [], (acc, interval) => ListUtils.addListOnTail(acc, getImagesByInterval(this._processor, this._subDocument, interval)));
    }
}
