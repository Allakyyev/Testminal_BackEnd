import { Equals } from '@devexpress/utils/lib/utils/comparers';
import { ColorModelInfo } from '../color/color-model-info';
import { FontBoldHistoryItem, FontCapsHistoryItem, FontCompositeFontInfoHistoryItem, FontHiddenHistoryItem, FontHighlightColorHistoryItem, FontItalicHistoryItem, FontLangInfoHistoryItem, FontNameHistoryItem, FontNoProofHistoryItem, FontScriptHistoryItem, FontShadingInfoHistoryItem, FontSizeHistoryItem, FontSmallCapsHistoryItem, FontStrikeoutColorHistoryItem, FontStrikeoutTypeHistoryItem, FontStrikeoutWordsOnlyHistoryItem, FontTextColorHistoryItem, FontUnderlineColorHistoryItem, FontUnderlineTypeHistoryItem, FontUnderlineWordsOnlyHistoryItem } from '../history/items/character-properties-history-items';
import { JSONCharacterFormattingProperty } from '../json/enums/json-character-enums';
import { ShadingInfo } from '../shadings/shading-info';
import { CompositeFontInfo } from './composite-font-info';
import { CharacterFormattingScript, CharacterPropertiesMask, StrikeoutType, UnderlineType } from './enums';
import { LangInfo } from './lang-info';
export class CharacterPropertiesAllCapsDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.allCaps = newValue;
    }
    getProp(props) {
        return props.allCaps;
    }
    maskValue() {
        return CharacterPropertiesMask.UseAllCaps;
    }
    getHistoryItemConstructor() {
        return FontCapsHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.AllCaps;
    }
}
export class CharacterPropertiesSmallCapsDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.smallCaps = newValue;
    }
    getProp(props) {
        return props.smallCaps;
    }
    maskValue() {
        return CharacterPropertiesMask.UseSmallCaps;
    }
    getHistoryItemConstructor() {
        return FontSmallCapsHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.SmallCaps;
    }
}
export class CharacterPropertiesFontSizeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = 11;
    }
    setProp(props, newValue) {
        props.fontSize = newValue;
    }
    getProp(props) {
        return props.fontSize;
    }
    maskValue() {
        return CharacterPropertiesMask.UseDoubleFontSize;
    }
    getHistoryItemConstructor() {
        return FontSizeHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.Size;
    }
}
export class CharacterPropertiesFontBoldDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.fontBold = newValue;
    }
    getProp(props) {
        return props.fontBold;
    }
    maskValue() {
        return CharacterPropertiesMask.UseFontBold;
    }
    getHistoryItemConstructor() {
        return FontBoldHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.Bold;
    }
}
export class CharacterPropertiesFontItalicDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.fontItalic = newValue;
    }
    getProp(props) {
        return props.fontItalic;
    }
    maskValue() {
        return CharacterPropertiesMask.UseFontItalic;
    }
    getHistoryItemConstructor() {
        return FontItalicHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.Italic;
    }
}
export class CharacterPropertiesFontInfoDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = undefined;
    }
    setProp(props, newValue) {
        props.fontInfo = newValue;
    }
    getProp(props) {
        return props.fontInfo;
    }
    maskValue() {
        return CharacterPropertiesMask.UseFontName;
    }
    getHistoryItemConstructor() {
        return FontNameHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.FontName;
    }
}
export class CharacterPropertiesScriptDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = CharacterFormattingScript.Normal;
    }
    setProp(props, newValue) {
        props.script = newValue;
    }
    getProp(props) {
        return props.script;
    }
    maskValue() {
        return CharacterPropertiesMask.UseScript;
    }
    getHistoryItemConstructor() {
        return FontScriptHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.Script;
    }
}
export class CharacterPropertiesStrikeoutTypeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = StrikeoutType.None;
    }
    setProp(props, newValue) {
        props.fontStrikeoutType = newValue;
    }
    getProp(props) {
        return props.fontStrikeoutType;
    }
    maskValue() {
        return CharacterPropertiesMask.UseFontStrikeoutType;
    }
    getHistoryItemConstructor() {
        return FontStrikeoutTypeHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.StrikeoutType;
    }
}
export class CharacterPropertiesUnderlineTypeDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = UnderlineType.None;
    }
    setProp(props, newValue) {
        props.fontUnderlineType = newValue;
    }
    getProp(props) {
        return props.fontUnderlineType;
    }
    maskValue() {
        return CharacterPropertiesMask.UseFontUnderlineType;
    }
    getHistoryItemConstructor() {
        return FontUnderlineTypeHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.UnderlineType;
    }
}
export class CharacterPropertiesUnderlineWordsOnlyDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.underlineWordsOnly = newValue;
    }
    getProp(props) {
        return props.underlineWordsOnly;
    }
    maskValue() {
        return CharacterPropertiesMask.UseUnderlineWordsOnly;
    }
    getHistoryItemConstructor() {
        return FontUnderlineWordsOnlyHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.UnderlineWordsOnly;
    }
}
export class CharacterPropertiesStrikeoutWordsOnlyDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.strikeoutWordsOnly = newValue;
    }
    getProp(props) {
        return props.strikeoutWordsOnly;
    }
    maskValue() {
        return CharacterPropertiesMask.UseStrikeoutWordsOnly;
    }
    getHistoryItemConstructor() {
        return FontStrikeoutWordsOnlyHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.StrikeoutWordsOnly;
    }
}
export class CharacterPropertiesNoProofDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.noProof = newValue;
    }
    getProp(props) {
        return props.noProof;
    }
    maskValue() {
        return CharacterPropertiesMask.UseNoProof;
    }
    getHistoryItemConstructor() {
        return FontNoProofHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.NoProof;
    }
}
export class CharacterPropertiesHiddenDescriptor {
    constructor() {
        this.binaryEquals = Equals.simpleType;
        this.defaultValue = false;
    }
    setProp(props, newValue) {
        props.hidden = newValue;
    }
    getProp(props) {
        return props.hidden;
    }
    maskValue() {
        return CharacterPropertiesMask.UseHidden;
    }
    getHistoryItemConstructor() {
        return FontHiddenHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.Hidden;
    }
}
export class CharacterPropertiesTextColorDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = ColorModelInfo.autoColor;
    }
    setProp(props, newValue) {
        props.textColor = newValue;
    }
    getProp(props) {
        return props.textColor;
    }
    maskValue() {
        return CharacterPropertiesMask.UseForeColorIndex;
    }
    getHistoryItemConstructor() {
        return FontTextColorHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.TextColor;
    }
}
export class CharacterPropertiesShadingInfoColorDescriptor {
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
        return CharacterPropertiesMask.UseShadingInfoIndex;
    }
    getHistoryItemConstructor() {
        return FontShadingInfoHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.ShadingInfo;
    }
}
export class CharacterPropertiesStrikeoutColorDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = ColorModelInfo.noColor;
    }
    setProp(props, newValue) {
        props.strikeoutColor = newValue;
    }
    getProp(props) {
        return props.strikeoutColor;
    }
    maskValue() {
        return CharacterPropertiesMask.UseStrikeoutColorIndex;
    }
    getHistoryItemConstructor() {
        return FontStrikeoutColorHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.StrikeoutColor;
    }
}
export class CharacterPropertiesUnderlineColorDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = ColorModelInfo.noColor;
    }
    setProp(props, newValue) {
        props.underlineColor = newValue;
    }
    getProp(props) {
        return props.underlineColor;
    }
    maskValue() {
        return CharacterPropertiesMask.UseUnderlineColorIndex;
    }
    getHistoryItemConstructor() {
        return FontUnderlineColorHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.UnderlineColor;
    }
}
export class CharacterPropertiesHighlightColorDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = ColorModelInfo.noColor;
    }
    setProp(props, newValue) {
        props.highlightColor = newValue;
    }
    getProp(props) {
        return props.highlightColor;
    }
    maskValue() {
        return CharacterPropertiesMask.UseHighlightColorIndex;
    }
    getHistoryItemConstructor() {
        return FontHighlightColorHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.HighlightColor;
    }
}
export class CharacterPropertiesLangInfoDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = new LangInfo();
    }
    setProp(props, newValue) {
        props.langInfo = newValue;
    }
    getProp(props) {
        return props.langInfo;
    }
    maskValue() {
        return CharacterPropertiesMask.UseLangInfo;
    }
    getHistoryItemConstructor() {
        return FontLangInfoHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.LangInfo;
    }
}
export class CharacterPropertiesCompositeFontInfoDescriptor {
    constructor() {
        this.binaryEquals = Equals.object;
        this.defaultValue = new CompositeFontInfo();
    }
    setProp(props, newValue) {
        props.compositeFontInfo = newValue;
    }
    getProp(props) {
        return props.compositeFontInfo;
    }
    maskValue() {
        return CharacterPropertiesMask.UseCompositeFontInfo;
    }
    getHistoryItemConstructor() {
        return FontCompositeFontInfoHistoryItem;
    }
    getJSONProperty() {
        return JSONCharacterFormattingProperty.CompositeFontInfo;
    }
}
export class CharacterPropertyDescriptor {
}
CharacterPropertyDescriptor.allCaps = new CharacterPropertiesAllCapsDescriptor();
CharacterPropertyDescriptor.size = new CharacterPropertiesFontSizeDescriptor();
CharacterPropertyDescriptor.bold = new CharacterPropertiesFontBoldDescriptor();
CharacterPropertyDescriptor.italic = new CharacterPropertiesFontItalicDescriptor();
CharacterPropertyDescriptor.fontInfo = new CharacterPropertiesFontInfoDescriptor();
CharacterPropertyDescriptor.script = new CharacterPropertiesScriptDescriptor();
CharacterPropertyDescriptor.strikeoutType = new CharacterPropertiesStrikeoutTypeDescriptor();
CharacterPropertyDescriptor.underlineType = new CharacterPropertiesUnderlineTypeDescriptor();
CharacterPropertyDescriptor.underlineWordsOnly = new CharacterPropertiesUnderlineWordsOnlyDescriptor();
CharacterPropertyDescriptor.strikeoutWordsOnly = new CharacterPropertiesStrikeoutWordsOnlyDescriptor();
CharacterPropertyDescriptor.noProof = new CharacterPropertiesNoProofDescriptor();
CharacterPropertyDescriptor.hidden = new CharacterPropertiesHiddenDescriptor();
CharacterPropertyDescriptor.langInfo = new CharacterPropertiesLangInfoDescriptor();
CharacterPropertyDescriptor.compositeFontInfo = new CharacterPropertiesCompositeFontInfoDescriptor();
CharacterPropertyDescriptor.textColor = new CharacterPropertiesTextColorDescriptor();
CharacterPropertyDescriptor.shadingInfo = new CharacterPropertiesShadingInfoColorDescriptor();
CharacterPropertyDescriptor.highlightColor = new CharacterPropertiesHighlightColorDescriptor();
CharacterPropertyDescriptor.strikeoutColor = new CharacterPropertiesStrikeoutColorDescriptor();
CharacterPropertyDescriptor.underlineColor = new CharacterPropertiesUnderlineColorDescriptor();
CharacterPropertyDescriptor.smallCaps = new CharacterPropertiesSmallCapsDescriptor();
CharacterPropertyDescriptor.ALL_FIELDS = [
    CharacterPropertyDescriptor.allCaps,
    CharacterPropertyDescriptor.size,
    CharacterPropertyDescriptor.bold,
    CharacterPropertyDescriptor.italic,
    CharacterPropertyDescriptor.fontInfo,
    CharacterPropertyDescriptor.script,
    CharacterPropertyDescriptor.strikeoutType,
    CharacterPropertyDescriptor.underlineType,
    CharacterPropertyDescriptor.underlineWordsOnly,
    CharacterPropertyDescriptor.strikeoutWordsOnly,
    CharacterPropertyDescriptor.noProof,
    CharacterPropertyDescriptor.hidden,
    CharacterPropertyDescriptor.langInfo,
    CharacterPropertyDescriptor.compositeFontInfo,
    CharacterPropertyDescriptor.textColor,
    CharacterPropertyDescriptor.shadingInfo,
    CharacterPropertyDescriptor.highlightColor,
    CharacterPropertyDescriptor.strikeoutColor,
    CharacterPropertyDescriptor.underlineColor,
    CharacterPropertyDescriptor.smallCaps
];
CharacterPropertyDescriptor.whatNeedSetWhenCreateHyperlinkField = [
    CharacterPropertyDescriptor.size,
    CharacterPropertyDescriptor.bold,
    CharacterPropertyDescriptor.italic,
    CharacterPropertyDescriptor.fontInfo,
    CharacterPropertyDescriptor.script,
    CharacterPropertyDescriptor.strikeoutType,
    CharacterPropertyDescriptor.allCaps,
    CharacterPropertyDescriptor.underlineWordsOnly,
    CharacterPropertyDescriptor.strikeoutWordsOnly,
    CharacterPropertyDescriptor.noProof,
    CharacterPropertyDescriptor.hidden,
    CharacterPropertyDescriptor.shadingInfo,
    CharacterPropertyDescriptor.strikeoutColor,
    CharacterPropertyDescriptor.underlineColor,
    CharacterPropertyDescriptor.langInfo,
    CharacterPropertyDescriptor.smallCaps
];
