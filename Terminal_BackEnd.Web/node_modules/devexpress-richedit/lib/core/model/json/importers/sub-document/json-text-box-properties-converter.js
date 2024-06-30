import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { TextBoxProperties } from '../../../floating-objects/text-box-properties';
import { JSONTextBoxProperties } from '../../enums/json-floating-enums';
export class JSONTextBoxPropertiesConverter {
    static convertFromJSON(obj) {
        const result = new TextBoxProperties();
        result.resizeShapeToFitText = !!obj[JSONTextBoxProperties.ResizeShapeToFitText];
        result.upright = !!obj[JSONTextBoxProperties.Upright];
        result.verticalAlignment = obj[JSONTextBoxProperties.VerticalAlignment];
        result.wrapText = !!obj[JSONTextBoxProperties.WrapText];
        result.leftMargin = obj[JSONTextBoxProperties.LeftMargin];
        result.rightMargin = obj[JSONTextBoxProperties.RightMargin];
        result.topMargin = obj[JSONTextBoxProperties.TopMargin];
        result.bottomMargin = obj[JSONTextBoxProperties.BottomMargin];
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONTextBoxProperties.ResizeShapeToFitText] = boolToInt(source.resizeShapeToFitText);
        result[JSONTextBoxProperties.Upright] = boolToInt(source.upright);
        result[JSONTextBoxProperties.VerticalAlignment] = source.verticalAlignment;
        result[JSONTextBoxProperties.WrapText] = boolToInt(source.wrapText);
        result[JSONTextBoxProperties.LeftMargin] = source.leftMargin;
        result[JSONTextBoxProperties.RightMargin] = source.rightMargin;
        result[JSONTextBoxProperties.TopMargin] = source.topMargin;
        result[JSONTextBoxProperties.BottomMargin] = source.bottomMargin;
        return result;
    }
}
