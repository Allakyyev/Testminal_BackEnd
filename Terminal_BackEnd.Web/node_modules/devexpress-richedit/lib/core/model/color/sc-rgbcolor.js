import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { DrawingValueConstants } from '../drawing/drawing-value-constants';
import { DXColor } from './dx-color';
export class ScRGBColor {
    constructor(scR, scG, scB) {
        this._scR = scR;
        this._scG = scG;
        this._scB = scB;
    }
    get scR() { return this._scR; }
    set scR(value) { this._scR = this.getValidValue(value); }
    get scG() { return this._scG; }
    set scG(value) { this._scG = this.getValidValue(value); }
    get scB() { return this._scB; }
    set scB(value) { this._scB = this.getValidValue(value); }
    calculateHash() {
        return MathUtils.somePrimes[0] * this._scR ^
            MathUtils.somePrimes[1] * this._scG ^
            MathUtils.somePrimes[2] * this._scB;
    }
    toRgb() {
        let r = this._scR * 1.0 / DrawingValueConstants.ThousandthOfPercentage;
        let g = this._scG * 1.0 / DrawingValueConstants.ThousandthOfPercentage;
        let b = this._scB * 1.0 / DrawingValueConstants.ThousandthOfPercentage;
        const a = 0.055;
        r = (r <= 0.0031308) ? 12.92 * r : (1 + a) * Math.pow(r, 1 / 2.4) - a;
        g = (g <= 0.0031308) ? 12.92 * g : (1 + a) * Math.pow(g, 1 / 2.4) - a;
        b = (b <= 0.0031308) ? 12.92 * b : (1 + a) * Math.pow(b, 1 / 2.4) - a;
        r *= 255;
        g *= 255;
        b *= 255;
        return DXColor.fromRgb(Math.round(r), Math.round(g), Math.round(b));
    }
    getValidValue(value) {
        return (value < 0) ? 0 : value;
    }
    equals(obj) {
        return obj &&
            this._scR == obj._scR &&
            this._scG == obj._scG &&
            this._scB == obj._scB;
    }
}
ScRGBColor.defaultValue = new ScRGBColor(0, 0, 0);
