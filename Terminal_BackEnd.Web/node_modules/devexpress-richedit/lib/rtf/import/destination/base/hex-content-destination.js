import { DestinationType } from '../utils/destination-type';
import { DestinationBase } from './destination';
export class HexContentDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.firstPosition = true;
    }
    get destinationType() { return DestinationType.HexContentDestination; }
    get controlCharHT() { return null; }
    ;
    processCharCore(ch) {
        this.processBinChar(ch);
    }
}
