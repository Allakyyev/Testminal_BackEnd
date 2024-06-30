import { ModelFontApi } from '../fonts/model-font';
import { Collection } from './collection';
export class FontCollection extends Collection {
    _getItem(internalItem) {
        return new ModelFontApi(this._processor, internalItem);
    }
    _getCoreItems() {
        return this._processor.modelManager.model.cache.fontInfoCache.getAllFonts();
    }
    getByName(name) {
        const coreFont = this._processor.modelManager.model.cache.fontInfoCache.getItemByName(name);
        return coreFont ? this._getItem(coreFont) : null;
    }
    create(name, cssName) {
        if (this._processor.modelManager.richOptions.fonts.limitedFonts) {
            console.warn("Font creation is prohibited.");
            return null;
        }
        return this._getItem(this._processor.modelManager.modelManipulator.font.addFontByName(name, cssName));
    }
    getAllFontNames() {
        return this._processor.modelManager.model.cache.fontInfoCache.getFontNames();
    }
}
