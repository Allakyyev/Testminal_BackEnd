import { SkipDestination } from '../base/skip-destination';
import { DestinationType } from '../utils/destination-type';
export class SkipNestedTableDestination extends SkipDestination {
    get destinationType() { return DestinationType.SkipNestedTableDestination; }
    static onParKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = importer.createDefaultDestination();
    }
    createClone() {
        return new SkipNestedTableDestination(this.importer);
    }
}
