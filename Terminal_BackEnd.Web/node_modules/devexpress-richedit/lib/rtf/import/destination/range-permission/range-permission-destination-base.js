import { Constants } from '@devexpress/utils/lib/constants';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RtfContentExporter } from '../../../translation-table/rtf-content-exporter';
import { ImportRangePermissionInfo } from '../../model/range-permission/import-range-permission-info';
import { StringValueDestination } from '../base/string-value-destination';
import { DestinationType } from '../utils/destination-type';
export class RangePermissionDestinationBase extends StringValueDestination {
    get destinationType() { return DestinationType.RangePermissionDestinationBase; }
    afterPopRtfState() {
        const data = StringUtils.trim(this.value);
        if (!StringUtils.isNullOrEmpty(data) && data.length == 16) {
            let rangePermission = this.importer.importers.rangePermission.rangePermissions[data];
            if (!rangePermission) {
                rangePermission = new ImportRangePermissionInfo();
                rangePermission.userName = this.obtainUserName(data);
                rangePermission.group = this.obtainGroupName(data);
                this.importer.importers.rangePermission.rangePermissions[data] = rangePermission;
            }
            this.assignRangePermissionPosition(rangePermission);
        }
    }
    obtainUserName(data) {
        const value = this.obtainUserId(data);
        return this.importer.importers.rangePermission.getUserNameById(value);
    }
    obtainGroupName(data) {
        const value = this.obtainUserId(data);
        let result = RtfContentExporter.predefinedUserGroups[value];
        return result != undefined ? result : "";
    }
    obtainUserId(data) {
        const valueLow = parseInt(data.substr(0, 2), 16);
        if (isNaN(valueLow))
            return Constants.MIN_SAFE_INTEGER;
        const valueHigh = parseInt(data.substr(2, 2), 16);
        if (isNaN(valueHigh))
            return Constants.MIN_SAFE_INTEGER;
        return (valueHigh << 8) | valueLow;
    }
}
