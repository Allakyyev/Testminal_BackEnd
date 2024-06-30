import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RangePermissionsChangedSubDocumentChange } from '../changes/sub-document/range-permissions-changed';
import { ConstRangePermission, RangePermission } from '../range-permissions';
import { BaseManipulator } from './base-manipulator';
export class RangePermissionManipulator extends BaseManipulator {
    createRangePermission(subDocument, permissionTemplate) {
        subDocument.rangePermissions.push(new RangePermission(subDocument.positionManager, permissionTemplate.interval, permissionTemplate.userName, permissionTemplate.group));
        subDocument.rangePermissions = subDocument.rangePermissions.sort(ConstRangePermission.comparer);
        subDocument.filterRangePermissions(this.modelManipulator.modelManager.richOptions.documentProtection);
        this.modelManipulator.notifyModelChanged(new RangePermissionsChangedSubDocumentChange(subDocument.id, permissionTemplate));
    }
    deleteRangePermission(subDocument, permissionTemplate, permissionIndex = ListUtils.indexBy(subDocument.rangePermissions, (b) => b.constRangePermission.equals(permissionTemplate))) {
        subDocument.rangePermissions.splice(permissionIndex, 1)[0].destructor(subDocument.positionManager);
        subDocument.filterRangePermissions(this.modelManipulator.modelManager.richOptions.documentProtection);
        this.modelManipulator.notifyModelChanged(new RangePermissionsChangedSubDocumentChange(subDocument.id, permissionTemplate));
    }
}
