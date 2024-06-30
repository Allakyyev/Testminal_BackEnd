import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class LuminanceColorTransform extends ColorTransformValueBase {
    clone() {
        return new LuminanceColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applyLuminance(this.value).toRgb();
    }
}
