import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { UnicodeStringValueDestination } from '../base/unicode-string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class FormFieldHelpTextDestination extends UnicodeStringValueDestination {
    get destinationType() { return DestinationType.FormFieldHelpTextDestination; }
    afterPopRtfState() {
        this.importer.importers.field.fields.peek().formFieldProperties.helpText = StringUtils.trim(this.value);
    }
    createEmptyClone() {
        return new FormFieldHelpTextDestination(this.importer);
    }
}
