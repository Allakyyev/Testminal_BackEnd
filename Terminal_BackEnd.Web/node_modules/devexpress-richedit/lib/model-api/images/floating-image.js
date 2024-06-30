import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment } from '../../core/model/floating-objects/enums';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { ApiUtils } from '../api-utils/api-utils';
import { ModelParametersChecker } from '../api-utils/model-parameter-checker';
import { ImageApi } from './image';
import { WrapTypeApi } from './image-enums';
import { HorizontalAbsolutePositionApi, HorizontalAlignedPositionApi, HorizontalRelativePositionApi, VerticalAbsolutePositionApi, VerticalAlignedPositionApi, VerticalRelativePositionApi } from './image-interfaces';
export function applyHorizontalPosition(position, anchorInfo) {
    if (isDefined(position.alignment)) {
        const alignmentPosition = position;
        anchorInfo.percentOffset.x = 0;
        anchorInfo.horizontalPositionAlignment = alignmentPosition.alignment;
        anchorInfo.horizontalPositionType = alignmentPosition.relativeTo;
        return true;
    }
    else if (isDefined(position.position)) {
        const absolutePosition = position;
        anchorInfo.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.None;
        anchorInfo.percentOffset.x = 0;
        anchorInfo.offset.x = absolutePosition.position;
        anchorInfo.horizontalPositionType = absolutePosition.relativeTo;
        return true;
    }
    else if (isDefined(position.relativePosition)) {
        const relativePosition = position;
        anchorInfo.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.None;
        anchorInfo.percentOffset.x = relativePosition.relativePosition;
        anchorInfo.horizontalPositionType = relativePosition.relativeTo;
        return true;
    }
    return false;
}
export function applyVerticalPosition(position, anchorInfo) {
    if (isDefined(position.alignment)) {
        const alignmentPosition = position;
        anchorInfo.percentOffset.y = 0;
        anchorInfo.verticalPositionAlignment = alignmentPosition.alignment;
        anchorInfo.verticalPositionType = alignmentPosition.relativeTo;
        return true;
    }
    else if (isDefined(position.position)) {
        const absolutePosition = position;
        anchorInfo.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.None;
        anchorInfo.percentOffset.y = 0;
        anchorInfo.offset.y = absolutePosition.position;
        anchorInfo.verticalPositionType = absolutePosition.relativeTo;
        return true;
    }
    else if (isDefined(position.relativePosition)) {
        const relativePosition = position;
        anchorInfo.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.None;
        anchorInfo.percentOffset.y = relativePosition.relativePosition;
        anchorInfo.verticalPositionType = relativePosition.relativeTo;
        return true;
    }
    return false;
}
function setDistanceProperty(processor, subDocument, position, value, manipulator) {
    if (isDefined(value))
        processor.modelManager.modelManipulator.picture.changeNumberedShapeProperty(subDocument, position, value, manipulator);
}
export class FloatingImageApi extends ImageApi {
    constructor(processor, subDocument, position, run) {
        super(processor, subDocument, position, run);
    }
    get outlineColor() { return ApiUtils.internalColorToApiColor(this._run.info.shape.outlineColor); }
    set outlineColor(value) {
        const color = ApiParametersChecker.check(value, 1, false, ModelParametersChecker.colorDescriptors('value'));
        this._processor.beginUpdate();
        this._processor.modelManager.modelManipulator.picture.changeShapeOutlineColor(this._subDocument, this._position, color);
        this._processor.endUpdate();
    }
    get outlineWidth() { return this._run.info.shape.outlineWidth; }
    set outlineWidth(value) {
        this._processor.beginUpdate();
        this._processor.modelManager.modelManipulator.picture.changeShapeOutlineWidth(this._subDocument, this._position, value);
        this._processor.endUpdate();
    }
    get wrapSide() { return this._run.anchorInfo.wrapSide; }
    set wrapSide(wrapSide) {
        ApiParametersChecker.check(wrapSide, 1, false, [
            ApiParametersChecker.objectDescriptor('wrapSide', 'WrapSide', (val) => val)
        ]);
        if (this.wrapSide !== wrapSide)
            this._processor.modelManager.modelManipulator.picture.changeWrapSide(this._subDocument, this._position, wrapSide);
    }
    get distance() {
        const anchorInfo = this._run.anchorInfo;
        return {
            left: anchorInfo.leftDistance,
            top: anchorInfo.topDistance,
            right: anchorInfo.rightDistance,
            bottom: anchorInfo.bottomDistance
        };
    }
    set distance(value) {
        const history = this._processor.modelManager.history;
        this._processor.beginUpdate();
        history.beginTransaction();
        const anchorInfoManip = this._processor.modelManager.modelManipulator.floatingObject.anchorInfo;
        setDistanceProperty(this._processor, this._subDocument, this._position, value.left, anchorInfoManip.leftDistance);
        setDistanceProperty(this._processor, this._subDocument, this._position, value.top, anchorInfoManip.topDistance);
        setDistanceProperty(this._processor, this._subDocument, this._position, value.right, anchorInfoManip.rightDistance);
        setDistanceProperty(this._processor, this._subDocument, this._position, value.bottom, anchorInfoManip.bottomDistance);
        history.endTransaction();
        this._processor.endUpdate();
    }
    getHorizontalPosition() {
        const anchorInfo = this._run.anchorInfo;
        if (anchorInfo.isUsedHorizontalAlignment())
            return new HorizontalAlignedPositionApi(anchorInfo.horizontalPositionType, anchorInfo.horizontalPositionAlignment);
        if (anchorInfo.isUsedHorizontalAbsolutePosition())
            return new HorizontalAbsolutePositionApi(anchorInfo.horizontalPositionType, anchorInfo.offset.x);
        return new HorizontalRelativePositionApi(anchorInfo.horizontalPositionType, anchorInfo.percentOffset.x);
    }
    setHorizontalPosition(position) {
        ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.objectDescriptor('position', 'IHorizontalAlignmentPosition', (val) => val),
            ApiParametersChecker.objectDescriptor('position', 'IHorizontalAbsolutePosition', (val) => val),
            ApiParametersChecker.objectDescriptor('position', 'IHorizontalRelativePosition', (val) => val)
        ]);
        const newAnchorInfo = this._run.anchorInfo.clone();
        if (applyHorizontalPosition(position, newAnchorInfo)) {
            this._processor.beginUpdate();
            this._processor.modelManager.modelManipulator.picture.changeHorizontalPosition(this._subDocument, this._position, newAnchorInfo);
            this._processor.endUpdate();
        }
    }
    getVerticalPosition() {
        const anchorInfo = this._run.anchorInfo;
        if (anchorInfo.isUsedVerticalAlignment())
            return new VerticalAlignedPositionApi(anchorInfo.verticalPositionType, anchorInfo.verticalPositionAlignment);
        if (anchorInfo.isUsedVerticalAbsolutePosition())
            return new VerticalAbsolutePositionApi(anchorInfo.verticalPositionType, anchorInfo.offset.y);
        return new VerticalRelativePositionApi(anchorInfo.verticalPositionType, anchorInfo.percentOffset.y);
    }
    setVerticalPosition(position) {
        ApiParametersChecker.check(position, 1, false, [
            ApiParametersChecker.objectDescriptor('position', 'IVerticalAlignmentPositionApi', (val) => val),
            ApiParametersChecker.objectDescriptor('position', 'IVerticalAbsolutePositionApi', (val) => val),
            ApiParametersChecker.objectDescriptor('position', 'IVerticalRelativePositionApi', (val) => val)
        ]);
        const newAnchorInfo = this._run.anchorInfo.clone();
        if (applyVerticalPosition(position, newAnchorInfo))
            this._processor.modelManager.modelManipulator.picture.changeVerticalPosition(this._subDocument, this._position, newAnchorInfo);
    }
    getWrapType() {
        const anchorInfo = this._run.anchorInfo;
        switch (anchorInfo.wrapType) {
            case AnchorObjectTextWrapType.None:
                if (anchorInfo.isBehindDoc)
                    return WrapTypeApi.BehindText;
                else
                    return WrapTypeApi.InFrontOfText;
            case AnchorObjectTextWrapType.Square:
                return WrapTypeApi.Square;
            case AnchorObjectTextWrapType.Through:
                return WrapTypeApi.Through;
            case AnchorObjectTextWrapType.Tight:
                return WrapTypeApi.Tight;
            case AnchorObjectTextWrapType.TopAndBottom:
                return WrapTypeApi.TopAndBottom;
            default:
                return WrapTypeApi.Square;
        }
    }
    ;
}
