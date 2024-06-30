import { ColorTransformBase } from './color-transform-base';
export class InverseGammaColorTransform extends ColorTransformBase {
    clone() {
        return new InverseGammaColorTransform();
    }
    applyTransform(color) {
        return this.applyInverseDefaultGamma(color);
    }
    equals(obj) {
        return obj &&
            obj instanceof InverseGammaColorTransform;
    }
}
