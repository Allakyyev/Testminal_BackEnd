import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class GreenOffsetColorTransform extends ColorTransformValueBase {
    clone() {
        return new GreenOffsetColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(ColorUtils.getRed(color), this.applyRGBOffset(ColorUtils.getGreen(color)), ColorUtils.getBlue(color));
    }
}
