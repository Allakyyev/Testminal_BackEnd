import { DestinationType } from '../utils/destination-type';
import { HyperlinkPropertyValueDestination } from './hyperlink-property-value-destination';
export class HyperlinkLocationValueDestination extends HyperlinkPropertyValueDestination {
    get destinationType() { return DestinationType.HyperlinkLocationValueDestination; }
    createEmptyClone() {
        return new HyperlinkLocationValueDestination(this.importer);
    }
}
