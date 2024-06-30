import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class RedOffsetColorTransform extends ColorTransformValueBase {
    clone() {
        return new RedOffsetColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(this.applyRGBOffset(ColorUtils.getRed(color)), ColorUtils.getGreen(color), ColorUtils.getBlue(color));
    }
}
