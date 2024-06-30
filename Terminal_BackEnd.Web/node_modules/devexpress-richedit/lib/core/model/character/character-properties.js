import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { ColorHelper } from '../color/color';
import { ColorModelInfo } from '../color/color-model-info';
import { ShadingInfo } from '../shadings/shading-info';
import { ShadingPattern } from '../shadings/shading-pattern';
import { CompositeFontInfo } from './composite-font-info';
import { CharacterFormattingScript, CharacterPropertiesMask, StrikeoutType, UnderlineType } from './enums';
import { LangInfo } from './lang-info';
import { LayoutCharacterPropertiesColorInfo } from './layout-character-properties-color-info';
export class CharacterProperties {
    constructor() {
        this.measurerSizes = Object.create(null);
        this.fontSize = 11;
        this.fontBold = false;
        this.fontItalic = false;
        this.fontInfo = null;
        this.script = CharacterFormattingScript.Normal;
        this.fontStrikeoutType = StrikeoutType.None;
        this.fontUnderlineType = UnderlineType.None;
        this.allCaps = false;
        this.smallCaps = false;
        this.underlineWordsOnly = false;
        this.strikeoutWordsOnly = false;
        this.noProof = false;
        this.hidden = false;
        this.langInfo = new LangInfo();
        this.compositeFontInfo = new CompositeFontInfo();
        this.textColor = ColorModelInfo.nullColor;
        this.shadingInfo = ShadingInfo.nullColor;
        this.highlightColor = ColorModelInfo.nullColor;
        this.strikeoutColor = ColorModelInfo.nullColor;
        this.underlineColor = ColorModelInfo.nullColor;
    }
    calculateHash() {
        return this.fontSize ^
            MathUtils.somePrimes[0] * boolToInt(this.fontBold) ^
            MathUtils.somePrimes[1] * boolToInt(this.fontItalic) ^
            MathUtils.somePrimes[2] * this.shadingInfo.getHashCode() ^
            MathUtils.somePrimes[3] * this.textColor.getHashCode() ^
            MathUtils.somePrimes[4] * this.highlightColor.getHashCode();
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.fontBold == obj.fontBold &&
            this.fontItalic == obj.fontItalic &&
            (this.fontInfo && obj.fontInfo && this.fontInfo.equals(obj.fontInfo)) &&
            this.fontSize == obj.fontSize &&
            this.script == obj.script &&
            this.fontStrikeoutType == obj.fontStrikeoutType &&
            this.fontUnderlineType == obj.fontUnderlineType &&
            this.allCaps == obj.allCaps &&
            this.smallCaps == obj.smallCaps &&
            this.underlineWordsOnly == obj.underlineWordsOnly &&
            this.strikeoutWordsOnly == obj.strikeoutWordsOnly &&
            this.noProof == obj.noProof &&
            this.hidden == obj.hidden &&
            this.shadingInfo.equals(obj.shadingInfo) &&
            this.textColor.equals(obj.textColor) &&
            this.highlightColor.equals(obj.highlightColor) &&
            this.strikeoutColor.equals(obj.strikeoutColor) &&
            this.underlineColor.equals(obj.underlineColor) &&
            (this.langInfo && obj.langInfo && this.langInfo.equals(obj.langInfo)) &&
            (this.compositeFontInfo && this.compositeFontInfo.equals(obj.compositeFontInfo));
    }
    clone() {
        var result = new CharacterProperties();
        result.copyFrom(this);
        return result;
    }
    copyFrom(obj) {
        this.fontInfo = obj.fontInfo;
        this.fontSize = obj.fontSize;
        this.fontBold = obj.fontBold;
        this.fontItalic = obj.fontItalic;
        this.script = obj.script;
        this.fontStrikeoutType = obj.fontStrikeoutType;
        this.fontUnderlineType = obj.fontUnderlineType;
        this.allCaps = obj.allCaps;
        this.smallCaps = obj.smallCaps;
        this.underlineWordsOnly = obj.underlineWordsOnly;
        this.strikeoutWordsOnly = obj.strikeoutWordsOnly;
        this.noProof = obj.noProof;
        this.hidden = obj.hidden;
        this.shadingInfo = obj.shadingInfo ? obj.shadingInfo.clone() : new ShadingInfo(ShadingPattern.Clear, ColorModelInfo.noColor, ColorModelInfo.noColor);
        this.textColor = obj.textColor ? obj.textColor.clone() : ColorModelInfo.noColor;
        this.highlightColor = obj.highlightColor ? obj.highlightColor.clone() : ColorModelInfo.noColor;
        this.strikeoutColor = obj.strikeoutColor ? obj.strikeoutColor.clone() : ColorModelInfo.noColor;
        this.underlineColor = obj.underlineColor ? obj.underlineColor.clone() : ColorModelInfo.noColor;
        this.langInfo = obj.langInfo ? obj.langInfo.clone() : new LangInfo();
        this.compositeFontInfo = obj.compositeFontInfo ? obj.compositeFontInfo.clone() : new CompositeFontInfo();
        this.clearSizes();
    }
    getSize(text) {
        return this.measurerSizes[text];
    }
    setSize(text, size) {
        this.measurerSizes[text] = size;
    }
    clearSizes() {
        this.measurerSizes = Object.create(null);
    }
    linkMeasurerSizes(obj) {
        this.measurerSizes = obj.measurerSizes;
    }
    getLayoutColorInfo(colorProvider) {
        return new LayoutCharacterPropertiesColorInfo(this.textColor.toRgb(colorProvider), CharacterProperties.getActualBackgroundColor(this, colorProvider), this.strikeoutColor.toRgb(colorProvider), this.underlineColor.toRgb(colorProvider));
    }
    static getActualBackgroundColor(charProps, colorProvider) {
        const backColor = charProps.shadingInfo.getActualColor(colorProvider);
        const highlightColor = charProps.highlightColor.toRgb(colorProvider);
        return EnumUtils.isAnyOf(highlightColor, ColorHelper.NO_COLOR, ColorHelper.AUTOMATIC_COLOR) ? backColor : highlightColor;
    }
}
export class MaskedCharacterProperties extends CharacterProperties {
    constructor() {
        super(...arguments);
        this.useValue = 0;
        this.useValueExt = 0;
    }
    calculateHash() {
        return super.calculateHash() +
            MathUtils.somePrimes[15] * this.useValue +
            MathUtils.somePrimes[16] * this.useValueExt;
    }
    getUseValue(value) {
        if (value >= MaskedCharacterProperties.denominator)
            return (this.useValueExt & this.getHighPartUseValue(value)) != 0;
        return (this.useValue & this.getLowPartUseValue(value)) != 0;
    }
    setUseValue(mask, value) {
        if (value) {
            this.useValue |= this.getLowPartUseValue(mask);
            this.useValueExt |= this.getHighPartUseValue(mask);
        }
        else {
            this.useValue &= ~this.getLowPartUseValue(mask);
            this.useValueExt &= ~this.getHighPartUseValue(mask);
        }
    }
    setUseValueFull(value) {
        this.useValue = this.getLowPartUseValue(value);
        this.useValueExt = this.getHighPartUseValue(value);
    }
    getLowPartUseValue(value) {
        return value | 0;
    }
    getHighPartUseValue(value) {
        if (value < MaskedCharacterProperties.denominator)
            return 0;
        if (!Math.trunc) {
            Math.trunc = function (v) {
                v = +v;
                if (!isFinite(v))
                    return v;
                return (v - v % 1) || (v < 0 ? -0 : v === 0 ? v : 0);
            };
        }
        return Math.trunc(value / MaskedCharacterProperties.denominator);
    }
    getUseValueFull() {
        return this.useValue + this.useValueExt * MaskedCharacterProperties.denominator;
    }
    resetAllUse() {
        this.setUseValue(CharacterPropertiesMask.UseAll, false);
    }
    setAllUse() {
        this.setUseValue(CharacterPropertiesMask.UseAll, true);
    }
    clone() {
        var result = new MaskedCharacterProperties();
        result.copyFrom(this);
        return result;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.useValue = obj.useValue;
        this.useValueExt = obj.useValueExt;
    }
    equals(obj) {
        return super.equals(obj)
            && this.useValue == obj.useValue
            && this.useValueExt == obj.useValueExt;
    }
    static createDefault(model) {
        const prop = model.defaultCharacterProperties.clone();
        prop.useValue = 0;
        prop.useValueExt = 0;
        return prop;
    }
    setValue(desc, value) {
        desc.setProp(this, value);
        this.setUseValue(desc.maskValue(), true);
    }
}
MaskedCharacterProperties.denominator = 4294967296;
