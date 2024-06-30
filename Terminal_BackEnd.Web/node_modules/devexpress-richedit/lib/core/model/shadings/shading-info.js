import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { ColorModelInfo } from '../color/color-model-info';
import { JSONShadingInfoConverter } from '../json/importers/json-shading-info-converter';
import { ShadingPattern } from './shading-pattern';
import { ShadingHelper } from './shading-pattern-helper';
export class ShadingInfo {
    constructor(shadingPattern, backColor, foreColor) {
        this.shadingPattern = shadingPattern;
        this.backColor = backColor;
        this.foreColor = foreColor;
    }
    static get noColor() { return ShadingInfo.createByColor(ColorModelInfo.noColor); }
    static get auto() { return ShadingInfo.createByColor(ColorModelInfo.auto); }
    static get nullColor() { return ShadingInfo.createByColor(ColorModelInfo.makeByColor(0)); }
    static createByColor(backColor) {
        return new ShadingInfo(ShadingPattern.Clear, backColor, ColorModelInfo.nullColor);
    }
    static createByFullData(cache, pattern, fill, patternColor) {
        return new ShadingInfo(pattern, cache.getItem(ColorModelInfo.makeByColor(fill)), cache.getItem(ColorModelInfo.makeByColor(patternColor)));
    }
    getActualColor(colorProvider) {
        const fill = this.backColor.toRgb(colorProvider);
        const patternColor = this.foreColor.toRgb(colorProvider);
        return ShadingHelper.getActualBackColor(fill, patternColor, this.shadingPattern);
    }
    equals(obj) {
        return obj &&
            this.shadingPattern == obj.shadingPattern &&
            this.backColor.equals(obj.backColor) &&
            this.foreColor.equals(obj.foreColor);
    }
    static equalsBinary(a, b) {
        return a && b && (a === b ||
            a.shadingPattern == b.shadingPattern &&
                a.backColor.equals(b.backColor) &&
                a.foreColor.equals(b.foreColor));
    }
    clone() {
        return new ShadingInfo(this.shadingPattern, this.backColor, this.foreColor);
    }
    calculateHash() {
        return MathUtils.somePrimes[0] * this.shadingPattern ^
            MathUtils.somePrimes[1] * this.backColor.getHashCode() ^
            MathUtils.somePrimes[2] * this.foreColor.getHashCode();
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    toJSON() {
        return JSONShadingInfoConverter.convertToJSON(this);
    }
}
