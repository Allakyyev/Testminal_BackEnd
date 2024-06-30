import { ShadingInfo } from '../../shadings/shading-info';
import { JSONShadingInfoProperty } from '../enums/json-general-enums';
import { JSONColorModelInfoConverter } from './json-color-model-info-converter';
export class JSONShadingInfoConverter {
    static convertFromJSON(obj, cache) {
        let backColor = cache.getItemByJsonKey(obj[JSONShadingInfoProperty.BackColorIndex]);
        if (!backColor)
            backColor = JSONColorModelInfoConverter.convertFromJSON(obj[JSONShadingInfoProperty.BackColor]);
        let foreColor = cache.getItemByJsonKey(obj[JSONShadingInfoProperty.ForeColorIndex]);
        if (!foreColor)
            foreColor = JSONColorModelInfoConverter.convertFromJSON(obj[JSONShadingInfoProperty.ForeColor]);
        return new ShadingInfo(obj[JSONShadingInfoProperty.ShadingPattern], backColor, foreColor);
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONShadingInfoProperty.ShadingPattern] = source.shadingPattern;
        result[JSONShadingInfoProperty.BackColor] = JSONColorModelInfoConverter.convertToJSON(source.backColor);
        result[JSONShadingInfoProperty.ForeColor] = JSONColorModelInfoConverter.convertToJSON(source.foreColor);
        return result;
    }
}
