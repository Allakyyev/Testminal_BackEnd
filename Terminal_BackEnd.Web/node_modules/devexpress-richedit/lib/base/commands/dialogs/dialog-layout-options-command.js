import { BoundsCalculator } from '../../../core/layout-formatter/formatter/utils/bounds-calculator';
import { AnchorInfo } from '../../../core/model/floating-objects/anchor-info';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from '../../../core/model/floating-objects/enums';
import { AnchorTextBoxSize, PictureSize } from '../../../core/model/floating-objects/sizes';
import { TextBoxProperties } from '../../../core/model/floating-objects/text-box-properties';
import { ChangeRectangularObjectLockAspectRatioHistoryItem, ChangeRectangularObjectScaleHistoryItem } from '../../../core/model/history/items/change-rectangular-object-history-item';
import { AnchorInfoPropertyHistoryItem } from '../../../core/model/history/items/floating-objects/anchor-info-property-history-item';
import { ChangeAnchoredPictureSizeHistoryItem } from '../../../core/model/history/items/floating-objects/change-anchored-picture-size-history-item';
import { ChangeAnchoredTextBoxSizeHistoryItem } from '../../../core/model/history/items/floating-objects/change-anchored-text-box-size-history-item';
import { ChangeTextBoxPropertiesHistoryItem } from '../../../core/model/history/items/floating-objects/change-text-box-properties-history-item';
import { AnchorPictureInfo, InlinePictureInfo } from '../../../core/model/manipulators/picture-manipulator/insert-picture-manipulator-params';
import { ImageLoadingOptions } from '../../../core/model/manipulators/picture-manipulator/loader/image-loading-options';
import { RunType } from '../../../core/model/runs/run-type';
import { Shape } from '../../../core/model/shapes/shape';
import { SubDocumentInterval, SubDocumentPosition } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { ScrollState } from '../../scroll/model-states';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogLayoutOptionsCommand extends ShowDialogCommandBase {
    getState() {
        let enabled = this.isEnabled();
        let state = new SimpleCommandState(enabled);
        state.visible = enabled;
        return state;
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isSelected() &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPosition(), 1)]);
    }
    createParameters(_options) {
        let dialogParameters = new LayoutOptionsDialogParameters();
        const specialRunInfo = this.selection.specialRunInfo;
        let run = specialRunInfo.getParentSubDocument().getRunByPosition(specialRunInfo.getPosition());
        if (run.getType() === RunType.InlinePictureRun)
            dialogParameters.init(null, run.size, null, this.control);
        else {
            if (run.getType() === RunType.AnchoredPictureRun) {
                let anchoredRun = run;
                dialogParameters.init(anchoredRun.anchorInfo, anchoredRun.size, null, this.control);
            }
            else {
                let anchoredRun = run;
                dialogParameters.init(anchoredRun.anchorInfo, anchoredRun.size, anchoredRun.textBoxProperties, this.control);
            }
        }
        return dialogParameters;
    }
    applyParameters(_state, params, initParams) {
        let specialRunInfo = this.selection.specialRunInfo;
        let position = specialRunInfo.getPosition();
        let interval = new FixedInterval(position, 1);
        let subDocument = specialRunInfo.getParentSubDocument();
        let run = subDocument.getRunByPosition(position);
        let modelManipulator = this.modelManipulator;
        let anchorInfoManipulator = modelManipulator.floatingObject.anchorInfo;
        const topInfo = this.control.viewManager.canvasManager.getScrollTopInfo();
        let history = this.history;
        history.beginTransaction();
        let changed = false;
        let sizeChanged = false;
        if (initParams.wrapType !== null && params.wrapType === null && run.getType() === RunType.AnchoredPictureRun) {
            const pictureRun = run;
            this.history.beginTransaction();
            const charPropsBundle = this.inputPosition.charPropsBundle;
            this.modelManipulator.range.removeInterval(new SubDocumentInterval(this.selection.activeSubDocument, interval), true, false);
            const insertedResult = this.modelManipulator.picture.insertInlinePictureViaHistory(new SubDocumentPosition(this.selection.activeSubDocument, interval.start), charPropsBundle, new InlinePictureInfo(pictureRun.size, pictureRun.shape, -1, pictureRun.info.containerProperties, pictureRun.info.nonVisualDrawingProperties));
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(insertedResult.insertedInterval)));
            this.selection.scrollManager.setScroll(new ScrollState().byModelPosition(this.selection).setModelPosition(insertedResult.insertedInterval.end).useStdRelativePosition().useStdOffset());
            this.history.endTransaction();
            run = subDocument.getRunByPosition(interval.start);
            changed = true;
        }
        if (initParams.wrapType === null && params.wrapType !== null && run.getType() === RunType.InlinePictureRun) {
            const pictureRun = run;
            const newAnchorInfo = new AnchorInfo();
            newAnchorInfo.zOrder = this.modelManipulator.floatingObject.zOrder.getNewZOrder(this.selection.activeSubDocument);
            this.history.beginTransaction();
            const charPropsBundle = this.inputPosition.charPropsBundle;
            this.modelManipulator.range.removeInterval(new SubDocumentInterval(this.selection.activeSubDocument, interval), true, false);
            const insertedResult = this.modelManipulator.picture.insertAnchoredPictureViaHistory(new SubDocumentPosition(this.selection.activeSubDocument, interval.start), charPropsBundle, new AnchorPictureInfo(pictureRun.size, new Shape(), newAnchorInfo, pictureRun.info.containerProperties, pictureRun.info.nonVisualDrawingProperties), new ImageLoadingOptions(true));
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(insertedResult.insertedInterval)));
            this.selection.scrollManager.setScroll(new ScrollState().byModelPosition(this.selection).setModelPosition(insertedResult.insertedInterval.end).useStdRelativePosition().useStdOffset());
            this.history.endTransaction();
            run = subDocument.getRunByPosition(interval.start);
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.horizontalPositionAlignment !== undefined && params.horizontalPositionAlignment != initParams.horizontalPositionAlignment) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.horizontalPositionAlignment, anchorInfoManipulator.horizontalPositionAlignment));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.horizontalPositionType !== undefined && params.horizontalPositionType != initParams.horizontalPositionType) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.horizontalPositionType, anchorInfoManipulator.horizontalPositionType));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.offsetX !== undefined && params.offsetX != initParams.offsetX) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.offsetX, anchorInfoManipulator.offsetX));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.percentOffsetX !== undefined && params.percentOffsetX != initParams.percentOffsetX) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.percentOffsetX, anchorInfoManipulator.percentOffsetX));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.verticalPositionAlignment !== undefined && params.verticalPositionAlignment != initParams.verticalPositionAlignment) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.verticalPositionAlignment, anchorInfoManipulator.verticalPositionAlignment));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.verticalPositionType !== undefined && params.verticalPositionType != initParams.verticalPositionType) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.verticalPositionType, anchorInfoManipulator.verticalPositionType));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.offsetY !== undefined && params.offsetY != initParams.offsetY) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.offsetY, anchorInfoManipulator.offsetY));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.percentOffsetY !== undefined && params.percentOffsetY != initParams.percentOffsetY) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.percentOffsetY, anchorInfoManipulator.percentOffsetY));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.locked !== undefined && params.locked != initParams.locked) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.locked, anchorInfoManipulator.locked));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.wrapType !== undefined && params.wrapType !== null && params.wrapType != initParams.wrapType) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.wrapType, anchorInfoManipulator.wrapType));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.wrapSide !== undefined && params.wrapSide != initParams.wrapSide) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.wrapSide, anchorInfoManipulator.wrapSide));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.topDistance !== undefined && params.topDistance != initParams.topDistance) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.topDistance, anchorInfoManipulator.topDistance));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.bottomDistance !== undefined && params.bottomDistance != initParams.bottomDistance) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.bottomDistance, anchorInfoManipulator.bottomDistance));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.leftDistance !== undefined && params.leftDistance != initParams.leftDistance) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.leftDistance, anchorInfoManipulator.leftDistance));
            changed = true;
        }
        if (run.getType() != RunType.InlinePictureRun && params.rightDistance !== undefined && params.rightDistance != initParams.rightDistance) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.rightDistance, anchorInfoManipulator.rightDistance));
            changed = true;
        }
        let size = run.size.clone();
        if (params.absoluteHeight !== undefined && params.absoluteHeight != initParams.absoluteHeight || params.absoluteWidth !== undefined && params.absoluteWidth != initParams.absoluteWidth) {
            if (size instanceof PictureSize) {
                let pictureRun = run;
                let scaleX = (params.absoluteWidth / pictureRun.size.originalSize.width) * 100;
                let scaleY = (params.absoluteHeight / pictureRun.size.originalSize.height) * 100;
                let scale = new Size(scaleX, scaleY);
                size.scale = scale;
            }
            else {
                size.absoluteSize.width = params.absoluteWidth;
                size.absoluteSize.height = params.absoluteHeight;
            }
            sizeChanged = true;
        }
        if (initParams.useAbsoluteHeight !== undefined && params.useAbsoluteHeight !== initParams.useAbsoluteHeight && size instanceof AnchorTextBoxSize) {
            if (params.useAbsoluteHeight) {
                size.absoluteSize.height = params.absoluteHeight;
                params.textBoxProperties.resizeShapeToFitText = false;
            }
            size.setUseAbsoluteHeight(params.useAbsoluteHeight);
            sizeChanged = true;
        }
        if (initParams.useAbsoluteWidth !== undefined && params.useAbsoluteWidth !== initParams.useAbsoluteWidth && size instanceof AnchorTextBoxSize) {
            if (params.useAbsoluteWidth)
                size.absoluteSize.width = params.absoluteWidth;
            size.setUseAbsoluteWidth(params.useAbsoluteWidth);
            sizeChanged = true;
        }
        if (initParams.relativeHeight !== undefined && params.relativeHeight !== initParams.relativeHeight && size instanceof AnchorTextBoxSize) {
            size.relativeSize.height = params.relativeHeight;
            sizeChanged = true;
        }
        if (initParams.relativeWidth !== undefined && params.relativeWidth !== initParams.relativeWidth && size instanceof AnchorTextBoxSize) {
            size.relativeSize.width = params.relativeWidth;
            sizeChanged = true;
        }
        if (initParams.relativeHeightType !== undefined && params.relativeHeightType !== initParams.relativeHeightType && size instanceof AnchorTextBoxSize) {
            size.relativeHeightType = params.relativeHeightType;
            sizeChanged = true;
        }
        if (initParams.relativeWidthType !== undefined && params.relativeWidthType !== initParams.relativeWidthType && size instanceof AnchorTextBoxSize) {
            size.relativeWidthType = params.relativeWidthType;
            sizeChanged = true;
        }
        if (params.rotation !== undefined && params.rotation != initParams.rotation) {
            size.rotation = UnitConverter.degreesToTwips(params.rotation);
            sizeChanged = true;
        }
        if (params.lockAspectRatio !== undefined && params.lockAspectRatio != initParams.lockAspectRatio) {
            size.lockAspectRatio = params.lockAspectRatio;
            sizeChanged = true;
        }
        if (params.isBehindDoc !== undefined && params.isBehindDoc != initParams.isBehindDoc) {
            history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.isBehindDoc, anchorInfoManipulator.isBehindDoc));
            changed = true;
        }
        if (sizeChanged) {
            if (size instanceof PictureSize)
                if (run.getType() === RunType.InlinePictureRun) {
                    history.addAndRedo(new ChangeRectangularObjectScaleHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), size.scale));
                    if (params.lockAspectRatio != initParams.lockAspectRatio)
                        history.addAndRedo(new ChangeRectangularObjectLockAspectRatioHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), size.lockAspectRatio));
                }
                else
                    history.addAndRedo(new ChangeAnchoredPictureSizeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), size));
            else
                history.addAndRedo(new ChangeAnchoredTextBoxSizeHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), size));
            changed = true;
        }
        if (initParams.textBoxProperties !== undefined && !params.textBoxProperties.equals(initParams.textBoxProperties)) {
            history.addAndRedo(new ChangeTextBoxPropertiesHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), params.textBoxProperties));
            changed = true;
        }
        history.endTransaction();
        if (topInfo)
            this.selection.scrollManager.setScroll(new ScrollState().byScrollInfo.setPageInfo(topInfo));
        return changed;
    }
    getDialogName() {
        return "LayoutOptions";
    }
}
export class LayoutOptionsDialogParameters extends DialogParametersBase {
    init(anchorInfo, size, textBoxProperties, control) {
        let isAnchoredObject = anchorInfo !== null;
        this.horizontalPositionType = isAnchoredObject ? anchorInfo.horizontalPositionType : AnchorObjectHorizontalPositionType.Column;
        this.horizontalPositionAlignment = isAnchoredObject ? anchorInfo.horizontalPositionAlignment : AnchorObjectHorizontalPositionAlignment.Center;
        this.verticalPositionType = isAnchoredObject ? anchorInfo.verticalPositionType : AnchorObjectVerticalPositionType.Paragraph;
        this.verticalPositionAlignment = isAnchoredObject ? anchorInfo.verticalPositionAlignment : AnchorObjectVerticalPositionAlignment.Top;
        this.offsetX = isAnchoredObject ? anchorInfo.offset.x : null;
        this.offsetY = isAnchoredObject ? anchorInfo.offset.y : null;
        this.percentOffsetX = isAnchoredObject ? anchorInfo.percentOffset.x : null;
        this.percentOffsetY = isAnchoredObject ? anchorInfo.percentOffset.y : null;
        this.locked = isAnchoredObject ? anchorInfo.locked : null;
        this.wrapType = isAnchoredObject ? anchorInfo.wrapType : null;
        this.wrapSide = isAnchoredObject ? anchorInfo.wrapSide : null;
        this.isBehindDoc = isAnchoredObject ? anchorInfo.isBehindDoc : null;
        this.leftDistance = isAnchoredObject ? anchorInfo.leftDistance : null;
        this.rightDistance = isAnchoredObject ? anchorInfo.rightDistance : null;
        this.topDistance = isAnchoredObject ? anchorInfo.topDistance : null;
        this.bottomDistance = isAnchoredObject ? anchorInfo.bottomDistance : null;
        this.rotation = UnitConverter.twipsToDegrees(size.rotation);
        this.lockAspectRatio = size.lockAspectRatio;
        if (size instanceof PictureSize) {
            let pictureSize = size;
            this.originalWidth = pictureSize.originalSize.width;
            this.originalHeight = pictureSize.originalSize.height;
            this.absoluteWidth = (pictureSize.originalSize.width * pictureSize.scale.width) / 100;
            this.absoluteHeight = (pictureSize.originalSize.height * pictureSize.scale.height) / 100;
        }
        else {
            let section = control.modelManager.model.getSectionByPosition(control.selection.intervals[0].start);
            let boundsCalculator = new BoundsCalculator();
            boundsCalculator.init(section);
            let textBoxSize = size;
            this.useAbsoluteHeight = textBoxSize.useAbsoluteHeight();
            this.useAbsoluteWidth = textBoxSize.useAbsoluteWidth();
            this.absoluteWidth = this.useAbsoluteWidth ?
                textBoxSize.absoluteSize.width :
                UnitConverter.pixelsToTwips(textBoxSize.getActualRelativeWidth(boundsCalculator));
            this.absoluteHeight = this.useAbsoluteHeight ?
                textBoxSize.absoluteSize.height :
                UnitConverter.pixelsToTwips(textBoxSize.getActualRelativeHeight(boundsCalculator));
            this.relativeWidth = textBoxSize.relativeSize.width;
            this.relativeHeight = textBoxSize.relativeSize.height;
            this.relativeWidthType = textBoxSize.relativeWidthType;
            this.relativeHeightType = textBoxSize.relativeHeightType;
            this.originalWidth = this.absoluteWidth;
            this.originalHeight = this.absoluteHeight;
        }
        if (isAnchoredObject) {
            if (anchorInfo.isUsedHorizontalAlignment())
                this.horizontalAligmentType = LayoutDialogAlignmentType.Alignment;
            else if (anchorInfo.isUsedHorizontalBookLayout())
                this.horizontalAligmentType = LayoutDialogAlignmentType.BookLayout;
            else
                this.horizontalAligmentType = anchorInfo.isUsedHorizontalRelativePosition() ? LayoutDialogAlignmentType.Relative : LayoutDialogAlignmentType.Absolute;
            if (anchorInfo.isUsedVerticalAlignment())
                this.verticalAligmentType = LayoutDialogAlignmentType.Alignment;
            else
                this.verticalAligmentType = anchorInfo.isUsedVerticalRelativePosition() ? LayoutDialogAlignmentType.Relative : LayoutDialogAlignmentType.Absolute;
        }
        else {
            this.horizontalAligmentType = LayoutDialogAlignmentType.Absolute;
            this.verticalAligmentType = LayoutDialogAlignmentType.Absolute;
        }
        if (textBoxProperties)
            this.textBoxProperties = new TextBoxProperties(textBoxProperties.getContentMargins());
    }
    copyFrom(obj) {
        this.horizontalPositionType = obj.horizontalPositionType;
        this.horizontalPositionAlignment = obj.horizontalPositionAlignment;
        this.verticalPositionType = obj.verticalPositionType;
        this.verticalPositionAlignment = obj.verticalPositionAlignment;
        this.offsetX = obj.offsetX;
        this.offsetY = obj.offsetY;
        this.percentOffsetX = obj.percentOffsetX;
        this.percentOffsetY = obj.percentOffsetY;
        this.locked = obj.locked;
        this.wrapType = obj.wrapType;
        this.wrapSide = obj.wrapSide;
        this.isBehindDoc = obj.isBehindDoc;
        this.leftDistance = obj.leftDistance;
        this.rightDistance = obj.rightDistance;
        this.topDistance = obj.topDistance;
        this.bottomDistance = obj.bottomDistance;
        this.originalWidth = obj.originalWidth;
        this.originalHeight = obj.originalHeight;
        this.absoluteHeight = obj.absoluteHeight;
        this.absoluteWidth = obj.absoluteWidth;
        this.useAbsoluteHeight = obj.useAbsoluteHeight;
        this.useAbsoluteWidth = obj.useAbsoluteWidth;
        this.relativeHeight = obj.relativeHeight;
        this.relativeWidth = obj.relativeWidth;
        this.relativeHeightType = obj.relativeHeightType;
        this.relativeWidthType = obj.relativeWidthType;
        this.rotation = obj.rotation;
        this.lockAspectRatio = obj.lockAspectRatio;
        this.horizontalAligmentType = obj.horizontalAligmentType;
        this.verticalAligmentType = obj.verticalAligmentType;
        this.textBoxProperties = obj.textBoxProperties ? obj.textBoxProperties.clone() : obj.textBoxProperties;
    }
    clone() {
        const newInstance = new LayoutOptionsDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(converterFunc) {
        if (this.offsetX)
            this.offsetX = converterFunc(this.offsetX);
        if (this.offsetY)
            this.offsetY = converterFunc(this.offsetY);
        if (this.leftDistance)
            this.leftDistance = converterFunc(this.leftDistance);
        if (this.rightDistance)
            this.rightDistance = converterFunc(this.rightDistance);
        if (this.topDistance)
            this.topDistance = converterFunc(this.topDistance);
        if (this.bottomDistance)
            this.bottomDistance = converterFunc(this.bottomDistance);
        if (this.absoluteHeight)
            this.absoluteHeight = converterFunc(this.absoluteHeight);
        if (this.absoluteWidth)
            this.absoluteWidth = converterFunc(this.absoluteWidth);
        if (this.originalWidth)
            this.originalWidth = converterFunc(this.originalWidth);
        if (this.originalHeight)
            this.originalHeight = converterFunc(this.originalHeight);
        if (this.textBoxProperties)
            this.textBoxProperties.setMarginsToAnotherMeasuringSystem(converterFunc);
        return this;
    }
}
export var LayoutDialogAlignmentType;
(function (LayoutDialogAlignmentType) {
    LayoutDialogAlignmentType[LayoutDialogAlignmentType["Alignment"] = 0] = "Alignment";
    LayoutDialogAlignmentType[LayoutDialogAlignmentType["BookLayout"] = 1] = "BookLayout";
    LayoutDialogAlignmentType[LayoutDialogAlignmentType["Absolute"] = 2] = "Absolute";
    LayoutDialogAlignmentType[LayoutDialogAlignmentType["Relative"] = 3] = "Relative";
})(LayoutDialogAlignmentType || (LayoutDialogAlignmentType = {}));
