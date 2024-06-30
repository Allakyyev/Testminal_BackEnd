import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { DrawingValueConstants } from '../drawing-value-constants';
import { ColorTransformBase } from './color-transform-base';
export class ColorTransformValueBase extends ColorTransformBase {
    constructor(value) {
        super();
        this.value = value;
    }
    equals(obj) {
        return obj &&
            obj instanceof ColorTransformValueBase &&
            this.value == obj.value;
    }
    getRGBFromValue() {
        const rgb = this.value / DrawingValueConstants.ThousandthOfPercentage;
        return this.toIntValue(this.applyDefaultGamma(rgb));
    }
    applyRGBOffsetNormalized(normalRgb, offset) {
        return this.getFixRGBNormalValue(normalRgb + offset);
    }
    applyRGBOffset(rgb) {
        var offset = this.value / DrawingValueConstants.ThousandthOfPercentage;
        return this.toIntValue(this.applyDefaultGamma(this.applyRGBOffsetNormalized(this.applyInverseDefaultGamma(this.toDoubleValue(rgb)), offset)));
    }
    applyRGBModulationNormalized(normalRgb, modulation) {
        return this.getFixRGBNormalValue(normalRgb * modulation);
    }
    applyRGBModulation(rgb) {
        const modulation = this.value / DrawingValueConstants.ThousandthOfPercentage;
        return this.applyRGBModulationCore(rgb, modulation);
    }
    getFixRGBNormalValue(rgb) {
        return MathUtils.restrictValue(rgb, 0, 1);
    }
    applyRGBModulationCore(rgb, modulation) {
        return this.toIntValue(this.applyDefaultGamma(this.applyRGBModulationNormalized(this.applyInverseDefaultGamma(this.toDoubleValue(rgb)), modulation)));
    }
}
