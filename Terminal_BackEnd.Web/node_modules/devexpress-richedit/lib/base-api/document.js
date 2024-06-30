import { IsModified } from '../core/model/json/enums/json-top-level-enums';
import { RichEditDocumentApi } from '../model-api/document';
import { SubDocumentCollectionBaseApi } from './collections/sub-documents-collection';
export class RichEditDocumentBaseApi extends RichEditDocumentApi {
    constructor(core) {
        super(core);
        this._core = core;
    }
    get modified() { return this._core.getModifiedState() == IsModified.True; }
    set modified(value) { if (!value)
        this._core.setModifiedFalse(); }
    get subDocuments() {
        return new SubDocumentCollectionBaseApi(this._core);
    }
    get bookmarks() {
        return this.subDocuments.main.bookmarks;
    }
    get images() {
        return this.subDocuments.main.images;
    }
    setDefaultCharacterProperties(characterProperties) {
        super.setDefaultCharacterProperties(characterProperties);
        this._core.inputPosition.reset();
        this._core.barHolder.updateItemsState();
    }
}
