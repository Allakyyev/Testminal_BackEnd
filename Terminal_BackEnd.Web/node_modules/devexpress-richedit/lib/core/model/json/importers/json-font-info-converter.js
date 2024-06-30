import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { FontInfo } from '../../fonts/font-info';
import { JSONFontInfoProperty } from '../enums/json-character-enums';
export class JSONFontInfoConverter {
    static convertFromJSON(obj, result = new FontInfo()) {
        result.name = obj[JSONFontInfoProperty.Name];
        result.scriptMultiplier = obj[JSONFontInfoProperty.ScriptMultiplier];
        result.cssString = obj[JSONFontInfoProperty.CssString];
        result.canBeSet = !!obj[JSONFontInfoProperty.CanBeSet];
        result.subScriptOffset = obj[JSONFontInfoProperty.SubScriptOffset];
        result.isLoad = true;
        result.reset();
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONFontInfoProperty.Name] = source.name;
        result[JSONFontInfoProperty.ScriptMultiplier] = source.scriptMultiplier;
        result[JSONFontInfoProperty.CssString] = source.cssString;
        result[JSONFontInfoProperty.CanBeSet] = boolToInt(source.canBeSet);
        result[JSONFontInfoProperty.SubScriptOffset] = source.subScriptOffset;
        return result;
    }
}
