import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class LuminanceOffsetColorTransform extends ColorTransformValueBase {
    clone() {
        return new LuminanceOffsetColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applyLuminanceOffset(this.value).toRgb();
    }
}
