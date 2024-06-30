import { DestinationType } from '../utils/destination-type';
import { HyperlinkPropertyValueDestination } from './hyperlink-property-value-destination';
export class HyperlinkSourceValueDestination extends HyperlinkPropertyValueDestination {
    get destinationType() { return DestinationType.HyperlinkSourceValueDestination; }
    createEmptyClone() {
        return new HyperlinkSourceValueDestination(this.importer);
    }
}
