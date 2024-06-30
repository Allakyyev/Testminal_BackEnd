import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { DXColor } from '../../color/dx-color';
export class ColorTransformBase {
    applyInverseDefaultGamma(normalRgb) {
        if (normalRgb < 0)
            return 0;
        if (normalRgb <= 0.04045)
            return normalRgb / 12.92;
        if (normalRgb < 1)
            return Math.pow((normalRgb + 0.055) / 1.055, 2.4);
        return 1;
    }
    applyInverseDefaultGammaByColor(color) {
        return DXColor.fromRgb(this.toIntValue(this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getRed(color)))), this.toIntValue(this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getGreen(color)))), this.toIntValue(this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getBlue(color)))));
    }
    applyDefaultGamma(normalRgb) {
        if (normalRgb < 0)
            return 0;
        if (normalRgb <= 0.0031308)
            return normalRgb * 12.92;
        if (normalRgb < 1)
            return 1.055 * Math.pow(normalRgb, 1.0 / 2.4) - 0.055;
        return 1;
    }
    applyDefaultGammaByColor(color) {
        return DXColor.fromRgb(this.toIntValue(this.applyDefaultGamma(this.toDoubleValue(ColorUtils.getRed(color)))), this.toIntValue(this.applyDefaultGamma(this.toDoubleValue(ColorUtils.getGreen(color)))), this.toIntValue(this.applyDefaultGamma(this.toDoubleValue(ColorUtils.getBlue(color)))));
    }
    toDoubleValue(value) {
        return value / 255.0;
    }
    toIntValue(value) {
        return this.getFixRGBValue(Math.round(255 * value));
    }
    getFixRGBValue(rgb) {
        return MathUtils.restrictValue(rgb, 0, 255);
    }
}
