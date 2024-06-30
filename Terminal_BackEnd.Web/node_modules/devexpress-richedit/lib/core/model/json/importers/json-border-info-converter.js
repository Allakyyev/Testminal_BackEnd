import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { BorderInfo } from '../../borders/border-info';
import { JSONBorderBaseProperty } from '../enums/json-general-enums';
import { JSONColorModelInfoConverter } from './json-color-model-info-converter';
export class JSONBorderInfoConverter {
    static convertFromJSON(obj, colorModelInfoCache) {
        const result = new BorderInfo();
        result.style = obj[JSONBorderBaseProperty.Style];
        result.color = colorModelInfoCache.getItemByJsonKey(obj[JSONBorderBaseProperty.ColorIndex]);
        if (!result.color)
            result.color = JSONColorModelInfoConverter.convertFromJSON(obj[JSONBorderBaseProperty.Color]);
        result.width = obj[JSONBorderBaseProperty.Width];
        result.offset = obj[JSONBorderBaseProperty.Offset];
        result.frame = !!obj[JSONBorderBaseProperty.Frame];
        result.shadow = !!obj[JSONBorderBaseProperty.Shadow];
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONBorderBaseProperty.Style] = source.style;
        result[JSONBorderBaseProperty.Color] = JSONColorModelInfoConverter.convertToJSON(source.color);
        result[JSONBorderBaseProperty.Width] = source.width;
        result[JSONBorderBaseProperty.Offset] = source.offset;
        result[JSONBorderBaseProperty.Frame] = boolToInt(source.frame);
        result[JSONBorderBaseProperty.Shadow] = boolToInt(source.shadow);
        return result;
    }
}
