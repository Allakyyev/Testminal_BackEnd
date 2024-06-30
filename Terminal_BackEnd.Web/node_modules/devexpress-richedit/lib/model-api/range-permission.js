import { DeleteRangePermissionHistoryItem } from '../core/model/history/items/range-permission-history-item';
import { ApiUtils } from './api-utils/api-utils';
import { IntervalApi } from './interval';
import { SubDocumentApi } from './sub-document';
export class RangePermissionApi {
    constructor(processor, subDocument, rangePermission) {
        this._rangePermission = rangePermission;
        this._subDocument = subDocument;
        this._processor = processor;
    }
    get index() {
        return ApiUtils.getObject(this._subDocument.rangePermissions, (b) => b.start, this._rangePermission.start, this._rangePermission);
    }
    get subDocument() {
        return new SubDocumentApi(this._processor, this._subDocument);
    }
    get interval() {
        return new IntervalApi(this._rangePermission.start, this._rangePermission.length);
    }
    get userName() { return this._rangePermission.userName; }
    get group() { return this._rangePermission.group; }
    delete() {
        this._processor.modelManager.history.addAndRedo(new DeleteRangePermissionHistoryItem(this._processor.modelManager.modelManipulator, this._subDocument, this._rangePermission.constRangePermission));
    }
}
