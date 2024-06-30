import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformValueBase } from './color-transform-value-base';
export class RedColorTransform extends ColorTransformValueBase {
    clone() {
        return new RedColorTransform(this.value);
    }
    applyTransform(color) {
        return DXColor.fromRgb(this.getRGBFromValue(), ColorUtils.getGreen(color), ColorUtils.getBlue(color));
    }
}
