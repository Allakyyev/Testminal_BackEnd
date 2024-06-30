import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class SaturationOffsetColorTransform extends ColorTransformValueBase {
    clone() {
        return new SaturationOffsetColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applySaturationOffset(this.value).toRgb();
    }
}
