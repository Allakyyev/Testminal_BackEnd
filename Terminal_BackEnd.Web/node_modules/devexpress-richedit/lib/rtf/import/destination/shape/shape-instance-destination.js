import { DestinationType } from '../utils/destination-type';
import { ShapePropertiesDestinationBase } from './shape-properties-destination-base';
export class ShapeInstanceDestination extends ShapePropertiesDestinationBase {
    get destinationType() { return DestinationType.ShapeInstanceDestination; }
    createClone() {
        return new ShapeInstanceDestination(this.importer, this.shapeProperties);
    }
    nestedGroupFinished(_nestedDestination) {
    }
}
