import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class FontChooser {
    constructor(fontInfoCache) {
        this.fontInfoCache = fontInfoCache;
    }
    static isGenericFamily(family) {
        return !!FontChooser.genericFontFamilies[family];
    }
    chooseByCssString(cssString) {
        const cssFontFamilies = DomUtils.getFontFamiliesFromCssString(cssString);
        if (cssFontFamilies.length == 0)
            return null;
        if (cssFontFamilies.length == 1 && FontChooser.isGenericFamily(cssFontFamilies[0]))
            return this.chooseGenericFont[cssFontFamilies[0]];
        const nameToFontInfosMap = {};
        this.fontInfoCache.forEach((fontInfo) => {
            const fontFamilies = fontInfo.getFontFamilies();
            for (let index = 0; index < fontFamilies.length; index++) {
                const fontFamily = fontFamilies[index];
                if (!FontChooser.isGenericFamily(fontFamily)) {
                    const items = nameToFontInfosMap[fontFamily] || (nameToFontInfosMap[fontFamily] = {});
                    items[index] = fontInfo;
                }
            }
        });
        for (let cssFontFamily of cssFontFamilies) {
            const priorityToFontInfoMap = nameToFontInfosMap[cssFontFamily];
            if (priorityToFontInfoMap) {
                const hightPriority = Object.keys(priorityToFontInfoMap)[0];
                return priorityToFontInfoMap[hightPriority];
            }
        }
        return null;
    }
    chooseGenericFont(fontFamily) {
        const genericFontFamily = FontChooser.genericFontFamilies[fontFamily];
        if (!fontFamily)
            return null;
        const foundByDirectName = this.fontInfoCache.findItemByPredicate(fontInfo => ListUtils.unsafeAnyOf(fontInfo.getFontFamilies(), fam => fam == genericFontFamily));
        if (foundByDirectName)
            return foundByDirectName;
        const foundByGenericName = this.fontInfoCache.findItemByPredicate(fontInfo => ListUtils.unsafeAnyOf(fontInfo.getFontFamilies(), fam => fam == fontFamily));
        if (foundByGenericName)
            return foundByGenericName;
        return null;
    }
}
FontChooser.genericFontFamilies = {
    "serif": "Times New Roman",
    "sans-serif": "Arial",
    "cursive": "Comic Sans MS",
    "fantasy": "Comic Sans MS",
    "monospace": "Courier New",
};
