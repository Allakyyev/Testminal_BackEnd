import { StringValueDestination } from '../base/string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class ShapePropertyNameDestination extends StringValueDestination {
    get destinationType() { return DestinationType.ShapePropertyNameDestination; }
    createEmptyClone() {
        return new ShapePropertyNameDestination(this.importer);
    }
}
