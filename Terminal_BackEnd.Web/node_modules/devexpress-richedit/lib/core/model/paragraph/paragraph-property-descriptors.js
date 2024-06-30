import { Errors } from '@devexpress/utils/lib/errors';
import { Equals } from '@devexpress/utils/lib/utils/comparers';
import { BorderInfo } from '../borders/border-info';
import { ParagraphAfterAutoSpacingHistoryItem, ParagraphAlignmentHistoryItem, ParagraphBeforeAutoSpacingHistoryItem, ParagraphContextualSpacingHistoryItem, ParagraphDivIdHistoryItem, ParagraphFirstLineIndentHistoryItem, ParagraphFirstLineIndentTypeHistoryItem, ParagraphKeepLinesTogetherHistoryItem, ParagraphKeepWithNextHistoryItem, ParagraphLeftIndentHistoryItem, ParagraphLineSpacingHistoryItem, ParagraphLineSpacingTypeHistoryItem, ParagraphOutlineLevelHistoryItem, ParagraphPageBreakBeforeHistoryItem, ParagraphRightIndentHistoryItem, ParagraphRightToLeftHistoryItem, ParagraphShadingInfoIndexHistoryItem, ParagraphSpacingAfterHistoryItem, ParagraphSpacingBeforeHistoryItem, ParagraphSuppressHyphenationHistoryItem, ParagraphSuppressLineNumbersHistoryItem, ParagraphWidowOrphanControlHistoryItem } from '../history/items/paragraph-properties-history-items';
import { JSONParagraphFormattingProperty } from '../json/enums/json-paragraph-enums';
import { ShadingInfo } from '../shadings/shading-info';
import { ParagraphAlignment, ParagraphFirstLineIndent, ParagraphLineSpacingType, ParagraphPropertiesMask } from './paragraph-properties';
export class ParagraphPropertiesFirstLineIndentDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.firstLineIndent = newValue;
    }
    getProp(props) {
        return props.firstLineIndent;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseFirstLineIndent;
    }
    getHistoryItemConstructor() {
        return ParagraphFirstLineIndentHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.FirstLineIndent;
    }
}
export class ParagraphPropertiesWidowOrphanControlDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = true;
    }
    setProp(props, newValue) {
        props.widowOrphanControl = newValue;
    }
    getProp(props) {
        return props.widowOrphanControl;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseWidowOrphanControl;
    }
    getHistoryItemConstructor() {
        return ParagraphWidowOrphanControlHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.WidowOrphanControl;
    }
}
export class ParagraphPropertiesFirstLineIndentTypeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = ParagraphFirstLineIndent.None;
    }
    setProp(props, newValue) {
        props.firstLineIndentType = newValue;
    }
    getProp(props) {
        return props.firstLineIndentType;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseFirstLineIndent;
    }
    getHistoryItemConstructor() {
        return ParagraphFirstLineIndentTypeHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.FirstLineIndentType;
    }
}
export class ParagraphPropertiesAfterAutoSpacingDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.afterAutoSpacing = newValue;
    }
    getProp(props) {
        return props.afterAutoSpacing;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseAfterAutoSpacing;
    }
    getHistoryItemConstructor() {
        return ParagraphAfterAutoSpacingHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.AfterAutoSpacing;
    }
}
export class ParagraphPropertiesOutlineLevelDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.outlineLevel = newValue;
    }
    getProp(props) {
        return props.outlineLevel;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseOutlineLevel;
    }
    getHistoryItemConstructor() {
        return ParagraphOutlineLevelHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.OutlineLevel;
    }
}
export class ParagraphPropertiesBeforeAutoSpacingDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.beforeAutoSpacing = newValue;
    }
    getProp(props) {
        return props.beforeAutoSpacing;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseBeforeAutoSpacing;
    }
    getHistoryItemConstructor() {
        return ParagraphBeforeAutoSpacingHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.BeforeAutoSpacing;
    }
}
export class ParagraphPropertiesPageBreakBeforeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.pageBreakBefore = newValue;
    }
    getProp(props) {
        return props.pageBreakBefore;
    }
    maskValue() {
        return ParagraphPropertiesMask.UsePageBreakBefore;
    }
    getHistoryItemConstructor() {
        return ParagraphPageBreakBeforeHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.PageBreakBefore;
    }
}
export class ParagraphPropertiesRightIndentDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.rightIndent = newValue;
    }
    getProp(props) {
        return props.rightIndent;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseRightIndent;
    }
    getHistoryItemConstructor() {
        return ParagraphRightIndentHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.RightIndent;
    }
}
export class ParagraphPropertiesSuppressHyphenationDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.suppressHyphenation = newValue;
    }
    getProp(props) {
        return props.suppressHyphenation;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseSuppressHyphenation;
    }
    getHistoryItemConstructor() {
        return ParagraphSuppressHyphenationHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.SuppressHyphenation;
    }
}
export class ParagraphPropertiesLineSpacingDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.lineSpacing = newValue;
    }
    getProp(props) {
        return props.lineSpacing;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseLineSpacing;
    }
    getHistoryItemConstructor() {
        return ParagraphLineSpacingHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.LineSpacing;
    }
}
export class ParagraphPropertiesSuppressLineNumbersDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.suppressLineNumbers = newValue;
    }
    getProp(props) {
        return props.suppressLineNumbers;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseSuppressLineNumbers;
    }
    getHistoryItemConstructor() {
        return ParagraphSuppressLineNumbersHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.SuppressLineNumbers;
    }
}
export class ParagraphPropertiesKeepLinesTogetherDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.keepLinesTogether = newValue;
    }
    getProp(props) {
        return props.keepLinesTogether;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseKeepLinesTogether;
    }
    getHistoryItemConstructor() {
        return ParagraphKeepLinesTogetherHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.KeepLinesTogether;
    }
}
export class ParagraphPropertiesKeepWithNextDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.keepWithNext = newValue;
    }
    getProp(props) {
        return props.keepWithNext;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseKeepWithNext;
    }
    getHistoryItemConstructor() {
        return ParagraphKeepWithNextHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.KeepWithNext;
    }
}
export class ParagraphPropertiesShadingInfoIndexDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = ShadingInfo.noColor;
    }
    setProp(props, newValue) {
        props.shadingInfo = newValue;
    }
    getProp(props) {
        return props.shadingInfo;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseShadingInfoIndex;
    }
    getHistoryItemConstructor() {
        return ParagraphShadingInfoIndexHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.ShadingInfo;
    }
}
export class ParagraphPropertiesLeftIndentDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.leftIndent = newValue;
    }
    getProp(props) {
        return props.leftIndent;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseLeftIndent;
    }
    getHistoryItemConstructor() {
        return ParagraphLeftIndentHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.LeftIndent;
    }
}
export class ParagraphPropertiesLineSpacingTypeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = ParagraphLineSpacingType.Single;
    }
    setProp(props, newValue) {
        props.lineSpacingType = newValue;
    }
    getProp(props) {
        return props.lineSpacingType;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseLineSpacing;
    }
    getHistoryItemConstructor() {
        return ParagraphLineSpacingTypeHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.LineSpacingType;
    }
}
export class ParagraphPropertiesAlignmentDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = ParagraphAlignment.Left;
    }
    setProp(props, newValue) {
        props.alignment = newValue;
    }
    getProp(props) {
        return props.alignment;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseAlignment;
    }
    getHistoryItemConstructor() {
        return ParagraphAlignmentHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.Alignment;
    }
}
export class ParagraphPropertiesContextualSpacingDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.contextualSpacing = newValue;
    }
    getProp(props) {
        return props.contextualSpacing;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseContextualSpacing;
    }
    getHistoryItemConstructor() {
        return ParagraphContextualSpacingHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.ContextualSpacing;
    }
}
export class ParagraphPropertiesSpacingBeforeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.spacingBefore = newValue;
    }
    getProp(props) {
        return props.spacingBefore;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseSpacingBefore;
    }
    getHistoryItemConstructor() {
        return ParagraphSpacingBeforeHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.SpacingBefore;
    }
}
export class ParagraphPropertiesSpacingAfterDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.spacingAfter = newValue;
    }
    getProp(props) {
        return props.spacingAfter;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseSpacingAfter;
    }
    getHistoryItemConstructor() {
        return ParagraphSpacingAfterHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.SpacingAfter;
    }
}
export class ParagraphPropertiesRightToLeftDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.rightToLeft = newValue;
    }
    getProp(props) {
        return props.rightToLeft;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseRightToLeft;
    }
    getHistoryItemConstructor() {
        return ParagraphRightToLeftHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.RightToLeft;
    }
}
export class ParagraphPropertiesLeftBorderDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = new BorderInfo();
    }
    setProp(props, newValue) {
        props.leftBorder = newValue;
    }
    getProp(props) {
        return props.leftBorder;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseLeftBorder;
    }
    getHistoryItemConstructor() {
        throw Error(Errors.NotImplemented);
    }
    getJSONProperty() {
        throw Error(Errors.NotImplemented);
    }
}
export class ParagraphPropertiesRightBorderDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = new BorderInfo();
    }
    setProp(props, newValue) {
        props.rightBorder = newValue;
    }
    getProp(props) {
        return props.rightBorder;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseRightBorder;
    }
    getHistoryItemConstructor() {
        throw Error(Errors.NotImplemented);
    }
    getJSONProperty() {
        throw Error(Errors.NotImplemented);
    }
}
export class ParagraphPropertiesTopBorderDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = new BorderInfo();
    }
    setProp(props, newValue) {
        props.topBorder = newValue;
    }
    getProp(props) {
        return props.topBorder;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseTopBorder;
    }
    getHistoryItemConstructor() {
        throw Error(Errors.NotImplemented);
    }
    getJSONProperty() {
        throw Error(Errors.NotImplemented);
    }
}
export class ParagraphPropertiesBottomBorderDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = new BorderInfo();
    }
    setProp(props, newValue) {
        props.bottomBorder = newValue;
    }
    getProp(props) {
        return props.bottomBorder;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseBottomBorder;
    }
    getHistoryItemConstructor() {
        throw Error(Errors.NotImplemented);
    }
    getJSONProperty() {
        throw Error(Errors.NotImplemented);
    }
}
export class ParagraphPropertiesBetweenBorderDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = new BorderInfo();
    }
    setProp(props, newValue) {
        props.betweenBorder = newValue;
    }
    getProp(props) {
        return props.betweenBorder;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseBetweenBorder;
    }
    getHistoryItemConstructor() {
        throw Error(Errors.NotImplemented);
    }
    getJSONProperty() {
        throw Error(Errors.NotImplemented);
    }
}
export class ParagraphPropertiesDivIdDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 0;
    }
    setProp(props, newValue) {
        props.divId = newValue;
    }
    getProp(props) {
        return props.divId;
    }
    maskValue() {
        return ParagraphPropertiesMask.UseDivId;
    }
    getHistoryItemConstructor() {
        return ParagraphDivIdHistoryItem;
    }
    getJSONProperty() {
        return JSONParagraphFormattingProperty.DivId;
    }
}
