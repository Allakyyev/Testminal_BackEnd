import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class RedModulationColorTransform extends ColorTransformValueBase {
    clone() {
        return new RedModulationColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(this.applyRGBModulation(ColorUtils.getRed(color)), ColorUtils.getGreen(color), ColorUtils.getBlue(color));
    }
}
