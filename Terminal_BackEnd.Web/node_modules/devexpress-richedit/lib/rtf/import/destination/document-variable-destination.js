import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { StringValueDestination } from './base/string-value-destination';
import { DestinationType } from './utils/destination-type';
export class DocumentVariableDestination extends StringValueDestination {
    constructor() {
        super(...arguments);
        this.isNameRead = true;
    }
    get destinationType() { return DestinationType.DocumentVariableDestination; }
    createEmptyClone() {
        return new DocumentVariableDestination(this.importer);
    }
    afterPopRtfState() {
        super.afterPopRtfState();
        if (!StringUtils.isNullOrEmpty(this.name) && !StringUtils.isNullOrEmpty(this.ownValue))
            this.importer.documentModel.docVariables.addValue(this.name, this.ownValue);
    }
    nestedGroupFinished(nestedDestination) {
        super.nestedGroupFinished(nestedDestination);
        if (!(nestedDestination instanceof DocumentVariableDestination))
            return;
        const nestedValue = StringUtils.trim(nestedDestination.value);
        if (this.isNameRead) {
            this.name = nestedValue;
            this.isNameRead = false;
        }
        else
            this.ownValue = nestedValue;
    }
}
