import { DestinationType } from '../utils/destination-type';
import { DestinationSubDocument } from './destination-sub-document';
export class SectionHeaderFooterDestinationBase extends DestinationSubDocument {
    constructor(importer, section, subDocument) {
        super(importer, subDocument);
        this.section = section;
    }
    get destinationType() { return DestinationType.SectionHeaderFooterDestinationBase; }
}
