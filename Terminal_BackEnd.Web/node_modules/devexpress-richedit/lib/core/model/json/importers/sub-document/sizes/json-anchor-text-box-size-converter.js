import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { AnchorTextBoxSize } from '../../../../floating-objects/sizes';
import { JSONAnchorInlineBaseSize, JSONAnchorTextBoxSize } from '../../../enums/json-floating-enums';
import { SizeExporter } from '../../json-importer';
export class JSONAnchorTextBoxSizeConverterConverter {
    static convertFromJSON(obj) {
        const relativeSizeType = SizeExporter.convertFromJSON(obj[JSONAnchorTextBoxSize.RelativeSizeType]);
        const useAbsoluteSize = SizeExporter.convertFromJSON(obj[JSONAnchorTextBoxSize.UseAbsoluteSize]);
        return new AnchorTextBoxSize(!!obj[JSONAnchorInlineBaseSize.LockAspectRatio], obj[JSONAnchorInlineBaseSize.Rotation], SizeExporter.convertFromJSON(obj[JSONAnchorTextBoxSize.AbsoluteSize]), SizeExporter.convertFromJSON(obj[JSONAnchorTextBoxSize.RelativeSize]), relativeSizeType.width, relativeSizeType.height, !!useAbsoluteSize.width, !!useAbsoluteSize.height);
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONAnchorInlineBaseSize.LockAspectRatio] = boolToInt(source.lockAspectRatio);
        result[JSONAnchorInlineBaseSize.Rotation] = source.rotation;
        result[JSONAnchorTextBoxSize.AbsoluteSize] = SizeExporter.convertToJSON(source.absoluteSize);
        result[JSONAnchorTextBoxSize.RelativeSize] = SizeExporter.convertToJSON(source.relativeSize);
        result[JSONAnchorTextBoxSize.RelativeSizeType] = SizeExporter.convertToJSONSeparately(source.relativeWidthType, source.relativeHeightType);
        result[JSONAnchorTextBoxSize.UseAbsoluteSize] = SizeExporter.convertToJSONSeparately(boolToInt(source.useAbsoluteWidth()), boolToInt(source.useAbsoluteHeight()));
        return result;
    }
}
