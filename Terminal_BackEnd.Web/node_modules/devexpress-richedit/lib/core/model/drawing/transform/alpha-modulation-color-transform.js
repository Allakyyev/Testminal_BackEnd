import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DXColor } from '../../color/dx-color';
import { DrawingValueConstants } from '../drawing-value-constants';
import { ColorTransformValueBase } from './color-transform-value-base';
export class AlphaModulationColorTransform extends ColorTransformValueBase {
    clone() {
        return new AlphaModulationColorTransform(this.value);
    }
    applyTransform(color) {
        const normalAlpha = this.toDoubleValue(ColorUtils.getAlpha(color)) * this.value / DrawingValueConstants.ThousandthOfPercentage;
        return DXColor.fromArgb(this.toIntValue(normalAlpha), color);
    }
}
