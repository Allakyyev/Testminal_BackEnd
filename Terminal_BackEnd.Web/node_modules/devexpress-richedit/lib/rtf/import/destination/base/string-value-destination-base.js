import { MapCreator } from '../../../../base-utils/map-creator';
import { DestinationType } from '../utils/destination-type';
import { DestinationBase } from './destination';
export class StringValueDestinationBase extends DestinationBase {
    get destinationType() { return DestinationType.StringValueDestination; }
    get controlCharHT() { return StringValueDestinationBase.controlCharHT; }
}
StringValueDestinationBase.controlCharHT = new MapCreator()
    .add('\'', StringValueDestinationBase.onSwitchToHexChar)
    .add('\\', StringValueDestinationBase.onEscapedChar)
    .get();
