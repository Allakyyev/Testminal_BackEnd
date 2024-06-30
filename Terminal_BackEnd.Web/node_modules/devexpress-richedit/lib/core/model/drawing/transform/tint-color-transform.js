import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { DrawingValueConstants } from '../drawing-value-constants';
import { ColorTransformValueBase } from './color-transform-value-base';
export class TintColorTransform extends ColorTransformValueBase {
    clone() {
        return new TintColorTransform(this.value);
    }
    applyTransform(color) {
        const normalTint = 1 - this.value / DrawingValueConstants.ThousandthOfPercentage;
        const r = this.toIntValue(this.applyDefaultGamma(this.applyTintCore(this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getRed(color))), normalTint)));
        const g = this.toIntValue(this.applyDefaultGamma(this.applyTintCore(this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getGreen(color))), normalTint)));
        const b = this.toIntValue(this.applyDefaultGamma(this.applyTintCore(this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getBlue(color))), normalTint)));
        return DXColor.fromRgb(r, g, b);
    }
    applyTintCore(normalRgb, normalTint) {
        return normalTint > 0 ? normalRgb * (1 - normalTint) + normalTint : normalRgb * (1 + normalTint);
    }
}
