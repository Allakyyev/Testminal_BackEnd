import { Shape } from '../../shapes/shape';
import { JSONShapeProperty } from '../enums/json-floating-enums';
export class JSONShapeConverter {
    static convertFromJSON(obj) {
        const result = new Shape();
        result.fillColor = obj[JSONShapeProperty.FillColor];
        result.outlineColor = obj[JSONShapeProperty.OutlineColor];
        result.outlineWidth = obj[JSONShapeProperty.OutlineWidth];
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONShapeProperty.FillColor] = source.fillColor;
        result[JSONShapeProperty.OutlineColor] = source.outlineColor;
        result[JSONShapeProperty.OutlineWidth] = source.outlineWidth;
        return result;
    }
}
