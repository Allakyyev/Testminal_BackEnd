import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { ColorHelper } from '../model/color/color';
export class ModelPositionHolder {
    constructor(pos, posManager) {
        this.pos = posManager.registerPosition(pos);
        this.posManager = posManager;
    }
    get modelPosition() {
        return this.pos.value;
    }
    destructor() {
        this.posManager.unregisterPosition(this.pos);
    }
}
export class AnchorObjectsPositionInfo {
    constructor(model) {
        this.model = model;
        this.cache = {};
    }
    add(obj, modelPosition) {
        this.delete(obj.objectId);
        this.cache[obj.objectId] = new ModelPositionHolder(modelPosition, this.model.subDocuments[obj.belongsToSubDocId].positionManager);
    }
    delete(id) {
        const info = this.cache[id];
        if (info) {
            info.destructor();
            delete this.cache[id];
        }
    }
    getPosition(objectId) {
        return this.cache[objectId].modelPosition;
    }
    clear() {
        NumberMapUtils.forEach(this.cache, (posInfo) => posInfo.destructor());
        this.cache = {};
    }
}
export class DocumentLayout {
    constructor(anchorObjectsPositionInfo) {
        this.anchorObjectsPositionInfo = anchorObjectsPositionInfo;
        this.setEmptyLayout(ColorHelper.NO_COLOR);
    }
    setEmptyLayout(pageColor) {
        this.pages = [];
        this.validPageCount = 0;
        this.lastMaxNumPages = 0;
        this.isFullyFormatted = false;
        this.pageColor = pageColor;
        this.anchorObjectsPositionInfo.clear();
    }
    getLastValidPage() {
        return this.pages[this.validPageCount - 1];
    }
    isPageValid(pageIndex) {
        return pageIndex < this.validPageCount && this.pages[pageIndex].isValid;
    }
}
