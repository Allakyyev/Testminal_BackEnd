import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
export class TxtExporter {
    constructor(modelManipulator, options) {
        this.modelManipulator = modelManipulator;
        this.options = options;
    }
    get model() { return this.modelManipulator.model; }
    exportToBlob(callback) {
        this.getBlob(callback);
    }
    exportToBase64(callback) {
        this.getBlob(blob => Base64Utils.fromBlobAsDataUrl(blob, base64 => {
            const splitted = base64.split(',');
            callback(splitted.length === 2 ? splitted[1] : '');
        }));
    }
    getBlob(callback) {
        this.modelManipulator.picture.loader.ensureAllPicturesLoaded(this.options.ensurePictureLoadedTimeout, (_loaded) => {
            let text = '';
            this.model.mainSubDocument.paragraphs.forEach((p, index) => {
                if (index > 0)
                    text += '\r\n';
                text += this.model.mainSubDocument.getSimpleText(new FixedInterval(p.startLogPosition.value, p.length));
            });
            callback(new Blob([text], { type: 'text/plain' }));
        });
    }
}
