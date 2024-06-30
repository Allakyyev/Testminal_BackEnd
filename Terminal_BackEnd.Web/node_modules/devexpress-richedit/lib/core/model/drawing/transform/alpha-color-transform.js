import { DXColor } from '../../color/dx-color';
import { DrawingValueConstants } from '../drawing-value-constants';
import { ColorTransformValueBase } from './color-transform-value-base';
export class AlphaColorTransform extends ColorTransformValueBase {
    static createFromAlpha(alpha) {
        return new AlphaColorTransform(Math.floor(alpha * DrawingValueConstants.ThousandthOfPercentage / 255.0));
    }
    applyTransform(color) {
        return DXColor.fromArgb(this.toIntValue(this.value / DrawingValueConstants.ThousandthOfPercentage), color);
    }
    clone() {
        return new AlphaColorTransform(this.value);
    }
}
