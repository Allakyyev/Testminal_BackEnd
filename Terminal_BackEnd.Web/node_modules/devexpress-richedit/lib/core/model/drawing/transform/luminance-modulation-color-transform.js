import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class LuminanceModulationColorTransform extends ColorTransformValueBase {
    clone() {
        return new LuminanceModulationColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applyLuminanceMod(this.value).toRgb();
    }
}
