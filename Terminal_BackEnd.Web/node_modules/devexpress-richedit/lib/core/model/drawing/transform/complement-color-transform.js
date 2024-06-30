import { ColorHSL } from '../../color/color-hsl';
import { ColorTransformBase } from './color-transform-base';
export class ComplementColorTransform extends ColorTransformBase {
    clone() {
        return new ComplementColorTransform();
    }
    applyTransform(color) {
        return ColorHSL.fromColorRGB(color).getComplementColor().toRgb();
    }
    equals(obj) {
        return obj &&
            obj instanceof ComplementColorTransform;
    }
}
