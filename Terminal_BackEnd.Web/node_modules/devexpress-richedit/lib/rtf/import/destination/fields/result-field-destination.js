import { DestinationType } from '../utils/destination-type';
import { FieldSubDestination } from './field-sub-destination';
export class ResultFieldDestination extends FieldSubDestination {
    get destinationType() { return DestinationType.ResultFieldDestination; }
    constructor(importer) {
        super(importer);
    }
    createInstance() {
        return new ResultFieldDestination(this.importer);
    }
}
