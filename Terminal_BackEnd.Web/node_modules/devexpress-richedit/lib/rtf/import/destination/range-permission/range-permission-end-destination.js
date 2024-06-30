import { DestinationType } from '../utils/destination-type';
import { RangePermissionDestinationBase } from './range-permission-destination-base';
export class RangePermissionEndDestination extends RangePermissionDestinationBase {
    get destinationType() { return DestinationType.RangePermissionEndDestination; }
    createEmptyClone() {
        return new RangePermissionEndDestination(this.importer);
    }
    assignRangePermissionPosition(rangePermission) {
        rangePermission.end = this.importer.importers.character.logPosition + 1;
    }
}
