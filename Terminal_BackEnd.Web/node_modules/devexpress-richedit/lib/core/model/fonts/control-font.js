import { Flag } from '@devexpress/utils/lib/class/flag';
import { fontWebApiAvailable, loadFont } from '@devexpress/utils/lib/utils/fonts';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { FontFaceDescriptors } from './font-face-descriptors';
import { ControlFontType } from './font-info';
import { FONT_NAME_TO_FILE_NAME } from './fonts-map';
export var FontLoadStatus;
(function (FontLoadStatus) {
    FontLoadStatus[FontLoadStatus["Unloaded"] = 0] = "Unloaded";
    FontLoadStatus[FontLoadStatus["Loading"] = 1] = "Loading";
    FontLoadStatus[FontLoadStatus["Loaded"] = 2] = "Loaded";
    FontLoadStatus[FontLoadStatus["Error"] = 3] = "Error";
})(FontLoadStatus || (FontLoadStatus = {}));
export class ControlFont {
    constructor(fontFamily, descriptors, key) {
        this.isFontCollection = false;
        this.status = FontLoadStatus.Unloaded;
        this.sourceUrls = [];
        this._unicodeRanges = null;
        this.fontFamily = fontFamily;
        this.descriptors = descriptors;
        this.cacheKey = key ? key : [this.fontFamily, this.descriptors.cacheKey].join('/');
    }
    get loaded() { return this.status == FontLoadStatus.Loaded; }
    get unicodeRanges() {
        if (!this._unicodeRanges)
            this._unicodeRanges = this.descriptors.parseUnicodeRanges();
        return this._unicodeRanges;
    }
    get controlFontType() {
        const controlFontType = new Flag();
        controlFontType.set(ControlFontType.Bold, this.descriptors.msWordBold());
        controlFontType.set(ControlFontType.Italic, this.descriptors.msWordItalic());
        return controlFontType.getValue();
    }
    applySource(data, callback) {
        if (!this.data)
            this.data = data;
        if (fontWebApiAvailable())
            loadFont(this.fontFamily, data, this.descriptors, callback);
        else {
            setTimeout(callback, 0);
        }
    }
    clone() {
        const obj = new ControlFont(this.fontFamily, this.descriptors.clone(), this.cacheKey);
        obj.status = this.status;
        obj.data = this.data;
        obj._unicodeRanges = this._unicodeRanges;
        obj._unicodeRanges = this._unicodeRanges;
        obj.sourceUrls = ListUtils.shallowCopy(this.sourceUrls);
        obj.isFontCollection = this.isFontCollection;
        return obj;
    }
    allSourceUrls(baseUrl) {
        return ListUtils.addListOnTail(ListUtils.shallowCopy(this.sourceUrls), this.defaultUrls(baseUrl));
    }
    defaultUrls(baseUrl) {
        const bold = this.descriptors.msWordBold();
        const italic = this.descriptors.msWordItalic();
        const fileName = bold && italic ?
            `${this.fontFamily}z` :
            `${this.fontFamily}${bold ? 'b' : ''}${italic ? 'i' : ''}`;
        const resultUrls = [];
        let unicuePath = null;
        const fontNameWithExt = FONT_NAME_TO_FILE_NAME[fileName];
        if (fontNameWithExt) {
            unicuePath = baseUrl + fontNameWithExt;
            resultUrls.push(unicuePath);
        }
        const addPath = extension => {
            const p = `${baseUrl}${fileName}.${extension}`;
            if (p !== unicuePath)
                resultUrls.push(p);
        };
        addPath('woff');
        addPath('ttf');
        addPath('ttc');
        return resultUrls;
    }
    static createDefault(fontFamily, flag) {
        const desc = new FontFaceDescriptors();
        if (flag.get(ControlFontType.Bold))
            desc.weight = 'bold';
        if (flag.get(ControlFontType.Italic))
            desc.style = 'italic';
        return new ControlFont(fontFamily, desc);
    }
}
