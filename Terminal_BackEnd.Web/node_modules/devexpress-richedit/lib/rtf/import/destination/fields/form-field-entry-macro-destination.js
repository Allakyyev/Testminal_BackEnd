import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { UnicodeStringValueDestination } from '../base/unicode-string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class FormFieldEntryMacroDestination extends UnicodeStringValueDestination {
    get destinationType() { return DestinationType.FormFieldEntryMacroDestination; }
    afterPopRtfState() {
        this.importer.importers.field.fields.peek().formFieldProperties.entryMacro = StringUtils.trim(this.value);
    }
    createEmptyClone() {
        return new FormFieldEntryMacroDestination(this.importer);
    }
}
