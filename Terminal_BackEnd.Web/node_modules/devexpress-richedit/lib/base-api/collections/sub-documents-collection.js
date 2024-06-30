import { SubDocumentCollection } from '../../model-api/collections/sub-documents-collection';
import { SubDocumentBaseApi } from '../sub-document';
export class SubDocumentCollectionBaseApi extends SubDocumentCollection {
    constructor(core) {
        super(core);
        this._core = core;
    }
    get main() {
        return this._getItem(this._core.modelManager.model.mainSubDocument);
    }
    _getItem(coreItem) {
        return new SubDocumentBaseApi(this._core, coreItem);
    }
}
