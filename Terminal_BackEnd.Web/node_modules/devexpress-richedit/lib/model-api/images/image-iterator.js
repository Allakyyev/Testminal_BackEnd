import { ModelIterator } from '../../core/model/model-iterator';
import { getImageApiFromRun } from './images';
export class ImageIteratorApi {
    constructor(processor, subDocument, pos) {
        this._processor = processor;
        this._subDocument = subDocument;
        this._iterator = new ModelIterator(subDocument, true);
        this._iterator.setPosition(pos);
    }
    get image() {
        return this._currImage;
    }
    next() {
        do {
            this._currImage = getImageApiFromRun(this._processor, this._subDocument, this._iterator);
            if (this._currImage) {
                this._iterator.moveToNextRun();
                return true;
            }
        } while (this._iterator.moveToNextRun());
        return false;
    }
}
