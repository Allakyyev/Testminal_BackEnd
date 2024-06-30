import { HistoryItem } from '../base/history-item';
export class RangePermissionHistoryItemBase extends HistoryItem {
    constructor(modelManipulator, boundSubDocument, bkmTemplate) {
        super(modelManipulator);
        this.permissionTemplate = bkmTemplate;
        this.boundSubDocument = boundSubDocument;
    }
}
export class CreateRangePermissionHistoryItem extends RangePermissionHistoryItemBase {
    redo() {
        this.modelManipulator.rangePermission.createRangePermission(this.boundSubDocument, this.permissionTemplate);
    }
    undo() {
        this.modelManipulator.rangePermission.deleteRangePermission(this.boundSubDocument, this.permissionTemplate);
    }
}
export class DeleteRangePermissionHistoryItem extends RangePermissionHistoryItemBase {
    redo() {
        this.modelManipulator.rangePermission.deleteRangePermission(this.boundSubDocument, this.permissionTemplate);
    }
    undo() {
        this.modelManipulator.rangePermission.createRangePermission(this.boundSubDocument, this.permissionTemplate);
    }
}
