import { Flag } from '@devexpress/utils/lib/class/flag';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { ControlFontType } from '../fonts/font-info';
export class ControlFontsCache {
    constructor() {
        this.cache = {};
        this.list = [];
    }
    addFont(info) {
        const oldFont = this.cache[info.cacheKey];
        if (oldFont)
            return oldFont;
        this.cache[info.cacheKey] = info;
        this.list.push(info);
        return info;
    }
    getFontByKey(cacheKey) {
        return this.cache[cacheKey];
    }
    getFont(info) {
        return this.cache[info.cacheKey];
    }
    deleteFont(info) {
        const oldFont = this.cache[info.cacheKey];
        if (oldFont) {
            delete this.cache[info.cacheKey];
            ListUtils.removeBy(this.list, el => el.cacheKey == info.cacheKey);
        }
    }
    clone() {
        const result = new ControlFontsCache();
        result.list = ListUtils.deepCopy(this.list);
        result.cache = StringMapUtils.deepCopy(this.cache);
        return result;
    }
    findSimularFontByType(fontFamily, type) {
        const flag = new Flag(type);
        return ListUtils.elementBy(this.list, controlFont => controlFont.fontFamily == fontFamily &&
            controlFont.descriptors.msWordBold() == flag.get(ControlFontType.Bold) &&
            controlFont.descriptors.msWordItalic() == flag.get(ControlFontType.Italic));
    }
}
