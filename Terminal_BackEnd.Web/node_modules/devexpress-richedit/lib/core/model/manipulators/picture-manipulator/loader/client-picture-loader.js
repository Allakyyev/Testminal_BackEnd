import { Errors } from '@devexpress/utils/lib/errors';
import { PictureLoader } from './picture-loader';
export class ClientPictureLoader extends PictureLoader {
    loadInner(data) {
        if (data.file)
            this.loadPictureByFile(data, () => this.finalizeLoading(data, data));
        else if (data.imageUrl)
            this.loadPictureByUrl(data, () => this.finalizeLoading(data, data));
        else if (data.base64)
            this.loadPictureByBase64(data, () => this.finalizeLoading(data, data));
        return data;
    }
    addLoadListener(cacheInfo, callback) {
        this.sizeUpdater.addLoadListener(cacheInfo, callback);
    }
    applyRequest(_jsonObj) {
        throw new Error(Errors.InternalException);
    }
}
