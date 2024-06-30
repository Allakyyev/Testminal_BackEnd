import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DestinationType } from '../utils/destination-type';
import { StringValueDestinationBase } from './string-value-destination-base';
export class UnicodeStringValueDestination extends StringValueDestinationBase {
    constructor() {
        super(...arguments);
        this._value = [];
    }
    get destinationType() { return DestinationType.UnicodeStringValueDestination; }
    get value() { return StringUtils.trimEnd(this._value.join(""), [';']); }
    processCharCore(ch) {
        if (ch != UnicodeStringValueDestination.emptyChar)
            this._value.push(ch);
        else
            this._value.push(UnicodeStringValueDestination.lowbar);
    }
    createClone() {
        const clone = this.createEmptyClone();
        clone._value = this._value;
        return clone;
    }
}
UnicodeStringValueDestination.emptyChar = '\0';
UnicodeStringValueDestination.lowbar = '_';
