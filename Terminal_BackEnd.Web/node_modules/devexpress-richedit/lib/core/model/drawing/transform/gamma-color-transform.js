import { ColorTransformBase } from './color-transform-base';
export class GammaColorTransform extends ColorTransformBase {
    clone() {
        return new GammaColorTransform();
    }
    applyTransform(color) {
        return this.applyDefaultGamma(color);
    }
    equals(obj) {
        return obj &&
            obj instanceof GammaColorTransform;
    }
}
