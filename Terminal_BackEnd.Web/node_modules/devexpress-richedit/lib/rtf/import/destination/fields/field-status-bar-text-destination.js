import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { UnicodeStringValueDestination } from '../base/unicode-string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class FieldStatusBarTextDestination extends UnicodeStringValueDestination {
    get destinationType() { return DestinationType.FieldStatusBarTextDestination; }
    afterPopRtfState() {
        this.importer.importers.field.fields.last.formFieldProperties.statusText = StringUtils.trim(this.value);
    }
    createEmptyClone() {
        return new FieldStatusBarTextDestination(this.importer);
    }
}
