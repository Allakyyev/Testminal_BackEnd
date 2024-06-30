import { DestinationType } from '../utils/destination-type';
import { SectionHeaderFooterDestinationBase } from './section-header-footer-destination-base';
export class SectionPageFooterDestination extends SectionHeaderFooterDestinationBase {
    get destinationType() { return DestinationType.SectionPageFooterDestination; }
    createClone() {
        return new SectionPageFooterDestination(this.importer, this.section, this.subDocument);
    }
}
