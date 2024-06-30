import { FontLoadStatus } from '../../core/model/fonts/control-font';
import { ControlFontsLoader } from '../../core/model/fonts/loader';
export class ControlFontApi {
    constructor(processor, font) {
        this._font = font;
        this._processor = processor;
    }
    get fontFamily() { return this._font.fontFamily; }
    get status() {
        switch (this._font.status) {
            case FontLoadStatus.Error: return 'error';
            case FontLoadStatus.Loaded: return 'loaded';
            case FontLoadStatus.Loading: return 'loading';
            case FontLoadStatus.Unloaded: return 'unloaded';
        }
    }
    get descriptors() { return this._font.descriptors.clone(); }
    get data() { return this._font.data; }
    get sourceUrls() { return this._font.allSourceUrls(this._processor.modelManager.richOptions.fonts.defaultFolder); }
    set sourceUrls(val) { this._font.sourceUrls = val; }
    set sourceUrl(val) { this._font.sourceUrls = [val]; }
    load(reloadFailed = false, callback) {
        if (!callback)
            callback = () => { };
        const modelManager = this._processor.modelManager;
        const loader = new ControlFontsLoader(modelManager.model.cache.controlFontsCache, modelManager.richOptions.fonts, false);
        const status = [FontLoadStatus.Unloaded];
        if (reloadFailed)
            status.push(FontLoadStatus.Error);
        loader.loadFonts([this._font], status, () => {
            if (loader.needInvalidateLayout)
                this._processor.invalidateLayoutAfterFontsLoaded();
            callback();
        });
    }
    delete() {
        this._processor.modelManager.model.cache.controlFontsCache.deleteFont(this._font);
    }
}
