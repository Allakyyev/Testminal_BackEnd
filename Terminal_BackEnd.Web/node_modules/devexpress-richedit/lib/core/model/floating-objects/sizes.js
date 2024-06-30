import { Flag } from '@devexpress/utils/lib/class/flag';
import { Errors } from '@devexpress/utils/lib/errors';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { RelativeHeightType, RelativeWidthType } from './enums';
export class AnchorInlineBaseSize {
    constructor(lockAspectRatio, rotation) {
        this.lockAspectRatio = lockAspectRatio;
        this.rotation = rotation;
    }
    clone() {
        throw new Error(Errors.NotImplemented);
    }
    copyFrom(obj) {
        this.lockAspectRatio = obj.lockAspectRatio;
        this.rotation = obj.rotation;
    }
}
export class PictureSize extends AnchorInlineBaseSize {
    constructor(lockAspectRatio, rotation, cacheInfo, scale) {
        super(lockAspectRatio, rotation);
        this.cacheInfo = cacheInfo;
        this.scale = scale;
    }
    get originalSize() { return this.cacheInfo.size; }
    ;
    get actualSize() {
        return Size.initByCommonAction(adp => adp(this.cacheInfo.size) * adp(this.scale) / 100);
    }
    clone() {
        return new PictureSize(this.lockAspectRatio, this.rotation, this.cacheInfo, this.scale.clone());
    }
    cloneToNewSubDocument(subDocument) {
        return new PictureSize(this.lockAspectRatio, this.rotation, subDocument.documentModel.cache.imageCache.getPictureData(this.cacheInfo.currId), this.scale.clone());
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.cacheInfo = obj.cacheInfo;
        this.scale = obj.scale.clone();
    }
}
export class InlineTextBoxSize extends AnchorInlineBaseSize {
    constructor(lockAspectRatio, rotation, absoluteSize) {
        super(lockAspectRatio, rotation);
        this.absoluteSize = absoluteSize;
    }
    get actualSize() {
        return this.absoluteSize.clone();
    }
    clone() {
        return new InlineTextBoxSize(this.lockAspectRatio, this.rotation, this.absoluteSize);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.absoluteSize = obj.absoluteSize.clone();
    }
}
export class AnchorTextBoxSize extends InlineTextBoxSize {
    constructor(lockAspectRatio, rotation, absoluteSize, relativeSize, relativeWidthType, relativeHeightType, useAbsoluteSizeWidth, useAbsoluteSizeHeight) {
        super(lockAspectRatio, rotation, absoluteSize);
        this.flags = new Flag();
        this.relativeSize = relativeSize;
        this.relativeWidthType = relativeWidthType;
        this.relativeHeightType = relativeHeightType;
        this.flags.set(useAbsoluteSizeWidth ? TextBoxSizeFlags.UseAbsoluteSizeWidth : TextBoxSizeFlags.UseRelativeSizeWidth, true);
        this.flags.set(useAbsoluteSizeHeight ? TextBoxSizeFlags.UseAbsoluteSizeHeight : TextBoxSizeFlags.UseRelativeSizeHeight, true);
    }
    useAbsoluteWidth() {
        return this.flags.get(TextBoxSizeFlags.UseAbsoluteSizeWidth);
    }
    useAbsoluteHeight() {
        return this.flags.get(TextBoxSizeFlags.UseAbsoluteSizeHeight);
    }
    setUseAbsoluteWidth(isUsed) {
        this.flags.set(TextBoxSizeFlags.UseAbsoluteSizeWidth, isUsed);
        this.flags.set(TextBoxSizeFlags.UseRelativeSizeWidth, !isUsed);
    }
    setUseAbsoluteHeight(isUsed) {
        this.flags.set(TextBoxSizeFlags.UseAbsoluteSizeHeight, isUsed);
        this.flags.set(TextBoxSizeFlags.UseRelativeSizeHeight, !isUsed);
    }
    get actualSize() {
        if (this.flags.get(TextBoxSizeFlags.UseRelativeSizeWidth))
            throw new Error(Errors.InternalException);
        if (this.flags.get(TextBoxSizeFlags.UseRelativeSizeHeight))
            throw new Error(Errors.InternalException);
        return this.absoluteSize.clone();
    }
    getActualRelativeHeight(boundsCalculator) {
        return this.relativeSize.height * this.getAbsHeight(boundsCalculator) / AnchorTextBoxSize.RELATIVE_COEFF;
    }
    getActualRelativeWidth(boundsCalculator) {
        return this.relativeSize.width * this.getAbsWidth(boundsCalculator) / AnchorTextBoxSize.RELATIVE_COEFF;
    }
    getAbsWidth(boundsCalculator) {
        switch (this.relativeWidthType) {
            case RelativeWidthType.Margin:
                return boundsCalculator.pageWidth - boundsCalculator.marginLeft - boundsCalculator.marginRight;
            case RelativeWidthType.OutsideMargin:
            case RelativeWidthType.LeftMargin:
                return boundsCalculator.marginLeft;
            case RelativeWidthType.InsideMargin:
            case RelativeWidthType.RightMargin:
                return boundsCalculator.marginRight;
            case RelativeWidthType.Page:
                return boundsCalculator.pageWidth;
            default: throw new Error(Errors.InternalException);
        }
    }
    getAbsHeight(boundsCalculator) {
        switch (this.relativeHeightType) {
            case RelativeHeightType.Margin:
                return boundsCalculator.pageHeight - boundsCalculator.marginTop - boundsCalculator.marginBottom;
            case RelativeHeightType.InsideMargin:
            case RelativeHeightType.TopMargin:
                return boundsCalculator.marginTop;
            case RelativeHeightType.OutsideMargin:
            case RelativeHeightType.BottomMargin:
                return boundsCalculator.marginBottom;
            case RelativeHeightType.Page:
                return boundsCalculator.pageHeight;
            default: throw new Error(Errors.InternalException);
        }
    }
    clone() {
        return new AnchorTextBoxSize(this.lockAspectRatio, this.rotation, this.absoluteSize.clone(), this.relativeSize.clone(), this.relativeWidthType, this.relativeHeightType, this.flags.get(TextBoxSizeFlags.UseAbsoluteSizeWidth), this.flags.get(TextBoxSizeFlags.UseAbsoluteSizeHeight));
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.relativeSize = obj.relativeSize.clone();
        this.relativeHeightType = obj.relativeHeightType;
        this.relativeWidthType = obj.relativeWidthType;
        this.flags = obj.flags;
    }
}
AnchorTextBoxSize.RELATIVE_COEFF = 100000;
export var TextBoxSizeFlags;
(function (TextBoxSizeFlags) {
    TextBoxSizeFlags[TextBoxSizeFlags["UseAbsoluteSizeWidth"] = 2] = "UseAbsoluteSizeWidth";
    TextBoxSizeFlags[TextBoxSizeFlags["UseAbsoluteSizeHeight"] = 4] = "UseAbsoluteSizeHeight";
    TextBoxSizeFlags[TextBoxSizeFlags["UseRelativeSizeWidth"] = 8] = "UseRelativeSizeWidth";
    TextBoxSizeFlags[TextBoxSizeFlags["UseRelativeSizeHeight"] = 16] = "UseRelativeSizeHeight";
})(TextBoxSizeFlags || (TextBoxSizeFlags = {}));
