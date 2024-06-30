import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DestinationType } from '../utils/destination-type';
import { StringValueDestinationBase } from './string-value-destination-base';
export class StringValueDestination extends StringValueDestinationBase {
    constructor() {
        super(...arguments);
        this._value = "";
    }
    get destinationType() { return DestinationType.StringValueDestination; }
    get value() { return StringUtils.trimEnd(this._value, [";"]); }
    processCharCore(ch) {
        this._value += ch;
    }
    createClone() {
        const clone = this.createEmptyClone();
        clone._value = this._value;
        return clone;
    }
}
