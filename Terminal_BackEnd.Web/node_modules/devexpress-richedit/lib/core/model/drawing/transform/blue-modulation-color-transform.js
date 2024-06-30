import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class BlueModulationColorTransform extends ColorTransformValueBase {
    clone() {
        return new BlueModulationColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(ColorUtils.getRed(color), ColorUtils.getGreen(color), this.applyRGBModulation(ColorUtils.getBlue(color)));
    }
}
