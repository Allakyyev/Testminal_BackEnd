import { NonVisualDrawingObjectInfo } from '../../../manipulators/picture-manipulator/non-visual-drawing-object-info';
import { JSONNonVisualDrawingObjectProperties } from '../../enums/json-floating-enums';
export class JSONNonVisualPropertiesConverter {
    static convertFromJSON(obj) {
        const result = new NonVisualDrawingObjectInfo();
        if (obj) {
            result.id = obj[JSONNonVisualDrawingObjectProperties.Id];
            result.name = obj[JSONNonVisualDrawingObjectProperties.Name];
            result.title = obj[JSONNonVisualDrawingObjectProperties.Title];
            result.description = obj[JSONNonVisualDrawingObjectProperties.Description];
        }
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONNonVisualDrawingObjectProperties.Id] = source.id;
        result[JSONNonVisualDrawingObjectProperties.Name] = source.name;
        result[JSONNonVisualDrawingObjectProperties.Title] = source.title;
        result[JSONNonVisualDrawingObjectProperties.Description] = source.description;
        return result;
    }
}
