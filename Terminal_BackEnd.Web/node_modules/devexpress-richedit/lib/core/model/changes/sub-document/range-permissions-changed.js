import { ModelChangeType } from '../enums';
export class RangePermissionsChangedSubDocumentChange {
    constructor(subDocumentId, permission) {
        this.subDocumentId = subDocumentId;
        this.permission = permission;
        this.type = ModelChangeType.RangePermissionsChanged;
    }
}
export class RangePermissionsPropertiesChange {
    constructor() {
        this.type = ModelChangeType.RangePermissionsPropertiesChanged;
    }
}
