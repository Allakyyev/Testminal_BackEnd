import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { PictureSize } from '../../../../floating-objects/sizes';
import { JSONAnchorInlineBaseSize, JSONPictureSize } from '../../../enums/json-floating-enums';
import { SizeExporter } from '../../json-importer';
export class JSONInlinePictureSizeConverterConverter {
    static convertFromJSON(obj, cacheInfo) {
        return new PictureSize(!!obj[JSONAnchorInlineBaseSize.LockAspectRatio], obj[JSONAnchorInlineBaseSize.Rotation], cacheInfo, SizeExporter.convertFromJSON(obj[JSONPictureSize.Scale]));
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONAnchorInlineBaseSize.LockAspectRatio] = boolToInt(source.lockAspectRatio);
        result[JSONAnchorInlineBaseSize.Rotation] = source.rotation;
        result[JSONPictureSize.Scale] = SizeExporter.convertToJSON(source.scale);
        return result;
    }
}
