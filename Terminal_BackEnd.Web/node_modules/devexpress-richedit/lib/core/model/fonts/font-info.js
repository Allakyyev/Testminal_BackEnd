import { Flag } from '@devexpress/utils/lib/class/flag';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ControlFont } from './control-font';
export var ControlFontType;
(function (ControlFontType) {
    ControlFontType[ControlFontType["Regular"] = 0] = "Regular";
    ControlFontType[ControlFontType["Bold"] = 1] = "Bold";
    ControlFontType[ControlFontType["Italic"] = 2] = "Italic";
    ControlFontType[ControlFontType["BoldItalic"] = 3] = "BoldItalic";
})(ControlFontType || (ControlFontType = {}));
export class FontInfo {
    constructor(name) {
        this.controlFontMap = {
            [ControlFontType.Regular]: null,
            [ControlFontType.Bold]: null,
            [ControlFontType.Italic]: null,
            [ControlFontType.BoldItalic]: null
        };
        this.name = name;
        this.cssString = name;
        this.isLoad = true;
    }
    ensureAllControlFontsAssigned(controlFontsCache) {
        const fontFamily = this.getFontFamilies()[0];
        const ensureFontAssigned = (type) => {
            const fontKey = this.controlFontMap[type];
            if (!fontKey) {
                let controlFont = controlFontsCache.findSimularFontByType(fontFamily, type);
                if (!controlFont)
                    controlFont = controlFontsCache.addFont(ControlFont.createDefault(fontFamily, new Flag(type)));
                this.controlFontMap[type] = controlFont.cacheKey;
            }
        };
        ensureFontAssigned(ControlFontType.Regular);
        ensureFontAssigned(ControlFontType.Bold);
        ensureFontAssigned(ControlFontType.Italic);
        ensureFontAssigned(ControlFontType.BoldItalic);
    }
    getFontFamilies() {
        return DomUtils.getFontFamiliesFromCssString(this.cssString);
    }
    static calculateHashByName(name) {
        return StringUtils.stringHashCode(name.toLowerCase());
    }
    calculateHash() {
        return FontInfo.calculateHashByName(this.name);
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    copyFrom(obj) {
        this.name = obj.name;
        this.scriptMultiplier = obj.scriptMultiplier;
        this.canBeSet = obj.canBeSet;
        this.cssString = obj.cssString;
        this.subScriptOffset = obj.subScriptOffset;
        this.controlFontMap = NumberMapUtils.shallowCopy(obj.controlFontMap);
    }
    equals(obj) {
        return obj && this.name == obj.name &&
            this.scriptMultiplier == obj.scriptMultiplier;
    }
    static equalsBinary(fontInfoA, fontInfoB) {
        return fontInfoA && fontInfoB &&
            fontInfoA.name == fontInfoB.name &&
            fontInfoA.scriptMultiplier == fontInfoB.scriptMultiplier;
    }
    clone() {
        var obj = new FontInfo(null);
        obj.copyFrom(this);
        return obj;
    }
    getBaseLine() {
        if (this.baseLine === undefined)
            this.measure();
        return this.baseLine;
    }
    getHeightFactor() {
        if (this.heightFactor === undefined)
            this.measure();
        return this.heightFactor;
    }
    reset() {
        this.baseLine = undefined;
        this.heightFactor = undefined;
    }
    getAscent(boxHeight) {
        return this.getBaseLine() * boxHeight;
    }
    getDescent(boxHeight) {
        return boxHeight - this.getAscent(boxHeight);
    }
    measure() {
        const info = this.measurer.getFontMeasurerInfo(this);
        this.baseLine = info.baseLine;
        this.heightFactor = info.heightFactor;
    }
}
