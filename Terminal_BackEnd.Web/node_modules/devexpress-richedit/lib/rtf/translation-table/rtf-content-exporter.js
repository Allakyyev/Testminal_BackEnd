import { MapCreator } from '../../base-utils/map-creator';
import { RangePermission } from '../../core/model/range-permissions';
export class RtfContentExporter {
    static createPredefinedUserGroups() {
        return new MapCreator()
            .add(0xFFFA, RangePermission.Current_GROUP_NAME)
            .add(0xFFFB, RangePermission.Editors_GROUP_NAME)
            .add(0xFFFC, RangePermission.Owners_GROUP_NAME)
            .add(0xFFFD, RangePermission.Contributors_GROUP_NAME)
            .add(0xFFFE, RangePermission.Administrators_GROUP_NAME)
            .add(0xFFFF, RangePermission.Everyone_GROUP_NAME)
            .get();
    }
}
RtfContentExporter.predefinedUserGroups = RtfContentExporter.createPredefinedUserGroups();
