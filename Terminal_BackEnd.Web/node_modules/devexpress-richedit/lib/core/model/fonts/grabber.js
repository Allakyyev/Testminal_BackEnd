import { Flag } from '@devexpress/utils/lib/class/flag';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { LayoutBoxType } from '../../layout/main-structures/layout-boxes/layout-box';
import { HashBasedCacheCore } from '../caches/hash-based-cache';
import { ControlFont } from './control-font';
import { ControlFontType } from './font-info';
export class LayoutFontsCollectorElement {
    constructor(charProps) {
        this.textCache = Object.create(null);
        this.charProps = charProps;
    }
    getHashCode() {
        return this.charProps.getHashCode();
    }
    equals(obj) {
        return this.charProps.equals(obj.charProps);
    }
    addFont(symbol, font) {
        this.textCache[symbol] = font;
    }
    getFont(symbol) {
        return this.textCache[symbol];
    }
    replaceUnloadedFonts(defaultFontMap) {
        const newTextCache = Object.create(null);
        for (let key in this.textCache) {
            const controlFont = this.textCache[key];
            newTextCache[key] = controlFont.loaded ? controlFont : defaultFontMap[controlFont.controlFontType];
        }
        const newElement = new LayoutFontsCollectorElement(this.charProps);
        newElement.textCache = newTextCache;
        return newElement;
    }
}
export class LayoutFontsCollectorCache extends HashBasedCacheCore {
    replaceUnloadedFonts(defaultFontMap) {
        const result = new LayoutFontsCollectorCache();
        NumberMapUtils.forEach(this.hashtable, list => list.forEach(elem => result.getItem(elem.replaceUnloadedFonts(defaultFontMap))));
        return result;
    }
}
export class LayoutFontsCollector {
    constructor(cache, layout, defaultFontName) {
        this.fonts = {};
        this.cache = new LayoutFontsCollectorCache();
        this.controlFontsCache = cache.controlFontsCache;
        this.layout = layout;
        this.defaultFont = defaultFontName ? cache.fontInfoCache.getItemByName(defaultFontName) : null;
    }
    addDefaultFont() {
        if (!this.defaultFont)
            return;
        const addFontToLoad = (type) => {
            const fontKey = this.defaultFont.controlFontMap[type];
            const controlFont = this.controlFontsCache.getFontByKey(fontKey);
            if (controlFont)
                this.fonts[fontKey] = controlFont;
        };
        this.defaultFont.ensureAllControlFontsAssigned(this.controlFontsCache);
        addFontToLoad(ControlFontType.Regular);
        addFontToLoad(ControlFontType.Bold);
        addFontToLoad(ControlFontType.Italic);
        addFontToLoad(ControlFontType.BoldItalic);
    }
    collect() {
        this.addDefaultFont();
        for (const page of this.layout.pages) {
            for (const pageArea of page.mainSubDocumentPageAreas)
                this.grabFromPageArea(pageArea);
            NumberMapUtils.forEach(page.otherPageAreas, (pageArea) => this.grabFromPageArea(pageArea));
        }
        return NumberMapUtils.toList(this.fonts);
    }
    grabFromPageArea(pageArea) {
        for (const column of pageArea.columns) {
            for (const row of column.rows) {
                if (row.numberingListBox) {
                    this.addFont(row.numberingListBox.textBox);
                    if (row.numberingListBox.separatorBox)
                        this.addFont(row.numberingListBox.separatorBox);
                }
                for (const rowBox of row.boxes)
                    this.addFont(rowBox);
            }
        }
    }
    addFont(box) {
        if (EnumUtils.isAnyOf(box.getType(), LayoutBoxType.Picture, LayoutBoxType.AnchorPicture))
            return;
        const content = LayoutFontsCollector.boxContent(box);
        if (content.length)
            this.mustHaveFontsForRenderText(box.characterProperties, content);
    }
    mustHaveFontsForRenderText(charProps, text) {
        const cacheElem = this.cache.getItem(new LayoutFontsCollectorElement(charProps));
        const controlFontType = new Flag();
        controlFontType.set(ControlFontType.Bold, charProps.fontBold);
        controlFontType.set(ControlFontType.Italic, charProps.fontItalic);
        const key = charProps.fontInfo.controlFontMap[controlFontType.getValue()];
        const textLen = text.length;
        let defaultControlFont = null;
        for (let textIndex = 0; textIndex < textLen; textIndex++) {
            const symbol = text[textIndex];
            if (cacheElem.getFont(symbol))
                continue;
            const charCodePoint = symbol.charCodeAt(0);
            const candidate = this.controlFontsCache.getFontByKey(key);
            let font = candidate && ListUtils.unsafeAnyOf(candidate.unicodeRanges, range => range.contains(charCodePoint)) ?
                candidate : null;
            if (!font) {
                if (candidate)
                    font = candidate;
                else {
                    if (!defaultControlFont)
                        defaultControlFont = this.controlFontsCache.addFont(ControlFont.createDefault(charProps.fontInfo.getFontFamilies()[0], controlFontType));
                    font = defaultControlFont;
                }
            }
            if (!this.fonts[font.cacheKey])
                this.fonts[font.cacheKey] = font;
            cacheElem.addFont(symbol, font);
        }
    }
    static boxContent(box) {
        switch (box.getType()) {
            case LayoutBoxType.Text:
            case LayoutBoxType.LayoutDependent:
            case LayoutBoxType.Dash:
                return box.text;
            case LayoutBoxType.ColumnBreak:
            case LayoutBoxType.LineBreak:
            case LayoutBoxType.PageBreak:
            case LayoutBoxType.ParagraphMark:
            case LayoutBoxType.SectionMark:
            case LayoutBoxType.TabSpace:
            case LayoutBoxType.Space:
                return " ";
            default:
                return "";
        }
    }
}
