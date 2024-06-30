import { TabLeaderType } from '../../../../core/layout/main-structures/layout-boxes/layout-tab-space-box';
import { BorderInfo } from '../../../../core/model/borders/border-info';
import { TabAlign } from '../../../../core/model/paragraph/paragraph';
import { MaskedParagraphProperties, ParagraphLineSpacingType, ParagraphPropertyDescriptor } from '../../../../core/model/paragraph/paragraph-properties';
import { TabProperties } from '../../../../core/model/paragraph/paragraph-style';
import { ShadingInfo } from '../../../../core/model/shadings/shading-info';
import { ParagraphListInfo } from '../../../../core/rich-utils/properties-bundle';
export class RtfParagraphProperties {
    constructor() {
        this.coreProperties = new MaskedParagraphProperties();
        this.paragraphListInfo = ParagraphListInfo.default;
        this.tabs = new TabProperties();
        this.tabAlignment = TabAlign.Left;
        this.tabLeader = TabLeaderType.None;
        this.rtfLineSpacingType = 0;
        this.rtfLineSpacingMultiplier = 1;
        this.useLineSpacingMultiplier = false;
        this.inTableParagraph = false;
        this.nestingLevel = 0;
        this.styleLink = -1;
        this.nextStyle = -1;
        this.processedBorder = new BorderInfo();
        this.paragraphFrameFormattingInfo = null;
    }
    get numberingListIndex() { return this.paragraphListInfo.numberingListIndex; }
    get listLevelIndex() { return this.paragraphListInfo.listLevelIndex; }
    set shadingPattern(value) { this.coreProperties.setValue(ParagraphPropertyDescriptor.shadingInfo, new ShadingInfo(value, this.coreProperties.shadingInfo.backColor, this.coreProperties.shadingInfo.foreColor)); }
    set backColor(value) { this.coreProperties.setValue(ParagraphPropertyDescriptor.shadingInfo, new ShadingInfo(this.coreProperties.shadingInfo.shadingPattern, value, this.coreProperties.shadingInfo.foreColor)); }
    set foreColor(value) { this.coreProperties.setValue(ParagraphPropertyDescriptor.shadingInfo, new ShadingInfo(this.coreProperties.shadingInfo.shadingPattern, this.coreProperties.shadingInfo.backColor, value)); }
    getCoreProperties() {
        this.applyLineSpacing();
        return this.coreProperties;
    }
    applyLineSpacing() {
        this.coreProperties.setValue(ParagraphPropertyDescriptor.lineSpacingType, this.calcLineSpacingType());
        this.coreProperties.setValue(ParagraphPropertyDescriptor.lineSpacing, this.calcLineSpacing());
    }
    calcLineSpacingType() {
        if (this.rtfLineSpacingType < 0)
            return ParagraphLineSpacingType.Exactly;
        if (this.rtfLineSpacingType > 0) {
            if (this.rtfLineSpacingMultiplier == 0)
                return ParagraphLineSpacingType.AtLeast;
            else {
                if (this.rtfLineSpacingType == 240)
                    return ParagraphLineSpacingType.Single;
                else if (this.rtfLineSpacingType == 360)
                    return ParagraphLineSpacingType.Sesquialteral;
                else if (this.rtfLineSpacingType == 480)
                    return ParagraphLineSpacingType.Double;
                else
                    return ParagraphLineSpacingType.Multiple;
            }
        }
        else {
            if (this.rtfLineSpacingMultiplier == 0 && this.useLineSpacingMultiplier)
                return ParagraphLineSpacingType.AtLeast;
            else
                return ParagraphLineSpacingType.Single;
        }
    }
    calcLineSpacing() {
        if (this.rtfLineSpacingMultiplier == 0) {
            if (this.rtfLineSpacingType == 0 && this.useLineSpacingMultiplier)
                return 240;
            else
                return this.rtfLineSpacingType != 0 ? Math.max(Math.abs(this.rtfLineSpacingType), 1) : 0;
        }
        else {
            if (this.rtfLineSpacingType < 0)
                return Math.max(Math.abs(this.rtfLineSpacingType), 1);
            else
                return this.rtfLineSpacingType / 240.0;
        }
    }
    clone() {
        const obj = new RtfParagraphProperties();
        obj.copyFrom(this);
        return obj;
    }
    copyFrom(obj) {
        this.coreProperties = obj.coreProperties.clone();
        this.paragraphListInfo = obj.paragraphListInfo.clone();
        this.tabs = obj.tabs.clone();
        this.tabAlignment = obj.tabAlignment;
        this.tabLeader = obj.tabLeader;
        this.rtfLineSpacingType = obj.rtfLineSpacingType;
        this.rtfLineSpacingMultiplier = obj.rtfLineSpacingMultiplier;
        this.useLineSpacingMultiplier = obj.useLineSpacingMultiplier;
        this.inTableParagraph = obj.inTableParagraph;
        this.nestingLevel = obj.nestingLevel;
        this.styleLink = obj.styleLink ? obj.styleLink : null;
        this.nextStyle = obj.nextStyle ? obj.nextStyle : null;
        this.processedBorder = obj.processedBorder ? obj.processedBorder.clone() : null;
        this.rtfTableStyleIndexForRowOrCell = obj.rtfTableStyleIndexForRowOrCell;
        this.paragraphFrameFormattingInfo = obj.paragraphFrameFormattingInfo ? obj.paragraphFrameFormattingInfo.clone() : null;
    }
}
