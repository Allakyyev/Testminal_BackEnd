import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { FontInfoCache } from '../../caches/hashed-caches/font-info-cache';
import { MaskedCharacterProperties } from '../../character/character-properties';
import { LangInfo } from '../../character/lang-info';
import { JSONCharacterFormattingProperty, JSONLangInfoProperty } from '../enums/json-character-enums';
import { JSONColorModelInfoConverter } from './json-color-model-info-converter';
import { JSONShadingInfoConverter } from './json-shading-info-converter';
export class JSONMaskedCharacterPropertiesConverter {
    static convertFromJSON(obj, colorModelInfoCache, shadingInfoCache, fontCache) {
        var result = new MaskedCharacterProperties();
        result.fontSize = obj[JSONCharacterFormattingProperty.Size];
        result.fontBold = !!obj[JSONCharacterFormattingProperty.Bold];
        result.fontItalic = !!obj[JSONCharacterFormattingProperty.Italic];
        result.fontStrikeoutType = obj[JSONCharacterFormattingProperty.StrikeoutType];
        result.fontUnderlineType = obj[JSONCharacterFormattingProperty.UnderlineType];
        result.allCaps = !!obj[JSONCharacterFormattingProperty.AllCaps];
        result.smallCaps = !!obj[JSONCharacterFormattingProperty.SmallCaps];
        result.strikeoutWordsOnly = !!obj[JSONCharacterFormattingProperty.StrikeoutWordsOnly];
        result.underlineWordsOnly = !!obj[JSONCharacterFormattingProperty.UnderlineWordsOnly];
        result.script = obj[JSONCharacterFormattingProperty.Script];
        result.hidden = !!obj[JSONCharacterFormattingProperty.Hidden];
        result.noProof = !!obj[JSONCharacterFormattingProperty.NoProof];
        result.setUseValueFull(obj[JSONCharacterFormattingProperty.UseValue]);
        result.langInfo = JSONLangInfoConverter.convertFromJSON(obj[JSONCharacterFormattingProperty.LangInfo]);
        result.fontInfo = fontCache instanceof FontInfoCache ?
            fontCache.getItemByJsonKey(obj[JSONCharacterFormattingProperty.FontInfoIndex]) :
            fontCache(obj[JSONCharacterFormattingProperty.FontInfoIndex]);
        result.textColor = colorModelInfoCache.getItemByJsonKey(obj[JSONCharacterFormattingProperty.TextColorIndex]);
        result.shadingInfo = shadingInfoCache.getItemByJsonKey(obj[JSONCharacterFormattingProperty.ShadingInfoIndex]);
        result.highlightColor = colorModelInfoCache.getItemByJsonKey(obj[JSONCharacterFormattingProperty.HighlightColorIndex]);
        result.underlineColor = colorModelInfoCache.getItemByJsonKey(obj[JSONCharacterFormattingProperty.UnderlineColorIndex]);
        result.strikeoutColor = colorModelInfoCache.getItemByJsonKey(obj[JSONCharacterFormattingProperty.StrikeoutColorIndex]);
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONCharacterFormattingProperty.FontName] = source.fontInfo.name;
        result[JSONCharacterFormattingProperty.Size] = source.fontSize;
        result[JSONCharacterFormattingProperty.Bold] = boolToInt(source.fontBold);
        result[JSONCharacterFormattingProperty.Italic] = boolToInt(source.fontItalic);
        result[JSONCharacterFormattingProperty.StrikeoutType] = source.fontStrikeoutType;
        result[JSONCharacterFormattingProperty.UnderlineType] = source.fontUnderlineType;
        result[JSONCharacterFormattingProperty.AllCaps] = boolToInt(source.allCaps);
        result[JSONCharacterFormattingProperty.SmallCaps] = boolToInt(source.smallCaps);
        result[JSONCharacterFormattingProperty.StrikeoutWordsOnly] = boolToInt(source.strikeoutWordsOnly);
        result[JSONCharacterFormattingProperty.UnderlineWordsOnly] = boolToInt(source.underlineWordsOnly);
        result[JSONCharacterFormattingProperty.TextColor] = JSONColorModelInfoConverter.convertToJSON(source.textColor);
        result[JSONCharacterFormattingProperty.ShadingInfo] = JSONShadingInfoConverter.convertToJSON(source.shadingInfo);
        result[JSONCharacterFormattingProperty.HighlightColor] = JSONColorModelInfoConverter.convertToJSON(source.highlightColor);
        result[JSONCharacterFormattingProperty.UnderlineColor] = JSONColorModelInfoConverter.convertToJSON(source.underlineColor);
        result[JSONCharacterFormattingProperty.StrikeoutColor] = JSONColorModelInfoConverter.convertToJSON(source.strikeoutColor);
        result[JSONCharacterFormattingProperty.Script] = source.script;
        result[JSONCharacterFormattingProperty.Hidden] = boolToInt(source.hidden);
        result[JSONCharacterFormattingProperty.NoProof] = boolToInt(source.noProof);
        result[JSONCharacterFormattingProperty.UseValue] = source.getUseValueFull();
        result[JSONCharacterFormattingProperty.LangInfo] = JSONLangInfoConverter.convertToJSON(source.langInfo);
        return result;
    }
}
export class JSONLangInfoConverter {
    static convertFromJSON(obj) {
        const result = new LangInfo();
        result.bidi = obj[JSONLangInfoProperty.Bidi] || "";
        result.eastAsia = obj[JSONLangInfoProperty.EastAsia] || "";
        result.latin = obj[JSONLangInfoProperty.Latin] || "";
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONLangInfoProperty.Bidi] = source ? source.bidi : "";
        result[JSONLangInfoProperty.EastAsia] = source ? source.eastAsia : "";
        result[JSONLangInfoProperty.Latin] = source ? source.latin : "";
        return result;
    }
}
