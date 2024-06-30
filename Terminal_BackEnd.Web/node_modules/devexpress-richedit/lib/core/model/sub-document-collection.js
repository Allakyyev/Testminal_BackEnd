import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class SubDocumentCollection {
    constructor() {
        this._collection = {};
        this._filteredCollection = null;
    }
    get filteredCollection() {
        var _a;
        return (_a = this._filteredCollection) !== null && _a !== void 0 ? _a : (this._filteredCollection = NumberMapUtils.reducedMap(this._collection, (subDoc, _) => subDoc.isDeleted ? null : subDoc));
    }
    get collection() {
        return this._collection;
    }
    add(subDocument) {
        this._collection[subDocument.id] = subDocument;
        this._filteredCollection = null;
    }
    delete(subDocumentId) {
        this._collection[subDocumentId].isDeleted = true;
        this._filteredCollection = null;
    }
    replace(subDocumentId, replacedWithSubDocId) {
        const subDoc = this._collection[subDocumentId];
        subDoc.isDeleted = true;
        subDoc.replacedWithSubDocId = replacedWithSubDocId;
        this._filteredCollection = null;
    }
    restore(subDocumentId) {
        this._collection[subDocumentId].isDeleted = false;
        this._filteredCollection = null;
    }
    clone(model) {
        const newCollection = new SubDocumentCollection();
        for (const key in this._collection) {
            if (Object.prototype.hasOwnProperty.call(this._collection, key)) {
                const subDocument = this._collection[key];
                newCollection.add(subDocument.clone(model));
            }
        }
        return newCollection;
    }
}
