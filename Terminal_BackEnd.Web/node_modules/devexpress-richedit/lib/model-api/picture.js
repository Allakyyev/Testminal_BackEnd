import { ApiParametersChecker } from '../api-utils/api-utils/parameter-checker';
import { AnchorInfo } from '../core/model/floating-objects/anchor-info';
import { PictureSize } from '../core/model/floating-objects/sizes';
import { ChangeRectangularObjectLockAspectRatioHistoryItem, ChangeRectangularObjectScaleHistoryItem } from '../core/model/history/items/change-rectangular-object-history-item';
import { AnchorInfoPropertyHistoryItem } from '../core/model/history/items/floating-objects/anchor-info-property-history-item';
import { ChangeAnchoredPictureSizeHistoryItem } from '../core/model/history/items/floating-objects/change-anchored-picture-size-history-item';
import { AnchorPictureInfo } from '../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { RunType } from '../core/model/runs/run-type';
import { Shape } from '../core/model/shapes/shape';
import { SubDocumentInterval, SubDocumentPosition } from '../core/model/sub-document';
import { InputPositionBase } from '../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../core/selection/selection-intervals-info';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { AnchorInfoApi, AnchorObjectHorizontalPositionAlignmentApi, AnchorObjectHorizontalPositionTypeApi, AnchorObjectTextWrapSideApi, AnchorObjectTextWrapTypeApi, AnchorObjectVerticalPositionAlignmentApi, AnchorObjectVerticalPositionTypeApi } from './anchor-info';
import { ApiUtils } from './api-utils/api-utils';
import { SizeApi } from './size';
export class DrawingObjectBase {
    constructor(modelManager, subDocument, run, position) {
        this._native = modelManager;
        this._subDocument = subDocument;
        this._run = run;
        this._position = position;
    }
    delete() {
        this._native.modelManipulator.range.removeInterval(new SubDocumentInterval(this._subDocument, new FixedInterval(this._position, 1)), false, false);
    }
    get anhorInfo() {
        return this._getAnchorInfo();
    }
    set anchorInfo(info) {
        this._setAnchorInfo(info);
    }
    _getAnchorInfo() {
        const anchorInfo = this._run.anchorInfo;
        const result = new AnchorInfoApi();
        result.leftDistance = anchorInfo.leftDistance;
        result.rightDistance = anchorInfo.rightDistance;
        result.topDistance = anchorInfo.topDistance;
        result.bottomDistance = anchorInfo.bottomDistance;
        result.wrapType = anchorInfo.wrapType;
        result.wrapSide = anchorInfo.wrapSide;
        result.horizontalPositionType = anchorInfo.horizontalPositionType;
        result.horizontalPositionAlignment = anchorInfo.horizontalPositionAlignment;
        result.verticalPositionType = anchorInfo.verticalPositionType;
        result.verticalPositionAlignment = anchorInfo.verticalPositionAlignment;
        result.offset = anchorInfo.offset;
        result.percentOffset = anchorInfo.percentOffset;
        return result;
    }
    _setAnchorInfo(info) {
        const coreInfo = this._checkParameters(info);
        const currentInfo = this._run.anchorInfo;
        const interval = new FixedInterval(this._position, 1);
        const history = this._native.history;
        const modelManipulator = this._native.modelManipulator;
        const anchorInfoManipulator = this._native.modelManipulator.floatingObject.anchorInfo;
        history.beginTransaction();
        if (coreInfo.horizontalPositionAlignment !== undefined && coreInfo.horizontalPositionAlignment != currentInfo.horizontalPositionAlignment)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.horizontalPositionAlignment, anchorInfoManipulator.horizontalPositionAlignment));
        if (coreInfo.horizontalPositionType !== undefined && coreInfo.horizontalPositionType != currentInfo.horizontalPositionType)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.horizontalPositionType, anchorInfoManipulator.horizontalPositionType));
        if (coreInfo.offset.x !== undefined && coreInfo.offset.x != currentInfo.offset.x)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.offset.x, anchorInfoManipulator.offsetX));
        if (coreInfo.percentOffset.x !== undefined && coreInfo.percentOffset.x != currentInfo.percentOffset.x)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.percentOffset.x, anchorInfoManipulator.percentOffsetX));
        if (coreInfo.verticalPositionAlignment !== undefined && coreInfo.verticalPositionAlignment != currentInfo.verticalPositionAlignment)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.verticalPositionAlignment, anchorInfoManipulator.verticalPositionAlignment));
        if (coreInfo.verticalPositionType !== undefined && coreInfo.verticalPositionType != currentInfo.verticalPositionType)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.verticalPositionType, anchorInfoManipulator.verticalPositionType));
        if (coreInfo.offset.y !== undefined && coreInfo.offset.y != currentInfo.offset.y)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.offset.y, anchorInfoManipulator.offsetY));
        if (coreInfo.percentOffset.y !== undefined && coreInfo.percentOffset.y != currentInfo.percentOffset.y)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.percentOffset.y, anchorInfoManipulator.percentOffsetY));
        if (coreInfo.wrapType !== undefined && coreInfo.wrapType !== null && coreInfo.wrapType != currentInfo.wrapType)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.wrapType, anchorInfoManipulator.wrapType));
        if (coreInfo.wrapSide !== undefined && coreInfo.wrapSide != currentInfo.wrapSide)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.wrapSide, anchorInfoManipulator.wrapSide));
        if (coreInfo.topDistance !== undefined && coreInfo.topDistance != currentInfo.topDistance)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.topDistance, anchorInfoManipulator.topDistance));
        if (coreInfo.bottomDistance !== undefined && coreInfo.bottomDistance != currentInfo.bottomDistance)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.bottomDistance, anchorInfoManipulator.bottomDistance));
        if (coreInfo.leftDistance !== undefined && coreInfo.leftDistance != currentInfo.leftDistance)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.leftDistance, anchorInfoManipulator.leftDistance));
        if (coreInfo.rightDistance !== undefined && coreInfo.rightDistance != currentInfo.rightDistance)
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(this._subDocument, interval), coreInfo.rightDistance, anchorInfoManipulator.rightDistance));
        history.endTransaction();
    }
    _checkParameters(info) {
        ApiUtils.assertObject(info, 'info');
        const result = this._run.anchorInfo;
        result.leftDistance = ApiParametersChecker.check(info.leftDistance, 1, true, [
            ApiParametersChecker.numberDescriptor('info.leftDistance', (val) => val)
        ]);
        result.rightDistance = ApiParametersChecker.check(info.rightDistance, 1, true, [
            ApiParametersChecker.numberDescriptor('info.rightDistance', (val) => val)
        ]);
        result.topDistance = ApiParametersChecker.check(info.topDistance, 1, true, [
            ApiParametersChecker.numberDescriptor('info.topDistance', (val) => val)
        ]);
        result.bottomDistance = ApiParametersChecker.check(info.bottomDistance, 1, true, [
            ApiParametersChecker.numberDescriptor('info.bottomDistance', (val) => val)
        ]);
        result.wrapType = ApiParametersChecker.check(info.wrapType, 1, true, [
            ApiParametersChecker.enumDescriptor('info.wrapType', (val) => val, AnchorObjectTextWrapTypeApi, 'AnchorObjectTextWrapType')
        ]);
        result.wrapSide = ApiParametersChecker.check(info.wrapType, 1, true, [
            ApiParametersChecker.enumDescriptor('info.wrapSide', (val) => val, AnchorObjectTextWrapSideApi, 'AnchorObjectTextWrapSide')
        ]);
        result.horizontalPositionAlignment = ApiParametersChecker.check(info.horizontalPositionAlignment, 1, true, [
            ApiParametersChecker.enumDescriptor('info.horizontalPositionAlignment', (val) => val, AnchorObjectHorizontalPositionAlignmentApi, 'AnchorObjectHorizontalPositionAlignment')
        ]);
        result.horizontalPositionType = ApiParametersChecker.check(info.horizontalPositionType, 1, true, [
            ApiParametersChecker.enumDescriptor('info.horizontalPositionType', (val) => val, AnchorObjectHorizontalPositionTypeApi, 'AnchorObjectHorizontalPositionType')
        ]);
        result.verticalPositionType = ApiParametersChecker.check(info.verticalPositionType, 1, true, [
            ApiParametersChecker.enumDescriptor('info.verticalPositionType', (val) => val, AnchorObjectVerticalPositionTypeApi, 'AnchorObjectVerticalPositionType')
        ]);
        result.verticalPositionAlignment = ApiParametersChecker.check(info.verticalPositionAlignment, 1, true, [
            ApiParametersChecker.enumDescriptor('info.verticalPositionAlignment', (val) => val, AnchorObjectVerticalPositionAlignmentApi, 'AnchorObjectVerticalPositionAlignment')
        ]);
        result.offset = ApiParametersChecker.check(info.offset, 1, true, [
            ApiParametersChecker.objectDescriptor('info.offset', 'Offset', (val) => val)
        ]);
        result.percentOffset = ApiParametersChecker.check(info.percentOffset, 1, true, [
            ApiParametersChecker.objectDescriptor('info.percentOffset', 'Offset', (val) => val)
        ]);
        return result;
    }
}
export class PictureApi extends DrawingObjectBase {
    get size() {
        const size = this._run.size;
        const actualSize = new SizeApi((size.originalSize.width * size.scale.width) / 100, (size.originalSize.height * size.scale.height) / 100);
        const originalSize = new SizeApi(size.originalSize.width, size.originalSize.height);
        const result = new PictureSizeApi(originalSize, actualSize, size.lockAspectRatio);
        return result;
    }
    set size(size) {
        size = ApiParametersChecker.check(size, 1, false, [
            ApiParametersChecker.objectDescriptor('size', 'PictureSizeApi', (v) => v)
        ]);
        const history = this._native.history;
        const interval = new FixedInterval(this._position, 1);
        this._native.history.beginTransaction();
        if (this._run.getType() === RunType.InlinePictureRun) {
            history.addAndRedo(new ChangeRectangularObjectScaleHistoryItem(this._native.modelManipulator, new SubDocumentInterval(this._subDocument, interval), this._getScale(size)));
            history.addAndRedo(new ChangeRectangularObjectLockAspectRatioHistoryItem(this._native.modelManipulator, new SubDocumentInterval(this._subDocument, interval), size.lockAspectRatio));
        }
        else
            history.addAndRedo(new ChangeAnchoredPictureSizeHistoryItem(this._native.modelManipulator, new SubDocumentInterval(this._subDocument, interval), new PictureSize(size.lockAspectRatio, this._run.size.rotation, this._run.cacheInfo, this._getScale(size))));
        this._native.history.endTransaction();
    }
    _getAnchorInfo() {
        if (this._run.getType() === RunType.InlinePictureRun)
            return null;
        return super._getAnchorInfo();
    }
    setAnchorInfo(info) {
        this._native.history.beginTransaction();
        if (this._run.getType() === RunType.InlinePictureRun) {
            const inputPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(this._subDocument, this._position));
            this._native.modelManipulator.range.removeInterval(new SubDocumentInterval(this._subDocument, new FixedInterval(this._position, 1)), true, false);
            const anchorInfo = new AnchorInfo();
            anchorInfo.zOrder = this._native.modelManipulator.floatingObject.zOrder.getNewZOrder(this._subDocument);
            this._native.modelManipulator.picture.insertAnchoredPictureViaHistory(new SubDocumentPosition(this._subDocument, this._position), inputPos.charPropsBundle, new AnchorPictureInfo(this._run.size, new Shape(), new AnchorInfo(), this._run.info.containerProperties.clone(), this._run.info.nonVisualDrawingProperties.clone()), new ImageLoadingOptions(false));
            this._run = this._subDocument.getRunByPosition(this._position);
        }
        super._setAnchorInfo(info);
        this._native.history.endTransaction();
    }
    _getScale(size) {
        const scaleX = (size.actualSize.width / size.originalSize.width) * 100;
        const scaleY = (size.actualSize.height / size.originalSize.height) * 100;
        const scale = new Size(scaleX, scaleY);
        return scale;
    }
}
export class PictureSizeApi {
    constructor(originalSize, actualSize, lockAspectRatio) {
        this.originalSize = originalSize;
        this.actualSize = actualSize;
        this.lockAspectRatio = lockAspectRatio;
    }
}
