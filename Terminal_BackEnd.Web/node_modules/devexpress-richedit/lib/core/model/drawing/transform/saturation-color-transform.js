import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class SaturationColorTransform extends ColorTransformValueBase {
    clone() {
        return new SaturationColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applySaturation(this.value).toRgb();
    }
}
