import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { UnicodeStringValueDestination } from '../base/unicode-string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class FormFieldExitMacroDestination extends UnicodeStringValueDestination {
    get destinationType() { return DestinationType.FormFieldExitMacroDestination; }
    afterPopRtfState() {
        this.importer.importers.field.fields.peek().formFieldProperties.exitMacro = StringUtils.trim(this.value);
    }
    createEmptyClone() {
        return new FormFieldExitMacroDestination(this.importer);
    }
}
