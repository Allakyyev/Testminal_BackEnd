import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfFontInfo } from './rtf-font-info';
export class RtfFontInfoCollection {
    constructor() {
        this.defaultRtfFontInfo = RtfFontInfo.createDefaultRtfFontInfo();
        this.collection = [];
    }
    getRtfFontInfoById(id) {
        const font = ListUtils.elementBy(this.collection, font => font.id == id);
        return font ? font : this.defaultRtfFontInfo;
    }
}
