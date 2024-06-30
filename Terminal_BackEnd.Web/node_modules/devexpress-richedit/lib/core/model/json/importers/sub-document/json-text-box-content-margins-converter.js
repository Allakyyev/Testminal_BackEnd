import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { JSONTextBoxContentMargins } from '../../enums/json-floating-enums';
export class JSONTextBoxContentMarginsConverter {
    static convertFromJSON(obj) {
        return new Margins(obj[JSONTextBoxContentMargins.Left], obj[JSONTextBoxContentMargins.Right], obj[JSONTextBoxContentMargins.Top], obj[JSONTextBoxContentMargins.Bottom]);
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONTextBoxContentMargins.Left] = source.left;
        result[JSONTextBoxContentMargins.Right] = source.right;
        result[JSONTextBoxContentMargins.Top] = source.top;
        result[JSONTextBoxContentMargins.Bottom] = source.bottom;
        return result;
    }
}
