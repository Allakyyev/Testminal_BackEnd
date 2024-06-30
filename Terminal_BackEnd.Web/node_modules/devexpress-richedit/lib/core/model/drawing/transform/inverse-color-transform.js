import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformBase } from './color-transform-base';
export class InverseColorTransform extends ColorTransformBase {
    clone() {
        return new InverseColorTransform();
    }
    applyTransform(color) {
        const r = this.toIntValue(this.applyDefaultGamma(1 - (this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getRed(color))))));
        const g = this.toIntValue(this.applyDefaultGamma(1 - (this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getGreen(color))))));
        const b = this.toIntValue(this.applyDefaultGamma(1 - (this.applyInverseDefaultGamma(this.toDoubleValue(ColorUtils.getBlue(color))))));
        return DXColor.fromRgb(r, g, b);
    }
    equals(obj) {
        return obj &&
            obj instanceof InverseColorTransform;
    }
}
