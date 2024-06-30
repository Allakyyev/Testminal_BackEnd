import { DestinationType } from '../utils/destination-type';
import { StringValueDestination } from './string-value-destination';
export class TextAfterDestination extends StringValueDestination {
    get destinationType() { return DestinationType.TextAfterDestination; }
    createEmptyClone() {
        return new TextAfterDestination(this.importer);
    }
}
