import { MapCreator } from '../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DestinationType } from '../utils/destination-type';
import { UnicodeStringValueDestination } from './unicode-string-value-destination';
export class StringPropertyDestination extends UnicodeStringValueDestination {
    constructor(importer, setProperty) {
        super(importer);
        this.setProperty = setProperty;
    }
    get destinationType() { return DestinationType.StringPropertyDestination; }
    get controlCharHT() { return StringPropertyDestination.controlCharHT; }
    createEmptyClone() {
        return new StringPropertyDestination(this.importer, this.setProperty);
    }
    afterPopRtfState() {
        if (!StringUtils.isNullOrEmpty(this.value))
            this.setProperty(this.value);
    }
}
StringPropertyDestination.controlCharHT = new MapCreator()
    .add('\\', StringPropertyDestination.onEscapedChar)
    .add('{', StringPropertyDestination.onEscapedChar)
    .add('}', StringPropertyDestination.onEscapedChar)
    .get();
