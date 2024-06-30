import { DestinationType } from '../utils/destination-type';
import { RangePermissionDestinationBase } from './range-permission-destination-base';
export class RangePermissionStartDestination extends RangePermissionDestinationBase {
    get destinationType() { return DestinationType.RangePermissionStartDestination; }
    createEmptyClone() {
        return new RangePermissionStartDestination(this.importer);
    }
    assignRangePermissionPosition(rangePermission) {
        rangePermission.start = this.importer.importers.character.logPosition;
    }
}
