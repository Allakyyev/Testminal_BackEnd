export class ModelFontApi {
    constructor(processor, internalItem) {
        this._internalItem = internalItem;
        this._processor = processor;
    }
    get name() {
        return this._internalItem.name;
    }
    get cssName() {
        return this._internalItem.cssString;
    }
    delete() {
        this._processor.modelManager.modelManipulator.font.removeFont(this._internalItem);
    }
}
