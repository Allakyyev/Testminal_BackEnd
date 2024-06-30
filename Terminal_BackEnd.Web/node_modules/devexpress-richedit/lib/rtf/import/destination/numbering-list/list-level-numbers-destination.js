import { StringValueDestination } from '../base/string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class ListLevelNumbersDestination extends StringValueDestination {
    get destinationType() { return DestinationType.ListLevelNumbersDestination; }
    createEmptyClone() {
        return new ListLevelNumbersDestination(this.importer);
    }
}
