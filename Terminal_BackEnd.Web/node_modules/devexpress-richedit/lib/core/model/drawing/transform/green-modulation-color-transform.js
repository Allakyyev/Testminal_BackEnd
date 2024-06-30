import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class GreenModulationColorTransform extends ColorTransformValueBase {
    clone() {
        return new GreenModulationColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(ColorUtils.getRed(color), this.applyRGBModulation(ColorUtils.getGreen(color)), ColorUtils.getBlue(color));
    }
}
