import { RelativeRect } from '../../../base-utils/relative-rect';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectTextWrapSide, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType, RelativeHeightType, RelativeWidthType } from '../../../core/model/floating-objects/enums';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { Size } from '@devexpress/utils/lib/geometry/size';
export class InlineDrawingObject {
    constructor(run) {
        this.run = run;
    }
    get fillColor() { return this.run.shape.fillColor; }
    get isFloatingObject() { return false; }
    get containerProperties() { return this.run.info.containerProperties; }
    get nonVisualDrawingObjectProperties() { return this.run.info.nonVisualDrawingProperties; }
    get actualSize() { return this.run.size.actualSize; }
    get rotation() { return 0; }
    get lockAspectRatio() { return this.run.size.lockAspectRatio; }
    get allowOverlap() { return false; }
    get isBehindDoc() { return false; }
    get layoutInTableCell() { return false; }
    get locked() { return false; }
    get zOrder() { return 0; }
    get useBottomDistance() { return false; }
    get bottomDistance() { return 0; }
    get useLeftDistance() { return false; }
    get leftDistance() { return 0; }
    get useRightDistance() { return false; }
    get rightDistance() { return 0; }
    get useTopDistance() { return false; }
    get topDistance() { return 0; }
    get useHidden() { return false; }
    get hidden() { return false; }
    get horizontalPositionAlignment() { return AnchorObjectHorizontalPositionAlignment.None; }
    get horizontalPositionType() { return AnchorObjectHorizontalPositionType.Page; }
    get usePercentOffset() { return false; }
    get verticalPositionAlignment() { return AnchorObjectVerticalPositionAlignment.None; }
    get verticalPositionType() { return AnchorObjectVerticalPositionType.Page; }
    get useRotation() { return false; }
    get textWrapType() { return AnchorObjectTextWrapType.None; }
    get textWrapSide() { return AnchorObjectTextWrapSide.Left; }
    get shape() { return null; }
    get useRelativeWidth() { return false; }
    get useRelativeHeight() { return false; }
    get relativeSize() { return new Size(0, 0); }
    get relativeHeightType() { return RelativeHeightType.Page; }
    get relativeWidthType() { return RelativeWidthType.Page; }
    get offset() { return new Point(0, 0); }
    get percentOffset() { return new Point(0, 0); }
    get hyperlinkInfo() { return null; }
    get sourceRect() { return new RelativeRect(0, 0, 0, 0); }
    get isTextBox() { return false; }
}
export class AnchoredDrawingObject {
    constructor(run) {
        this.run = run;
    }
    get fillColor() { return this.run.shape.fillColor; }
    get isFloatingObject() { return true; }
    get containerProperties() {
        return this.isTextBox ? this.run.containerProperties :
            this.run.info.containerProperties;
    }
    get nonVisualDrawingObjectProperties() { return null; }
    get actualSize() { return this.run.size.actualSize; }
    get rotation() { return this.run.size.rotation; }
    get lockAspectRatio() { return this.run.size.lockAspectRatio; }
    get allowOverlap() { return this.run.anchorInfo.allowOverlap; }
    get isBehindDoc() { return this.run.anchorInfo.isBehindDoc; }
    get layoutInTableCell() { return this.run.anchorInfo.layoutTableCell; }
    get locked() { return this.run.anchorInfo.locked; }
    get zOrder() { return this.run.anchorInfo.zOrder; }
    get useBottomDistance() { return true; }
    get bottomDistance() { return this.run.anchorInfo.bottomDistance; }
    get useLeftDistance() { return true; }
    get leftDistance() { return this.run.anchorInfo.leftDistance; }
    get useRightDistance() { return true; }
    get rightDistance() { return this.run.anchorInfo.rightDistance; }
    get useTopDistance() { return true; }
    get topDistance() { return this.run.anchorInfo.topDistance; }
    get useHidden() { return this.run.anchorInfo.hidden; }
    get hidden() { return this.run.anchorInfo.hidden; }
    get horizontalPositionAlignment() { return this.run.anchorInfo.horizontalPositionAlignment; }
    get horizontalPositionType() { return this.run.anchorInfo.horizontalPositionType; }
    get usePercentOffset() { return this.run.anchorInfo.percentOffset.x > 0 || this.run.anchorInfo.percentOffset.y > 0; }
    get verticalPositionAlignment() { return this.run.anchorInfo.verticalPositionAlignment; }
    get verticalPositionType() { return this.run.anchorInfo.verticalPositionType; }
    get useRotation() { return !!this.run.size.rotation; }
    get textWrapType() { return this.run.anchorInfo.wrapType; }
    get textWrapSide() { return this.run.anchorInfo.wrapSide; }
    get shape() { return this.run.shape; }
    get useRelativeWidth() { return false; }
    get useRelativeHeight() { return false; }
    get relativeSize() { return new Size(0, 0); }
    get relativeHeightType() { return RelativeHeightType.Page; }
    get relativeWidthType() { return RelativeWidthType.Page; }
    get offset() { return this.run.anchorInfo.offset; }
    get percentOffset() { return this.run.anchorInfo.percentOffset; }
    get hyperlinkInfo() { return null; }
    get sourceRect() { return new RelativeRect(0, 0, 0, 0); }
    get isTextBox() { return false; }
}
export class AnchoredDrawingPictureObject extends AnchoredDrawingObject {
    constructor(run) {
        super(run);
    }
}
export class AnchoredDrawingTextObject extends AnchoredDrawingObject {
    constructor(run) {
        super(run);
    }
    get actualSize() { return new Size(this.run.size.absoluteSize.width, this.run.size.absoluteSize.height); }
    get useRelativeWidth() { return !this.run.size.useAbsoluteWidth(); }
    get useRelativeHeight() { return !this.run.size.useAbsoluteHeight(); }
    get relativeSize() { return this.run.size.relativeSize; }
    get relativeHeightType() { return this.run.size.relativeHeightType; }
    get relativeWidthType() { return this.run.size.relativeWidthType; }
    get textBoxProperties() { return this.run.textBoxProperties; }
    get isTextBox() { return true; }
}
