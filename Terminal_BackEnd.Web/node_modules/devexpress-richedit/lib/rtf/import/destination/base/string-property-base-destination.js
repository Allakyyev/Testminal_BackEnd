import { MapCreator } from '../../../../base-utils/map-creator';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DestinationType } from '../utils/destination-type';
import { DestinationBase } from './destination';
export class StringPropertyBaseDestination extends DestinationBase {
    constructor(importer, modifier) {
        super(importer);
        this.value = [];
        this.modifier = modifier;
    }
    get destinationType() { return DestinationType.StringPropertyBaseDestination; }
    get controlCharHT() { return StringPropertyBaseDestination.controlCharHT; }
    processCharCore(ch) {
        this.value.push(ch);
    }
    afterPopRtfState() {
        const value = StringUtils.trim(this.value.join(""), ['\"', '\\s']);
        this.modifier(value);
    }
    createClone() {
        return new StringPropertyBaseDestination(this.importer, this.modifier);
    }
}
StringPropertyBaseDestination.controlCharHT = new MapCreator()
    .add('\\', DestinationBase.onEscapedChar)
    .get();
