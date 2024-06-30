import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class HueModulationColorTransform extends ColorTransformValueBase {
    clone() {
        return new HueModulationColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applyHueMod(this.value).toRgb();
    }
}
