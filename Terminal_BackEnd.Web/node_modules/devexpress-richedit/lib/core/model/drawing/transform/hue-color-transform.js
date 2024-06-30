import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class HueColorTransform extends ColorTransformValueBase {
    clone() {
        return new HueColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applyHue(this.value).toRgb();
    }
}
