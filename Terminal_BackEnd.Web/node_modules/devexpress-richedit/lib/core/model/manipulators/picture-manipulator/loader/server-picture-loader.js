import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { LoadPicturesInfoSubDocumentChange } from '../../../changes/sub-document/picture/load-pictures-info';
import { JSONCacheImageInfoConverter } from '../../../json/importers/image-cache-info-converter';
import { PictureLoader } from './picture-loader';
export class ServerPictureLoader extends PictureLoader {
    loadInner(data) {
        if (data.imageUrl && (data.imageUrl.match(/^file\:\/\//gi) || data.imageUrl.match(/^blob\:/gi)))
            this.resetCacheImageInfoToDefault(data);
        if (data.file)
            this.loadPictureByFile(data, data => this.notifyLoad(data));
        else if (data.imageUrl || data.base64)
            this.notifyLoad(data);
        return data;
    }
    notifyLoad(data) {
        this.modelManipulator.notifyModelChanged(new LoadPicturesInfoSubDocumentChange(this.modelManipulator.model.mainSubDocument.id, data));
    }
    applyRequest(jsonObjs) {
        NumberMapUtils.forEach(jsonObjs, jsonImgInfo => this.finalizeLoading(JSONCacheImageInfoConverter.convertFromJSON(jsonImgInfo)));
    }
    resetCacheImageInfoToDefault(data) {
        data.imageUrl = undefined;
        data.base64 = this.imageCache.emptyImage.base64;
    }
}
