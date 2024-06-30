import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class BlueOffsetColorTransform extends ColorTransformValueBase {
    clone() {
        return new BlueOffsetColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(ColorUtils.getRed(color), ColorUtils.getGreen(color), this.applyRGBOffset(ColorUtils.getBlue(color)));
    }
}
