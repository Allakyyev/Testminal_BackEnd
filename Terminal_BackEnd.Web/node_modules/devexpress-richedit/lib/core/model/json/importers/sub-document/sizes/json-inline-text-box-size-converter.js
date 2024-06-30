import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { InlineTextBoxSize } from '../../../../floating-objects/sizes';
import { JSONAnchorInlineBaseSize, JSONInlineTextBoxSize } from '../../../enums/json-floating-enums';
import { SizeExporter } from '../../json-importer';
export class JSONInlineTextBoxSizeConverterConverter {
    static convertFromJSON(obj) {
        return new InlineTextBoxSize(!!obj[JSONAnchorInlineBaseSize.LockAspectRatio], obj[JSONAnchorInlineBaseSize.Rotation], SizeExporter.convertFromJSON(obj[JSONInlineTextBoxSize.AbsoluteSize]));
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONAnchorInlineBaseSize.LockAspectRatio] = boolToInt(source.lockAspectRatio);
        result[JSONAnchorInlineBaseSize.Rotation] = source.rotation;
        result[JSONInlineTextBoxSize.AbsoluteSize] = SizeExporter.convertToJSON(source.absoluteSize);
        return result;
    }
}
