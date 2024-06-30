import { ColorHSL } from '../../color/color-hsl';
import { ScRGBColor } from '../../color/sc-rgbcolor';
import { DrawingColor } from '../../drawing/drawing-color';
import { DrawingColorModelInfo } from '../../drawing/drawing-color-model-info';
import { JSONSColorHSLProperty, JSONSDrawingColorModelInfoProperty, JSONSDrawingColorProperty, JSONSScRGBColorProperty } from '../enums/json-general-enums';
export class JSONDrawingColorConverter {
    static convertFromJSON(obj) {
        const info = JSONDrawingColorModelInfoConverter.convertFromJSON(obj[JSONSDrawingColorProperty.Color]);
        return new DrawingColor(info);
    }
}
export class JSONDrawingColorModelInfoConverter {
    static convertFromJSON(obj) {
        const result = new DrawingColorModelInfo();
        result._rgb = obj[JSONSDrawingColorModelInfoProperty.Rgb];
        result._systemColor = obj[JSONSDrawingColorModelInfoProperty.System];
        result._schemeColor = obj[JSONSDrawingColorModelInfoProperty.Scheme];
        result._preset = obj[JSONSDrawingColorModelInfoProperty.Preset];
        result._hsl = JSONColorHSLConverter.convertFromJSON(obj[JSONSDrawingColorModelInfoProperty.Hsl]);
        result._scRgb = JSONScRGBColorConverter.convertFromJSON(obj[JSONSDrawingColorModelInfoProperty.ScRgb]);
        result._colorType = obj[JSONSDrawingColorModelInfoProperty.ColorType];
        return result;
    }
}
export class JSONColorHSLConverter {
    static convertFromJSON(obj) {
        const hue = obj[JSONSColorHSLProperty.Hue];
        const saturation = obj[JSONSColorHSLProperty.Saturation];
        const luminance = obj[JSONSColorHSLProperty.Luminance];
        return new ColorHSL(hue, saturation, luminance);
    }
}
export class JSONScRGBColorConverter {
    static convertFromJSON(obj) {
        const scR = obj[JSONSScRGBColorProperty.ScR];
        const scG = obj[JSONSScRGBColorProperty.ScG];
        const scB = obj[JSONSScRGBColorProperty.ScB];
        return new ScRGBColor(scR, scG, scB);
    }
}
