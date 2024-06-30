import { ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SubDocumentApi } from '../sub-document';
import { Collection } from './collection';
export class SubDocumentCollection extends Collection {
    get main() {
        return this._getItem(this._processor.modelManager.model.mainSubDocument);
    }
    getById(id) {
        return this._getItem(this._processor.modelManager.model.subDocuments[id]);
    }
    forEach(callback) {
        callback = ApiParametersChecker.check(callback, 1, true, [
            ApiParametersChecker.functionDescriptor('callback', (val) => val)
        ]);
        NumberMapUtils.forEach(this._processor.modelManager.model.subDocuments, (subDoc) => callback(this._getItem(subDoc)));
    }
    _getItem(coreItem) {
        return new SubDocumentApi(this._processor, coreItem);
    }
    _getCoreItems() {
        return NumberMapUtils.toList(this._processor.modelManager.model.subDocuments);
    }
}
