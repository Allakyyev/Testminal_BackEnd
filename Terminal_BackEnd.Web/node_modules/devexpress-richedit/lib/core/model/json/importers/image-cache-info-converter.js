import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CacheImageInfo } from '../../caches/images';
import { JSONImageCacheInfo } from '../enums/json-floating-enums';
import { SizeExporter } from './json-importer';
export class JSONCacheImageInfoConverter {
    static convertFromJSON(obj) {
        const actualId = obj[JSONImageCacheInfo.ActualId];
        return new CacheImageInfo(obj[JSONImageCacheInfo.Base64], actualId, obj[JSONImageCacheInfo.TmpId], obj[JSONImageCacheInfo.Url], undefined, undefined, SizeExporter.convertFromJSON(obj[JSONImageCacheInfo.Size]), actualId !== undefined && actualId !== null);
    }
    static convertToJSON(source, sendBase64) {
        return {
            [JSONImageCacheInfo.Base64]: sendBase64 ? source.base64 : undefined,
            [JSONImageCacheInfo.ActualId]: source.actualId,
            [JSONImageCacheInfo.TmpId]: source.tmpId,
            [JSONImageCacheInfo.Url]: source.imageUrl,
            [JSONImageCacheInfo.Size]: SizeExporter.convertToJSON(source.size),
        };
    }
    static translateImageCorrespondence(obj, imageCorrespondence) {
        return ListUtils.map(obj, rawJsonCacheInfo => {
            const info = JSONCacheImageInfoConverter.convertFromJSON(rawJsonCacheInfo);
            info.actualId = imageCorrespondence[info.actualId];
            return JSONCacheImageInfoConverter.convertToJSON(info, true);
        });
    }
    static importImageCache(imageCache, imageCorrespondence, obj) {
        if (obj) {
            const convertedImages = imageCorrespondence ?
                JSONCacheImageInfoConverter.translateImageCorrespondence(obj, imageCorrespondence) :
                obj;
            for (var jsonImage of convertedImages)
                imageCache.registerPictureData(JSONCacheImageInfoConverter.convertFromJSON(jsonImage));
        }
    }
}
