import { DestinationType } from '../utils/destination-type';
import { StringValueDestination } from './string-value-destination';
export class TextBeforeDestination extends StringValueDestination {
    get destinationType() { return DestinationType.TextBeforeDestination; }
    createEmptyClone() {
        return new TextBeforeDestination(this.importer);
    }
}
