import { DefaultDestination } from '../sub-document/default-destination';
import { DestinationType } from '../utils/destination-type';
export class FieldSubDestination extends DefaultDestination {
    constructor(importer) {
        super(importer, importer.subDocument);
        this.nestedGroupLevel = 1;
    }
    get destinationType() { return DestinationType.FieldSubDestination; }
    createClone() {
        const clone = this.createInstance();
        clone.nestedGroupLevel = this.nestedGroupLevel;
        return clone;
    }
    beforePopRtfState() {
        super.beforePopRtfState();
        this.nestedGroupLevel--;
        if (this.nestedGroupLevel == 0)
            this.onDestinationClose();
    }
    increaseGroupLevel() {
        super.increaseGroupLevel();
        this.nestedGroupLevel++;
    }
    onDestinationClose() {
    }
}
