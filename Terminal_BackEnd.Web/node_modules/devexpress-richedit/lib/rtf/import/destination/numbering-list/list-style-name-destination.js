import { StringValueDestination } from '../base/string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class ListStyleNameDestination extends StringValueDestination {
    get destinationType() { return DestinationType.ListStyleNameDestination; }
    createEmptyClone() {
        return new ListStyleNameDestination(this.importer);
    }
}
