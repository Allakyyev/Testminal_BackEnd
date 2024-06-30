import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class GreenColorTransform extends ColorTransformValueBase {
    clone() {
        return new GreenColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(ColorUtils.getRed(color), this.getRGBFromValue(), ColorUtils.getBlue(color));
    }
}
