import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { ColorTransformBase } from './color-transform-base';
export class GrayscaleColorTransform extends ColorTransformBase {
    clone() {
        return new GrayscaleColorTransform();
    }
    applyTransform(color) {
        const gray = Math.round(0.3 * ColorUtils.getRed(color) + 0.59 * ColorUtils.getGreen(color) + 0.11 * ColorUtils.getBlue(color) + 0.5);
        return DXColor.fromRgb(gray, gray, gray);
    }
    equals(obj) {
        return obj &&
            obj instanceof GrayscaleColorTransform;
    }
}
