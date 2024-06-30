import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { StringValueDestinationBase } from '../base/string-value-destination-base';
import { DestinationType } from '../utils/destination-type';
export class HyperlinkPropertyValueDestination extends StringValueDestinationBase {
    constructor() {
        super(...arguments);
        this._value = [];
    }
    get destinationType() { return DestinationType.HyperlinkPropertyValueDestination; }
    get value() { return StringUtils.trim(this._value.join('')); }
    processCharCore(ch) {
        this._value.push(ch);
    }
    createClone() {
        const clone = this.createEmptyClone();
        clone._value = this._value;
        return clone;
    }
}
