import { ControlFont, FontLoadStatus } from '../../core/model/fonts/control-font';
import { FontFaceDescriptors } from '../../core/model/fonts/font-face-descriptors';
import { LayoutFontsCollector } from '../../core/model/fonts/grabber';
import { ControlFontsLoader } from '../../core/model/fonts/loader';
import { ControlFontApi } from '../fonts/control-font';
import { Collection } from './collection';
export class ControlFontCollection extends Collection {
    createAllFontsFromCurrentLayout() {
        new LayoutFontsCollector(this._processor.modelManager.model.cache, this._processor.layoutFormatterManager.layout, this._processor.modelManager.richOptions.fonts.mappings.defaultFontName)
            .collect();
    }
    load(reloadFailed = false, callback) {
        if (!callback)
            callback = () => { };
        const modelManager = this._processor.modelManager;
        const loader = new ControlFontsLoader(modelManager.model.cache.controlFontsCache, modelManager.richOptions.fonts, false);
        const status = [FontLoadStatus.Unloaded];
        if (reloadFailed)
            status.push(FontLoadStatus.Error);
        loader.loadFonts(modelManager.model.cache.controlFontsCache.list, status, () => {
            if (loader.needInvalidateLayout)
                this._processor.invalidateLayoutAfterFontsLoaded();
            callback();
        });
    }
    create(fontFamily, descriptors) {
        return this._getItem(this._processor.modelManager.model.cache.controlFontsCache.addFont(new ControlFont(fontFamily, FontFaceDescriptors.create(descriptors))));
    }
    _getItem(font) {
        return new ControlFontApi(this._processor, font);
    }
    _getCoreItems() {
        return this._processor.modelManager.model.cache.controlFontsCache.list;
    }
}
