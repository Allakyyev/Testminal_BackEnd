export class HistoryApi {
    constructor(core) {
        this._core = core;
    }
    beginTransaction() {
        this._core.modelManager.history.beginTransaction();
    }
    endTransaction() {
        this._core.modelManager.history.endTransaction();
    }
    redo() {
        this._core.modelManager.history.redo();
    }
    undo() {
        this._core.modelManager.history.undo();
    }
    clear() {
        this._core.modelManager.history.clear();
        this._core.barHolder.updateItemsState();
    }
}
