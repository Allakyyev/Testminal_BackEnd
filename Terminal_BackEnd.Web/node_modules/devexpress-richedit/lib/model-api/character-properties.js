import { ApiParametersChecker } from '../api-utils/api-utils/parameter-checker';
import { CharacterProperties } from '../core/model/character/character-properties';
import { StrikeoutType, UnderlineType } from '../core/model/character/enums';
import { ColorModelInfo } from '../core/model/color/color-model-info';
import { ShadingInfo } from '../core/model/shadings/shading-info';
import { ApiUtils } from './api-utils/api-utils';
import { ModelParametersChecker } from './api-utils/model-parameter-checker';
export var CharacterPropertiesScriptApi;
(function (CharacterPropertiesScriptApi) {
    CharacterPropertiesScriptApi[CharacterPropertiesScriptApi["Normal"] = 0] = "Normal";
    CharacterPropertiesScriptApi[CharacterPropertiesScriptApi["Subscript"] = 1] = "Subscript";
    CharacterPropertiesScriptApi[CharacterPropertiesScriptApi["Superscript"] = 2] = "Superscript";
})(CharacterPropertiesScriptApi || (CharacterPropertiesScriptApi = {}));
export class CharacterPropertiesApi {
}
export function convertToCharacterPropertiesApi(properties, colorProvider) {
    const value = new CharacterPropertiesApi();
    value.allCaps = properties.allCaps;
    value.smallCaps = properties.smallCaps;
    value.foreColor = properties.textColor === undefined ? undefined : ApiUtils.internalColorToApiColor(properties.textColor.toRgb(colorProvider));
    value.fontName = properties.fontInfo ? properties.fontInfo.name : undefined;
    value.size = properties.fontSize;
    value.strikeout = properties.fontStrikeoutType === undefined ?
        undefined :
        properties.fontStrikeoutType !== StrikeoutType.None;
    value.bold = properties.fontBold;
    value.italic = properties.fontItalic;
    value.underline = properties.fontUnderlineType === undefined ?
        undefined :
        properties.fontUnderlineType !== UnderlineType.None;
    value.underlineColor = properties.underlineColor === undefined ? undefined : ApiUtils.internalColorToApiColor(properties.underlineColor.toRgb(colorProvider));
    value.hidden = properties.hidden;
    value.script = properties.script;
    value.underlineWordsOnly = properties.underlineWordsOnly;
    value.backColor = properties.shadingInfo === undefined ? undefined : ApiUtils.internalColorToApiColor(properties.shadingInfo.getActualColor(colorProvider));
    value.highlightColor = properties.highlightColor !== undefined ? ApiUtils.internalColorToApiColor(properties.highlightColor.toRgb(colorProvider)) : undefined;
    return value;
}
export function convertFromCharacterPropertiesApi(properties, fontInfoCache, parameterIndex, setRestAsUndefined, propsCoreTemplate) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    properties = ApiParametersChecker.check(properties, parameterIndex, false, [
        ApiParametersChecker.objectDescriptor('properties', 'CharacterProperties', (val) => val)
    ]);
    if (!propsCoreTemplate)
        propsCoreTemplate = new CharacterProperties();
    propsCoreTemplate.allCaps = (_a = ApiParametersChecker.check(properties.allCaps, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.allCaps', (val) => val)
    ])) !== null && _a !== void 0 ? _a : propsCoreTemplate.allCaps;
    propsCoreTemplate.smallCaps = (_b = ApiParametersChecker.check(properties.smallCaps, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.smallCaps', (val) => val)
    ])) !== null && _b !== void 0 ? _b : propsCoreTemplate.smallCaps;
    propsCoreTemplate.fontBold = (_c = ApiParametersChecker.check(properties.bold, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.bold', (val) => val)
    ])) !== null && _c !== void 0 ? _c : propsCoreTemplate.fontBold;
    const textColor = ApiParametersChecker.check(properties.foreColor, parameterIndex, true, ModelParametersChecker.colorDescriptors('properties.foreColor'));
    propsCoreTemplate.textColor = textColor === undefined ? propsCoreTemplate.textColor : ColorModelInfo.makeByColor(textColor);
    propsCoreTemplate.fontItalic = (_d = ApiParametersChecker.check(properties.italic, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.italic', (val) => val)
    ])) !== null && _d !== void 0 ? _d : propsCoreTemplate.fontItalic;
    propsCoreTemplate.fontInfo = (_e = ApiParametersChecker.check(properties.fontName, parameterIndex, true, [
        ApiParametersChecker.stringDescriptor('properties.fontName', (val) => {
            const fontInfo = fontInfoCache.getItemByName(val);
            if (!fontInfo)
                throw Error('Unknown font name');
            return fontInfo;
        }, false)
    ])) !== null && _e !== void 0 ? _e : propsCoreTemplate.fontInfo;
    propsCoreTemplate.fontSize = (_f = ApiParametersChecker.check(properties.size, parameterIndex, true, [
        ApiParametersChecker.numberDescriptor('properties.size', (val) => val, 0, 601)
    ])) !== null && _f !== void 0 ? _f : propsCoreTemplate.fontSize;
    propsCoreTemplate.hidden = (_g = ApiParametersChecker.check(properties.hidden, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.hidden', (val) => val)
    ])) !== null && _g !== void 0 ? _g : propsCoreTemplate.hidden;
    const shadigInfoColor = ApiParametersChecker.check(properties.backColor, parameterIndex, true, ModelParametersChecker.colorDescriptors('properties.backColor'));
    propsCoreTemplate.shadingInfo = shadigInfoColor === undefined ? propsCoreTemplate.shadingInfo :
        ShadingInfo.createByColor(ColorModelInfo.makeByColor(shadigInfoColor));
    propsCoreTemplate.script = (_h = ApiParametersChecker.check(properties.script, parameterIndex, true, [
        ApiParametersChecker.enumDescriptor('properties.script', (val) => val, CharacterPropertiesScriptApi, 'CharacterPropertiesScript')
    ])) !== null && _h !== void 0 ? _h : propsCoreTemplate.script;
    const underlineColor = ApiParametersChecker.check(properties.underlineColor, parameterIndex, true, ModelParametersChecker.colorDescriptors('properties.underlineColor'));
    propsCoreTemplate.underlineColor = underlineColor === undefined ? propsCoreTemplate.underlineColor : ColorModelInfo.makeByColor(underlineColor);
    propsCoreTemplate.underlineWordsOnly = (_j = ApiParametersChecker.check(properties.underlineWordsOnly, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.underlineWordsOnly', (val) => val)
    ])) !== null && _j !== void 0 ? _j : propsCoreTemplate.underlineWordsOnly;
    const strikeout = ApiParametersChecker.check(properties.strikeout, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.strikeout', (val) => val)
    ]);
    propsCoreTemplate.fontStrikeoutType = strikeout === true ? StrikeoutType.Single : (strikeout === false ? StrikeoutType.None : propsCoreTemplate.fontStrikeoutType);
    const underline = ApiParametersChecker.check(properties.underline, parameterIndex, true, [
        ApiParametersChecker.booleanDescriptor('properties.underline', (val) => val)
    ]);
    propsCoreTemplate.fontUnderlineType = underline === true ? UnderlineType.Single : (underline === false ? UnderlineType.None : propsCoreTemplate.fontUnderlineType);
    const highlightColor = ApiParametersChecker.check(properties.highlightColor, parameterIndex, true, ModelParametersChecker.colorDescriptors('properties.highlightColor'));
    propsCoreTemplate.highlightColor = highlightColor === undefined ? propsCoreTemplate.highlightColor : ColorModelInfo.makeByColor(highlightColor);
    if (setRestAsUndefined) {
        propsCoreTemplate.langInfo = undefined;
        propsCoreTemplate.strikeoutColor = undefined;
        propsCoreTemplate.noProof = undefined;
        propsCoreTemplate.compositeFontInfo = undefined;
    }
    return propsCoreTemplate;
}
