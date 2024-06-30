import { Errors } from '@devexpress/utils/lib/errors';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { JSONColorModelInfoProperty } from '../json/enums/json-character-enums';
import { ColorHelper } from './color';
import { ColorHSL } from './color-hsl';
import { DXColor } from './dx-color';
import { ColorType, ThemeColorIndexConstants, ThemeColorValues } from './enums';
export class ColorModelInfo {
    constructor() {
        this._themeColorIndex = ThemeColorIndexConstants.None;
        this._themeValue = ThemeColorValues.None;
        this._colorIndex = ColorModelInfo.defaultColorIndex;
        this.restoreDefaultValues();
    }
    static get nullColor() { return ColorModelInfo.makeByColor(ColorHelper.AUTOMATIC_COLOR); }
    ;
    static makeByThemeColorIndex(themeColorIndex, tint = 0) {
        const result = new ColorModelInfo();
        result.themeColorIndex = themeColorIndex;
        result.tint = tint;
        return result;
    }
    static makeByColor(color, tint = 0) {
        const result = new ColorModelInfo();
        result.rgb = color;
        result.tint = tint;
        return result;
    }
    static makeByColorIndex(colorIndex, tint = 0) {
        const result = new ColorModelInfo();
        result.colorIndex = colorIndex;
        result.tint = tint;
        return result;
    }
    get colorType() { return this._colorType; }
    get rgb() { return this._rgb; }
    set rgb(value) {
        this.setColorType(ColorType.Rgb);
        if (this._rgb != value)
            this._rgb = value;
    }
    get themeColorIndex() { return this._themeColorIndex; }
    set themeColorIndex(value) {
        this.setColorType(ColorType.Theme);
        if (this._themeColorIndex != value)
            this._themeColorIndex = value;
    }
    get themeValue() { return this._themeValue; }
    set themeValue(value) {
        this.setColorType(ColorType.Theme);
        if (this._themeValue != value)
            this._themeValue = value;
    }
    get colorIndex() { return this._colorIndex; }
    set colorIndex(value) {
        this.setColorType(ColorType.Index);
        if (this._colorIndex != value)
            this._colorIndex = value;
    }
    get tint() { return this._tint; }
    set tint(value) {
        if (Math.abs(value) > 1)
            throw new Error(Errors.InternalException);
        this._tint = value;
    }
    get isEmpty() { return this.colorType == ColorType.Rgb && DXColor.isTransparentOrEmpty(this.rgb); }
    restoreDefaultValues() {
        this._themeColorIndex = ThemeColorIndexConstants.None;
        this._themeValue = ThemeColorValues.None;
        this._colorIndex = ColorModelInfo.defaultColorIndex;
        this._rgb = DXColor.empty;
        this._colorType = ColorType.Rgb;
        this._tint = 0;
    }
    setColorType(colorType) {
        if (this._colorType != colorType) {
            this.restoreDefaultValues();
            this._colorType = colorType;
        }
    }
    static makeAuto() {
        const result = new ColorModelInfo();
        result.setColorType(ColorType.Auto);
        return result;
    }
    toRgb(colorProvider) {
        let color = DXColor.empty;
        switch (this.colorType) {
            case ColorType.Index:
                if (this.colorIndex != ColorModelInfo.defaultColorIndex) {
                    color = colorProvider.palette.getColorByIndex(this.colorIndex);
                    if (ColorUtils.getAlpha(color) == 0)
                        color = DXColor.fromArgb(255, color);
                }
                break;
            case ColorType.Theme:
                if (this.themeColorIndex != ThemeColorIndexConstants.None)
                    color = colorProvider.officeTheme.colors.getColorByThemeColorIndex(colorProvider, this.themeColorIndex);
                break;
            case ColorType.Rgb:
                color = this.rgb;
                break;
        }
        return ColorHSL.calculateColorRGB(color, this.tint);
    }
    clone() {
        const result = new ColorModelInfo();
        result.copyFrom(this);
        return result;
    }
    copyFrom(value) {
        this._themeColorIndex = value.themeColorIndex;
        this._themeValue = value.themeValue;
        this._colorIndex = value.colorIndex;
        this._rgb = value.rgb;
        this._colorType = value.colorType;
        this.tint = value.tint;
    }
    equals(info) {
        return info &&
            this._colorType == info.colorType &&
            this.rgb == info.rgb &&
            this.themeColorIndex == info.themeColorIndex &&
            this.colorIndex == info.colorIndex &&
            this.tint == info.tint &&
            this.themeValue == info.themeValue;
    }
    static equalsBinary(a, b) {
        return a && b && (a === b ||
            a._colorType == b._colorType &&
                a._rgb == b._rgb &&
                a._colorIndex == b._colorIndex &&
                a._themeColorIndex == b._themeColorIndex &&
                a._tint == b._tint &&
                a._themeValue == b._themeValue);
    }
    calculateHash() {
        let hash = MathUtils.somePrimes[0] * this._colorType;
        if (this._rgb !== undefined)
            hash ^= MathUtils.somePrimes[1] * this._rgb;
        if (this._tint !== undefined)
            hash ^= MathUtils.somePrimes[2] * this._tint;
        if (this._colorIndex !== undefined)
            hash ^= MathUtils.somePrimes[3] * this._colorIndex;
        if (this._themeColorIndex !== undefined)
            hash ^= MathUtils.somePrimes[4] * this._themeColorIndex;
        return hash;
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    toJSON() {
        const result = {};
        result[JSONColorModelInfoProperty.ColorType] = this.colorType;
        result[JSONColorModelInfoProperty.Tint] = this.tint;
        result[JSONColorModelInfoProperty.ColorIndex] = this.colorIndex;
        result[JSONColorModelInfoProperty.ThemeColorIndex] = this.themeColorIndex;
        result[JSONColorModelInfoProperty.Rgb] = this.rgb;
        return result;
    }
    toDebugString() {
        return `type: ${ColorType[this.colorType]}, rgb ${this.rgb}, themeColorIndex: ${this.themeColorIndex}, themeValue: ${this.themeValue}`;
    }
}
ColorModelInfo.defaultColorIndex = -1;
ColorModelInfo.empty = new ColorModelInfo();
ColorModelInfo.auto = ColorModelInfo.makeAuto();
ColorModelInfo.autoColor = ColorModelInfo.makeByColor(ColorHelper.AUTOMATIC_COLOR);
ColorModelInfo.noColor = ColorModelInfo.makeByColor(ColorHelper.NO_COLOR);
