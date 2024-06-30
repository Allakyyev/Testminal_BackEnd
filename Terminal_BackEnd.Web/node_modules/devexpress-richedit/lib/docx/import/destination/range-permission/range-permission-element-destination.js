import { __awaiter } from "tslib";
import { MapCreator } from '../../../../base-utils/map-creator';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ImportRangePermissionInfo } from '../../model/import-range-permission-info';
import { LeafElementDestination } from '../destination';
export class RangePermissionElementDestination extends LeafElementDestination {
    static createActualGroupNames() {
        const result = {};
        StringMapUtils.forEach(RangePermissionElementDestination.predefinedGroupNames, (value, key) => result[value] = key);
        return result;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let id = reader.getAttributeNS('id', this.data.constants.wordProcessingNamespaceConst);
            if (id != null)
                id = StringUtils.trim(id);
            if (StringUtils.isNullOrEmpty(id))
                return;
            let rangePermission = this.data.subDocumentInfo.rangePermissionImporter.rangePermissions[id];
            if (!rangePermission)
                this.data.subDocumentInfo.rangePermissionImporter.rangePermissions[id] = rangePermission = new ImportRangePermissionInfo();
            let userName = reader.getAttributeNS('ed', this.data.constants.wordProcessingNamespaceConst);
            if (!StringUtils.isNullOrEmpty(userName)) {
                userName = StringUtils.trim(userName);
                rangePermission.userName = userName;
            }
            let group = reader.getAttributeNS('edGrp', this.data.constants.wordProcessingNamespaceConst);
            if (!StringUtils.isNullOrEmpty(group)) {
                group = StringUtils.trim(group);
                rangePermission.group = this.getActualGroupName(group);
            }
            this.assignRangePermissionProperties(rangePermission, reader);
        });
    }
    getActualGroupName(value) {
        const foundName = RangePermissionElementDestination.actualGroupNames[value];
        return foundName === undefined ? value : foundName;
    }
    getLastRowIndexFromTable(table) {
        return Math.max(0, table.rows.length - 1);
    }
}
RangePermissionElementDestination.predefinedGroupNames = new MapCreator()
    .add('Everyone', 'everyone')
    .add('Current User', 'current')
    .add('Editors', 'editors')
    .add('Owners', 'owners')
    .add('Contributors', 'contributors')
    .add('Administrators', 'administrators')
    .get();
RangePermissionElementDestination.actualGroupNames = RangePermissionElementDestination.createActualGroupNames();
