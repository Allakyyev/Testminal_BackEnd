import { Flag } from '@devexpress/utils/lib/class/flag';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ControlFont } from './control-font';
import { FontFaceDescriptors } from './font-face-descriptors';
import { ControlFontType } from './font-info';
export class GoogleFontsApi {
    constructor(controlFontsCache, fonts) {
        this.fontFamilyToFontInfo = {};
        this.fonts = fonts;
        this.controlFontsCache = controlFontsCache;
        const params = this.fonts.map(font => {
            const fontFamily = font.getFontFamilies()[0];
            this.fontFamilyToFontInfo[fontFamily] = font;
            return `${fontFamily.replace(' ', '+')}:regular,bold,italic,bolditalic`;
        }).join('|');
        this.uri = `https://fonts.googleapis.com/css?family=${params}`;
    }
    loadControlFonts(callback) {
        const notLoaded = () => callback([]);
        const xhr = new XMLHttpRequest();
        xhr.onload = (_e) => {
            const responce = xhr.response;
            if (xhr.status >= 400 || !responce)
                notLoaded();
            else
                callback(this.parseResponce(responce));
        };
        xhr.onerror = () => notLoaded();
        xhr.open("GET", this.uri, true);
        xhr.responseType = "text";
        xhr.send();
    }
    parseResponce(responce) {
        const result = [];
        let regexpResult;
        const regexp = /@font-face\s*\{([\s\S]*?)\}/gm;
        while (regexpResult = regexp.exec(responce)) {
            const fontInfo = regexpResult[1];
            const fontFamily = fontInfo.match(/font-family:\s*'(\w+\s*\w*)';/);
            if (fontFamily && fontFamily[1]) {
                const url = GoogleFontsApi.parseSrc(fontInfo.match(/src:\s*(.+);/));
                const fontStyle = fontInfo.match(/font-style:\s*(\w+);/);
                const fontWeight = fontInfo.match(/font-weight:\s*(.+);/);
                const unicodeRange = fontInfo.match(/unicode-range:\s*(.+);/);
                const desc = new FontFaceDescriptors();
                if (fontStyle && fontStyle[1])
                    desc.style = fontStyle[1];
                if (fontWeight && fontWeight[1])
                    desc.weight = fontWeight[1];
                if (unicodeRange && unicodeRange[1])
                    desc.unicodeRange = unicodeRange[1];
                const controlFont = this.controlFontsCache.addFont(new ControlFont(fontFamily[1], desc));
                if (url && ListUtils.allOf(controlFont.sourceUrls, s => s != url)) {
                    controlFont.sourceUrls.unshift(url);
                    const fontInfo = this.fontFamilyToFontInfo[controlFont.fontFamily];
                    const controlFontType = new Flag();
                    controlFontType.set(ControlFontType.Bold, controlFont.descriptors.msWordBold());
                    controlFontType.set(ControlFontType.Italic, controlFont.descriptors.msWordItalic());
                    fontInfo.controlFontMap[controlFontType.getValue()] = controlFont.cacheKey;
                    result.push(controlFont);
                }
            }
        }
        return result;
    }
    static parseSrc(matchSrc) {
        if (matchSrc && matchSrc[1])
            for (let src of matchSrc[1].split(',')) {
                const matchUrl = src.match(/url\((.+)\)\s*format\('(\w+)'\)/);
                if (matchUrl)
                    return matchUrl[1];
            }
        return null;
    }
}
