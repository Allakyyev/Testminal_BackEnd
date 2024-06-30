import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { DrawingValueConstants } from '../drawing-value-constants';
import { ColorTransformValueBase } from './color-transform-value-base';
export class ShadeColorTransform extends ColorTransformValueBase {
    clone() {
        return new ShadeColorTransform(this.value);
    }
    applyTransform(color) {
        const normalShade = this.value / DrawingValueConstants.ThousandthOfPercentage;
        const r = this.applyRGBModulationCore(ColorUtils.getRed(color), normalShade);
        const g = this.applyRGBModulationCore(ColorUtils.getGreen(color), normalShade);
        const b = this.applyRGBModulationCore(ColorUtils.getBlue(color), normalShade);
        return DXColor.fromRgb(r, g, b);
    }
}
