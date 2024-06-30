import { DestinationSubDocument } from '../sub-document/destination-sub-document';
import { DestinationType } from '../utils/destination-type';
export class ShapeTextDestination extends DestinationSubDocument {
    get destinationType() { return DestinationType.ShapeTextDestination; }
    createClone() {
        return new ShapeTextDestination(this.importer, this.subDocument);
    }
}
