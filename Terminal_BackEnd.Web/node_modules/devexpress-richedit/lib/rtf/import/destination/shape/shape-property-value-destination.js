import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DestinationBase } from '../base/destination';
import { PictureDestination } from '../picture/picture-destination';
import { DestinationType } from '../utils/destination-type';
import { ShapePropertyHyperlinkDestination } from './shape-property-hyperlink-destination';
export class ShapePropertyValueDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.buffer = [];
    }
    get destinationType() { return DestinationType.ShapePropertyValueDestination; }
    get controlCharHT() { return null; }
    processCharCore(ch) {
        this.buffer.push(ch);
    }
    beforePopRtfState() {
        const stringValue = this.buffer.join("");
        if (StringUtils.isNullOrEmpty(stringValue))
            return;
        const numberValue = +stringValue;
        if (!isNaN(numberValue))
            this.value = numberValue;
        else
            this.value = stringValue;
    }
    nestedGroupFinished(nestedDestination) {
        if (nestedDestination instanceof PictureDestination)
            this.value = nestedDestination.getImageInfo();
        else if (nestedDestination instanceof ShapePropertyHyperlinkDestination)
            this.value = nestedDestination.hyperlinkInfo;
    }
    createClone() {
        const clone = new ShapePropertyValueDestination(this.importer);
        clone.buffer = this.buffer;
        return clone;
    }
}
