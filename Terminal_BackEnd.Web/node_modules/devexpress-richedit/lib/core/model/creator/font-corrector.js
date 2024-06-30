import { Flag } from '@devexpress/utils/lib/class/flag';
import { FontInfoCache } from '../caches/hashed-caches/font-info-cache';
import { ControlFont } from '../fonts/control-font';
import { FontFaceDescriptors } from '../fonts/font-face-descriptors';
import { ControlFontType } from '../fonts/font-info';
import { GoogleFontsApi } from '../fonts/google-fonts';
import { ModelCacheFiller } from './cache';
export class FontCorrector {
    constructor(modelManipulator, model, fonts) {
        this.modelManipulator = modelManipulator;
        this.model = model;
        this.fonts = fonts;
    }
    get fontInfoCache() {
        return this.model.cache.fontInfoCache;
    }
    get controlFontsCache() {
        return this.model.cache.controlFontsCache;
    }
    correct() {
        this.addAndLoad();
        new ModelCacheFiller(this.model, this.fonts).fillCache();
        this.removeRedundant();
        this.modelManipulator.raiseFontListChanged(this.fontInfoCache);
    }
    addAndLoad() {
        this.fonts.fonts.forEach(font => {
            let newFont = this.fontInfoCache.getItemByName(font.name);
            if (!newFont)
                newFont = this.fontInfoCache.addFont(font.name, font.fontFamily);
            else
                newFont.cssString = FontInfoCache.correctCssString(font.fontFamily);
            const addControlFont = (uri, desc) => {
                const controlFont = this.controlFontsCache.addFont(new ControlFont(font.fontFamily, desc));
                controlFont.sourceUrls.unshift(uri);
                const controlFontType = new Flag();
                controlFontType.set(ControlFontType.Bold, controlFont.descriptors.msWordBold());
                controlFontType.set(ControlFontType.Italic, controlFont.descriptors.msWordItalic());
                newFont.controlFontMap[controlFontType.getValue()] = controlFont.cacheKey;
            };
            if (font.regularFontUri)
                addControlFont(font.regularFontUri, FontFaceDescriptors.create({}));
            if (font.boldFontUri)
                addControlFont(font.boldFontUri, FontFaceDescriptors.create({ weight: 'bold' }));
            if (font.italicFontUri)
                addControlFont(font.italicFontUri, FontFaceDescriptors.create({ style: 'italic' }));
            if (font.boldItalicFontUri)
                addControlFont(font.boldItalicFontUri, FontFaceDescriptors.create({ weight: 'bold', style: 'italic' }));
            if (font.googleFontsResponse)
                new GoogleFontsApi(this.controlFontsCache, [newFont]).parseResponce(font.googleFontsResponse);
            else if (font.useGoogleFonts)
                new GoogleFontsApi(this.controlFontsCache, [newFont]).loadControlFonts(_createdFonts => { });
        });
    }
    removeRedundant() {
        if (this.fonts.limitedFonts) {
            const map = {};
            this.fonts.fonts.forEach(f => map[f.name] = f);
            this.fontInfoCache.removeItems(font => !map[font.name]);
        }
    }
}
