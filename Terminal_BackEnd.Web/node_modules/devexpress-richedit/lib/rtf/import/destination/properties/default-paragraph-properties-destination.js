import { DestinationSubDocument } from '../sub-document/destination-sub-document';
import { DestinationType } from '../utils/destination-type';
export class DefaultParagraphPropertiesDestination extends DestinationSubDocument {
    get destinationType() { return DestinationType.DefaultParagraphPropertiesDestination; }
    get controlCharHT() { return null; }
    constructor(importer) {
        super(importer, importer.subDocument);
    }
    get canAppendText() { return false; }
    beforePopRtfState() {
    }
    createClone() {
        return new DefaultParagraphPropertiesDestination(this.importer);
    }
    processCharCore(_ch) {
    }
    finalizeSubDocumentCreation() {
    }
}
