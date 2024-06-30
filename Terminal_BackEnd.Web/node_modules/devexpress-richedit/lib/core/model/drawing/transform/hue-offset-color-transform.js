import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class HueOffsetColorTransform extends ColorTransformValueBase {
    clone() {
        return new HueOffsetColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applyHueOffset(this.value).toRgb();
    }
}
