import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformValueBase } from './color-transform-value-base';
export class SaturationModulationColorTransform extends ColorTransformValueBase {
    clone() {
        return new SaturationModulationColorTransform(this.value);
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).applySaturationMod(this.value).toRgb();
    }
}
