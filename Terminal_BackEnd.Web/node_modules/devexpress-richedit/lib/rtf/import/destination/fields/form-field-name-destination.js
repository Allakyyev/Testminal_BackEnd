import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { UnicodeStringValueDestination } from '../base/unicode-string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class FormFieldNameDestination extends UnicodeStringValueDestination {
    get destinationType() { return DestinationType.FormFieldNameDestination; }
    afterPopRtfState() {
        this.importer.importers.field.fields.peek().formFieldProperties.name = StringUtils.trim(this.value);
    }
    createEmptyClone() {
        return new FormFieldNameDestination(this.importer);
    }
}
