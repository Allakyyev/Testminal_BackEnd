import { Errors } from '@devexpress/utils/lib/errors';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { Log } from '../../rich-utils/debug/logger/base-logger/log';
import { DrawingValueConstants } from '../drawing/drawing-value-constants';
import { DXColor } from './dx-color';
export class ColorHSL {
    constructor(hue, saturation, luminance) {
        if (Log.isEnabled && !(hue <= 1 && hue >= 0 && saturation <= 1 && saturation >= 0 && luminance <= 1 && luminance >= 0))
            throw new Error(Errors.InternalException);
        this._hue = hue;
        this._saturation = saturation;
        this._luminance = luminance;
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this._hue ^
            MathUtils.somePrimes[0] * this._luminance ^
            MathUtils.somePrimes[0] * this._saturation;
    }
    static makeFromHSL(hue, saturation, luminance) {
        return new ColorHSL(hue / ColorHSL.MaxAngle, saturation / ColorHSL.MaxThousandthOfPercentage, luminance / ColorHSL.MaxThousandthOfPercentage);
    }
    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0;
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, l];
    }
    static fromColorRGB(color) {
        const r = ColorUtils.getRed(color) / 255;
        const g = ColorUtils.getGreen(color) / 255;
        const b = ColorUtils.getBlue(color) / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h;
        let s;
        const l = (max + min) / 2;
        if (max == min) {
            s = 0;
            h = 4.0 / 6.0;
        }
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return new ColorHSL(h, s, l);
    }
    static calculateColorRGB(color, tint) {
        if (color == DXColor.empty || tint == 0)
            return color;
        return ColorHSL.fromColorRGB(color).applyTint(tint).toRgb();
    }
    toRgb() {
        const value1 = (this._luminance < 0.5) ?
            this._luminance * (1 + this._saturation) :
            this._luminance + this._saturation - this._luminance * this._saturation;
        const value2 = 2 * this._luminance - value1;
        const rgb = ListUtils.map([this._hue + 1.0 / 3.0, this._hue, this._hue - 1.0 / 3.0], (value) => {
            if (value < 0)
                value += 1;
            if (value > 1)
                value -= 1;
            if (6 * value < 1)
                value = value2 + ((value1 - value2) * 6 * value);
            else if (6 * value >= 1 && 6 * value < 3)
                value = value1;
            else if (6 * value >= 3 && 6 * value < 4)
                value = value2 + ((value1 - value2) * (4 - 6 * value));
            else
                value = value2;
            return this.toIntValue(value);
        });
        return DXColor.fromRgb(rgb[0], rgb[1], rgb[2]);
    }
    get hue() { return this.getIntValue(this._hue, ColorHSL.MaxAngle); }
    ;
    set hue(value) { this._hue = this.getFloatValue(this.getValidValue(value), ColorHSL.MaxAngle); }
    get saturation() { return this.getIntValue(this._saturation, ColorHSL.MaxThousandthOfPercentage); }
    ;
    set saturation(value) { this._saturation = this.getFloatValue(this.getValidValue(value), ColorHSL.MaxThousandthOfPercentage); }
    get luminance() { return this.getIntValue(this._luminance, ColorHSL.MaxThousandthOfPercentage); }
    ;
    set luminance(value) { this._luminance = this.getFloatValue(this.getValidValue(value), ColorHSL.MaxThousandthOfPercentage); }
    get floatHue() { return this._hue; }
    ;
    set floatHue(value) { this._hue = this.getValidValue(value); }
    get floatSaturation() { return this._saturation; }
    ;
    set floatSaturation(value) { this._saturation = this.getValidValue(value); }
    get floatLuminance() { return this._luminance; }
    ;
    set floatLuminance(value) { this._luminance = this.getValidValue(value); }
    getComplementColor() {
        this._hue += this._hue > 0.5 ? -0.5 : 0.5;
        return this;
    }
    applyHue(value) {
        this.floatHue = value / ColorHSL.MaxAngle;
        return this;
    }
    applyHueMod(value) {
        this._hue = this._hue * value / ColorHSL.MaxThousandthOfPercentage;
        this.fixHue();
        return this;
    }
    applyHueOffset(value) {
        this._hue += value / ColorHSL.MaxAngle;
        this.fixHue();
        return this;
    }
    applySaturation(value) {
        this.floatSaturation = value / ColorHSL.MaxThousandthOfPercentage;
        return this;
    }
    applySaturationMod(value) {
        this._saturation = this._saturation * value / ColorHSL.MaxThousandthOfPercentage;
        return this;
    }
    applySaturationOffset(value) {
        this._saturation += value / ColorHSL.MaxThousandthOfPercentage;
        return this;
    }
    applyLuminance(value) {
        this.floatLuminance = value / ColorHSL.MaxThousandthOfPercentage;
        return this;
    }
    applyLuminanceMod(value) {
        this._luminance = this._luminance * value / ColorHSL.MaxThousandthOfPercentage;
        return this;
    }
    applyLuminanceOffset(value) {
        this._luminance += value / ColorHSL.MaxThousandthOfPercentage;
        return this;
    }
    fixHue() {
        if (this._hue > 1)
            this._hue -= Math.floor(this._hue);
    }
    toIntValue(value) {
        return this.fixIntValue(Math.round(255 * value));
    }
    fixIntValue(value) {
        return MathUtils.restrictValue(value, 0, 255);
    }
    getIntValue(value, maxValue) {
        return Math.round(value * maxValue);
    }
    getFloatValue(value, maxValue) {
        return value / maxValue;
    }
    getValidValue(value) {
        return MathUtils.restrictValue(value, 0, 1);
    }
    applyTint(tint) {
        if (tint < 0)
            this._luminance *= (1 + tint);
        else if (tint > 0)
            this._luminance = this._luminance * (1 - tint) + tint;
        return this;
    }
    equals(obj) {
        return obj &&
            this._hue == obj._hue &&
            this._saturation == obj._saturation &&
            this._luminance == obj._luminance;
    }
}
ColorHSL.MaxAngle = DrawingValueConstants.MaxPositiveFixedAngle;
ColorHSL.MaxThousandthOfPercentage = DrawingValueConstants.ThousandthOfPercentage;
ColorHSL.defaultValue = new ColorHSL(0, 0, 0);
