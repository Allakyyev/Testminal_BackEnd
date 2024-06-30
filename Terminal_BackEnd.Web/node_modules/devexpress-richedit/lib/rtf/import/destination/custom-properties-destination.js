import { DestinationBase } from './base/destination';
import { DestinationType } from './utils/destination-type';
export class CustomPropertiesDestination extends DestinationBase {
    get destinationType() { return DestinationType.CustomPropertiesDestination; }
    ;
    get controlCharHT() { return null; }
    ;
    createClone() {
        return new CustomPropertiesDestination(this.importer);
    }
    static onPropname(_importer, _parameterValue, _hasParameter) {
    }
    static onStaticval(_importer, _parameterValue, _hasParameter) {
    }
    static onProptType(_importer, _parameterValue, _hasParameter) {
    }
    static onLinkval(_importer, _parameterValue, _hasParameter) {
    }
}
