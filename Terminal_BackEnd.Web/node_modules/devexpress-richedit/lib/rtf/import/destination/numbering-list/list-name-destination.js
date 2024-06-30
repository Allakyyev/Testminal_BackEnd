import { StringValueDestination } from '../base/string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class ListNameDestination extends StringValueDestination {
    get destinationType() { return DestinationType.ListNameDestination; }
    createEmptyClone() {
        return new ListNameDestination(this.importer);
    }
}
