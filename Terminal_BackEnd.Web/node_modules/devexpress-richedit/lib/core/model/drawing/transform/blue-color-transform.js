import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class BlueColorTransform extends ColorTransformValueBase {
    clone() {
        return new BlueColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(ColorUtils.getRed(color), ColorUtils.getGreen(color), this.getRGBFromValue());
    }
}
