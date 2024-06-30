import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { BorderInfo } from '../borders/border-info';
import { ShadingInfo } from '../shadings/shading-info';
import { ParagraphPropertiesAfterAutoSpacingDescriptor, ParagraphPropertiesAlignmentDescriptor, ParagraphPropertiesBeforeAutoSpacingDescriptor, ParagraphPropertiesBetweenBorderDescriptor, ParagraphPropertiesBottomBorderDescriptor, ParagraphPropertiesContextualSpacingDescriptor, ParagraphPropertiesDivIdDescriptor, ParagraphPropertiesFirstLineIndentDescriptor, ParagraphPropertiesFirstLineIndentTypeDescriptor, ParagraphPropertiesKeepLinesTogetherDescriptor, ParagraphPropertiesKeepWithNextDescriptor, ParagraphPropertiesLeftBorderDescriptor, ParagraphPropertiesLeftIndentDescriptor, ParagraphPropertiesLineSpacingDescriptor, ParagraphPropertiesLineSpacingTypeDescriptor, ParagraphPropertiesOutlineLevelDescriptor, ParagraphPropertiesPageBreakBeforeDescriptor, ParagraphPropertiesRightBorderDescriptor, ParagraphPropertiesRightIndentDescriptor, ParagraphPropertiesRightToLeftDescriptor, ParagraphPropertiesShadingInfoIndexDescriptor, ParagraphPropertiesSpacingAfterDescriptor, ParagraphPropertiesSpacingBeforeDescriptor, ParagraphPropertiesSuppressHyphenationDescriptor, ParagraphPropertiesSuppressLineNumbersDescriptor, ParagraphPropertiesTopBorderDescriptor, ParagraphPropertiesWidowOrphanControlDescriptor } from './paragraph-property-descriptors';
export var ParagraphPropertiesMask;
(function (ParagraphPropertiesMask) {
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseNone"] = 0] = "UseNone";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseAlignment"] = 1] = "UseAlignment";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseLeftIndent"] = 2] = "UseLeftIndent";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseRightIndent"] = 4] = "UseRightIndent";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseSpacingBefore"] = 8] = "UseSpacingBefore";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseSpacingAfter"] = 16] = "UseSpacingAfter";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseLineSpacing"] = 32] = "UseLineSpacing";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseFirstLineIndent"] = 64] = "UseFirstLineIndent";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseSuppressHyphenation"] = 128] = "UseSuppressHyphenation";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseSuppressLineNumbers"] = 256] = "UseSuppressLineNumbers";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseContextualSpacing"] = 512] = "UseContextualSpacing";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UsePageBreakBefore"] = 1024] = "UsePageBreakBefore";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseBeforeAutoSpacing"] = 2048] = "UseBeforeAutoSpacing";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseAfterAutoSpacing"] = 4096] = "UseAfterAutoSpacing";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseKeepWithNext"] = 8192] = "UseKeepWithNext";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseKeepLinesTogether"] = 16384] = "UseKeepLinesTogether";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseWidowOrphanControl"] = 32768] = "UseWidowOrphanControl";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseOutlineLevel"] = 65536] = "UseOutlineLevel";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseShadingInfoIndex"] = 131072] = "UseShadingInfoIndex";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseLeftBorder"] = 262144] = "UseLeftBorder";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseRightBorder"] = 524288] = "UseRightBorder";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseTopBorder"] = 1048576] = "UseTopBorder";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseBottomBorder"] = 2097152] = "UseBottomBorder";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseDivId"] = 4194304] = "UseDivId";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseBorders"] = 20709376] = "UseBorders";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseRightToLeft"] = 8388608] = "UseRightToLeft";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseBetweenBorder"] = 16777216] = "UseBetweenBorder";
    ParagraphPropertiesMask[ParagraphPropertiesMask["UseAll"] = 2147483647] = "UseAll";
})(ParagraphPropertiesMask || (ParagraphPropertiesMask = {}));
export var ParagraphAlignment;
(function (ParagraphAlignment) {
    ParagraphAlignment[ParagraphAlignment["Left"] = 0] = "Left";
    ParagraphAlignment[ParagraphAlignment["Right"] = 1] = "Right";
    ParagraphAlignment[ParagraphAlignment["Center"] = 2] = "Center";
    ParagraphAlignment[ParagraphAlignment["Justify"] = 3] = "Justify";
    ParagraphAlignment[ParagraphAlignment["JustifyMedium"] = 4] = "JustifyMedium";
    ParagraphAlignment[ParagraphAlignment["JustifyHigh"] = 5] = "JustifyHigh";
    ParagraphAlignment[ParagraphAlignment["JustifyLow"] = 6] = "JustifyLow";
    ParagraphAlignment[ParagraphAlignment["Distribute"] = 7] = "Distribute";
    ParagraphAlignment[ParagraphAlignment["ThaiDistribute"] = 8] = "ThaiDistribute";
})(ParagraphAlignment || (ParagraphAlignment = {}));
export var ParagraphLineSpacingType;
(function (ParagraphLineSpacingType) {
    ParagraphLineSpacingType[ParagraphLineSpacingType["Single"] = 0] = "Single";
    ParagraphLineSpacingType[ParagraphLineSpacingType["Sesquialteral"] = 1] = "Sesquialteral";
    ParagraphLineSpacingType[ParagraphLineSpacingType["Double"] = 2] = "Double";
    ParagraphLineSpacingType[ParagraphLineSpacingType["Multiple"] = 3] = "Multiple";
    ParagraphLineSpacingType[ParagraphLineSpacingType["Exactly"] = 4] = "Exactly";
    ParagraphLineSpacingType[ParagraphLineSpacingType["AtLeast"] = 5] = "AtLeast";
})(ParagraphLineSpacingType || (ParagraphLineSpacingType = {}));
export var ParagraphFirstLineIndent;
(function (ParagraphFirstLineIndent) {
    ParagraphFirstLineIndent[ParagraphFirstLineIndent["None"] = 0] = "None";
    ParagraphFirstLineIndent[ParagraphFirstLineIndent["Indented"] = 1] = "Indented";
    ParagraphFirstLineIndent[ParagraphFirstLineIndent["Hanging"] = 2] = "Hanging";
})(ParagraphFirstLineIndent || (ParagraphFirstLineIndent = {}));
export class ParagraphPropertyDescriptor {
}
ParagraphPropertyDescriptor.firstLineIndent = new ParagraphPropertiesFirstLineIndentDescriptor();
ParagraphPropertyDescriptor.widowOrphanControl = new ParagraphPropertiesWidowOrphanControlDescriptor();
ParagraphPropertyDescriptor.firstLineIndentType = new ParagraphPropertiesFirstLineIndentTypeDescriptor();
ParagraphPropertyDescriptor.afterAutoSpacing = new ParagraphPropertiesAfterAutoSpacingDescriptor();
ParagraphPropertyDescriptor.outlineLevel = new ParagraphPropertiesOutlineLevelDescriptor();
ParagraphPropertyDescriptor.beforeAutoSpacing = new ParagraphPropertiesBeforeAutoSpacingDescriptor();
ParagraphPropertyDescriptor.pageBreakBefore = new ParagraphPropertiesPageBreakBeforeDescriptor();
ParagraphPropertyDescriptor.rightIndent = new ParagraphPropertiesRightIndentDescriptor();
ParagraphPropertyDescriptor.suppressHyphenation = new ParagraphPropertiesSuppressHyphenationDescriptor();
ParagraphPropertyDescriptor.lineSpacing = new ParagraphPropertiesLineSpacingDescriptor();
ParagraphPropertyDescriptor.suppressLineNumbers = new ParagraphPropertiesSuppressLineNumbersDescriptor();
ParagraphPropertyDescriptor.keepLinesTogether = new ParagraphPropertiesKeepLinesTogetherDescriptor();
ParagraphPropertyDescriptor.keepWithNext = new ParagraphPropertiesKeepWithNextDescriptor();
ParagraphPropertyDescriptor.shadingInfo = new ParagraphPropertiesShadingInfoIndexDescriptor();
ParagraphPropertyDescriptor.leftIndent = new ParagraphPropertiesLeftIndentDescriptor();
ParagraphPropertyDescriptor.lineSpacingType = new ParagraphPropertiesLineSpacingTypeDescriptor();
ParagraphPropertyDescriptor.alignment = new ParagraphPropertiesAlignmentDescriptor();
ParagraphPropertyDescriptor.contextualSpacing = new ParagraphPropertiesContextualSpacingDescriptor();
ParagraphPropertyDescriptor.spacingBefore = new ParagraphPropertiesSpacingBeforeDescriptor();
ParagraphPropertyDescriptor.spacingAfter = new ParagraphPropertiesSpacingAfterDescriptor();
ParagraphPropertyDescriptor.rightToLeft = new ParagraphPropertiesRightToLeftDescriptor();
ParagraphPropertyDescriptor.leftBorder = new ParagraphPropertiesLeftBorderDescriptor();
ParagraphPropertyDescriptor.rightBorder = new ParagraphPropertiesRightBorderDescriptor();
ParagraphPropertyDescriptor.topBorder = new ParagraphPropertiesTopBorderDescriptor();
ParagraphPropertyDescriptor.bottomBorder = new ParagraphPropertiesBottomBorderDescriptor();
ParagraphPropertyDescriptor.betweenBorder = new ParagraphPropertiesBetweenBorderDescriptor();
ParagraphPropertyDescriptor.divId = new ParagraphPropertiesDivIdDescriptor();
ParagraphPropertyDescriptor.ALL_FIELDS = [
    ParagraphPropertyDescriptor.firstLineIndent,
    ParagraphPropertyDescriptor.widowOrphanControl,
    ParagraphPropertyDescriptor.firstLineIndentType,
    ParagraphPropertyDescriptor.afterAutoSpacing,
    ParagraphPropertyDescriptor.outlineLevel,
    ParagraphPropertyDescriptor.beforeAutoSpacing,
    ParagraphPropertyDescriptor.pageBreakBefore,
    ParagraphPropertyDescriptor.rightIndent,
    ParagraphPropertyDescriptor.suppressHyphenation,
    ParagraphPropertyDescriptor.lineSpacing,
    ParagraphPropertyDescriptor.suppressLineNumbers,
    ParagraphPropertyDescriptor.keepLinesTogether,
    ParagraphPropertyDescriptor.keepWithNext,
    ParagraphPropertyDescriptor.shadingInfo,
    ParagraphPropertyDescriptor.leftIndent,
    ParagraphPropertyDescriptor.lineSpacingType,
    ParagraphPropertyDescriptor.alignment,
    ParagraphPropertyDescriptor.contextualSpacing,
    ParagraphPropertyDescriptor.spacingBefore,
    ParagraphPropertyDescriptor.spacingAfter,
    ParagraphPropertyDescriptor.rightToLeft,
    ParagraphPropertyDescriptor.leftBorder,
    ParagraphPropertyDescriptor.rightBorder,
    ParagraphPropertyDescriptor.topBorder,
    ParagraphPropertyDescriptor.bottomBorder,
    ParagraphPropertyDescriptor.betweenBorder,
    ParagraphPropertyDescriptor.divId
];
export class ParagraphProperties {
    constructor() {
        this.firstLineIndent = 0;
        this.widowOrphanControl = true;
        this.firstLineIndentType = ParagraphFirstLineIndent.None;
        this.afterAutoSpacing = false;
        this.outlineLevel = 0;
        this.beforeAutoSpacing = false;
        this.pageBreakBefore = false;
        this.rightIndent = 0;
        this.suppressHyphenation = false;
        this.lineSpacing = 0;
        this.suppressLineNumbers = false;
        this.keepLinesTogether = false;
        this.keepWithNext = false;
        this.shadingInfo = ShadingInfo.nullColor;
        this.rightToLeft = false;
        this.leftIndent = 0;
        this.lineSpacingType = ParagraphLineSpacingType.Single;
        this.alignment = ParagraphAlignment.Left;
        this.contextualSpacing = false;
        this.spacingBefore = 0;
        this.spacingAfter = 0;
        this.leftBorder = new BorderInfo();
        this.rightBorder = new BorderInfo();
        this.topBorder = new BorderInfo();
        this.bottomBorder = new BorderInfo();
        this.betweenBorder = new BorderInfo();
        this.divId = 0;
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.leftIndent ^
            MathUtils.somePrimes[1] * this.rightIndent ^
            MathUtils.somePrimes[2] * this.firstLineIndent ^
            MathUtils.somePrimes[3] * this.spacingBefore ^
            MathUtils.somePrimes[4] * this.spacingAfter;
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    copyFrom(obj) {
        this.alignment = obj.alignment;
        this.leftIndent = obj.leftIndent;
        this.rightIndent = obj.rightIndent;
        this.spacingBefore = obj.spacingBefore;
        this.spacingAfter = obj.spacingAfter;
        this.lineSpacing = obj.lineSpacing;
        this.firstLineIndent = obj.firstLineIndent;
        this.suppressHyphenation = obj.suppressHyphenation;
        this.suppressLineNumbers = obj.suppressLineNumbers;
        this.contextualSpacing = obj.contextualSpacing;
        this.pageBreakBefore = obj.pageBreakBefore;
        this.beforeAutoSpacing = obj.beforeAutoSpacing;
        this.afterAutoSpacing = obj.afterAutoSpacing;
        this.keepWithNext = obj.keepWithNext;
        this.keepLinesTogether = obj.keepLinesTogether;
        this.widowOrphanControl = obj.widowOrphanControl;
        this.outlineLevel = obj.outlineLevel;
        this.firstLineIndentType = obj.firstLineIndentType;
        this.lineSpacingType = obj.lineSpacingType;
        this.rightToLeft = obj.rightToLeft;
        this.shadingInfo = obj.shadingInfo ? obj.shadingInfo.clone() : obj.shadingInfo;
        if (obj.leftBorder)
            this.leftBorder.copyFrom(obj.leftBorder);
        else
            this.leftBorder = obj.leftBorder;
        if (obj.rightBorder)
            this.rightBorder.copyFrom(obj.rightBorder);
        else
            this.rightBorder = obj.rightBorder;
        if (obj.topBorder)
            this.topBorder.copyFrom(obj.topBorder);
        else
            this.topBorder = obj.topBorder;
        if (obj.bottomBorder)
            this.bottomBorder.copyFrom(obj.bottomBorder);
        else
            this.bottomBorder = obj.bottomBorder;
        if (obj.betweenBorder)
            this.betweenBorder.copyFrom(obj.betweenBorder);
        else
            this.betweenBorder = obj.betweenBorder;
        this.divId = obj.divId;
    }
    clone() {
        var result = new ParagraphProperties();
        result.copyFrom(this);
        return result;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.firstLineIndent == obj.firstLineIndent &&
            this.firstLineIndentType == obj.firstLineIndentType &&
            this.afterAutoSpacing == obj.afterAutoSpacing &&
            this.outlineLevel == obj.outlineLevel &&
            this.beforeAutoSpacing == obj.beforeAutoSpacing &&
            this.pageBreakBefore == obj.pageBreakBefore &&
            this.rightIndent == obj.rightIndent &&
            this.suppressHyphenation == obj.suppressHyphenation &&
            this.lineSpacing == obj.lineSpacing &&
            this.suppressLineNumbers == obj.suppressLineNumbers &&
            this.keepLinesTogether == obj.keepLinesTogether &&
            this.keepWithNext == obj.keepWithNext &&
            this.shadingInfo.equals(obj.shadingInfo) &&
            this.leftIndent == obj.leftIndent &&
            this.lineSpacingType == obj.lineSpacingType &&
            this.alignment == obj.alignment &&
            this.contextualSpacing == obj.contextualSpacing &&
            this.rightToLeft == obj.rightToLeft &&
            this.spacingBefore == obj.spacingBefore &&
            this.spacingAfter == obj.spacingAfter &&
            this.leftBorder.equals(obj.leftBorder) &&
            this.rightBorder.equals(obj.rightBorder) &&
            this.topBorder.equals(obj.topBorder) &&
            this.bottomBorder.equals(obj.bottomBorder) &&
            this.betweenBorder.equals(obj.betweenBorder) &&
            this.divId == obj.divId;
    }
    getLeftIndentForFirstRow() {
        let indent = this.leftIndent;
        switch (this.firstLineIndentType) {
            case ParagraphFirstLineIndent.None:
            case ParagraphFirstLineIndent.Indented:
                indent += this.firstLineIndent;
                break;
            case ParagraphFirstLineIndent.Hanging:
                indent -= this.firstLineIndent;
        }
        return indent;
    }
    getLeftIndentForOtherRow() {
        return this.leftIndent;
    }
    getLeftIndentForParagraphFrame() {
        let indent = this.leftIndent;
        if (this.firstLineIndentType == ParagraphFirstLineIndent.Hanging)
            indent -= this.firstLineIndent;
        return UnitConverter.twipsToPixelsF(indent);
    }
}
export class MaskedParagraphProperties extends ParagraphProperties {
    constructor() {
        super(...arguments);
        this.useValue = ParagraphPropertiesMask.UseNone;
    }
    getUseValue(value) {
        return (this.useValue & value) != 0;
    }
    calculateHash() {
        return super.calculateHash() +
            MathUtils.somePrimes[15] * this.useValue;
    }
    setUseValue(mask, value) {
        if (value)
            this.useValue |= mask;
        else
            this.useValue &= ~mask;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.useValue = obj.useValue;
    }
    equals(obj) {
        return super.equals(obj)
            && this.useValue == obj.useValue;
    }
    clone() {
        var result = new MaskedParagraphProperties();
        result.copyFrom(this);
        return result;
    }
    static createDefault(model) {
        var prop = model.defaultParagraphProperties.clone();
        prop.useValue = ParagraphPropertiesMask.UseNone;
        return prop;
    }
    setValue(desc, value) {
        desc.setProp(this, value);
        this.setUseValue(desc.maskValue(), true);
    }
}
