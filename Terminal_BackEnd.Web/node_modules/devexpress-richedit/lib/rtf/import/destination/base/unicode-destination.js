import { DestinationType } from '../utils/destination-type';
import { DestinationBase } from './destination';
export class UnicodeDestination extends DestinationBase {
    constructor(importer, lastDestination) {
        super(importer);
        this.lastDestination = lastDestination;
    }
    get destinationType() { return DestinationType.UnicodeDestination; }
    get controlCharHT() { return null; }
    createClone() {
        return new UnicodeDestination(this.importer, this.lastDestination);
    }
    static onUdKeyword(importer, _parameterValue, _hasParameter) {
        const currentDestination = importer.destination;
        importer.destination = currentDestination.lastDestination;
    }
}
