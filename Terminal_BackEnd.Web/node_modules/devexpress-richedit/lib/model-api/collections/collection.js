export class Collection {
    constructor(processor) {
        this._processor = processor;
    }
    get count() {
        return this._getCoreItems().length;
    }
    getByIndex(index) {
        const obj = this._getCoreItems()[index];
        return obj !== undefined ? this._getItem(obj) : null;
    }
}
