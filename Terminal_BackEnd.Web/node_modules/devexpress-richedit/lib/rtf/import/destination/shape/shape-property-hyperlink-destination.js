import { HyperlinkInfo } from '../../../../core/model/fields/field';
import { DestinationBase } from '../base/destination';
import { DestinationType } from '../utils/destination-type';
import { HyperlinkLocationValueDestination } from './hyperlink-location-value-destination';
import { HyperlinkSourceValueDestination } from './hyperlink-source-value-destination';
export class ShapePropertyHyperlinkDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.hyperlinkInfo = new HyperlinkInfo("", "", "", false);
    }
    get destinationType() { return DestinationType.ShapePropertyHyperlinkDestination; }
    get controlCharHT() { return null; }
    nestedGroupFinished(nestedDestination) {
        if (nestedDestination instanceof HyperlinkLocationValueDestination)
            this.hyperlinkInfo.anchor = nestedDestination.value;
        else if (nestedDestination instanceof HyperlinkSourceValueDestination)
            this.hyperlinkInfo.uri = nestedDestination.value;
    }
    createClone() {
        const clone = new ShapePropertyHyperlinkDestination(this.importer);
        clone.hyperlinkInfo = this.hyperlinkInfo;
        return clone;
    }
}
