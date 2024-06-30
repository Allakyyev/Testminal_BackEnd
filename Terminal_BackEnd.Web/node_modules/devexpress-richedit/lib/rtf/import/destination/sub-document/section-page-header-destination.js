import { DestinationType } from '../utils/destination-type';
import { SectionHeaderFooterDestinationBase } from './section-header-footer-destination-base';
export class SectionPageHeaderDestination extends SectionHeaderFooterDestinationBase {
    get destinationType() { return DestinationType.SectionPageHeaderDestination; }
    createClone() {
        return new SectionPageHeaderDestination(this.importer, this.section, this.subDocument);
    }
}
