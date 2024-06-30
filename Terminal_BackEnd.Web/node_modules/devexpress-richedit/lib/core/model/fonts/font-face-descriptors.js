import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class FontFaceDescriptors {
    constructor() {
        this.style = 'normal';
        this.weight = "normal";
        this.stretch = "normal";
        this.unicodeRange = "U+0-10FFFF";
        this.variant = "normal";
        this.featureSettings = "normal";
        this.variationSettings = "normal";
        this.display = "auto";
        this._cacheKey = null;
    }
    static get getDefaultUnicodeRange() { return new BoundaryInterval(0, 0x10FFFF); }
    msWordItalic() {
        return /^\s*(italic|oblique(\s+\w*)?)\s*$/i.test(this.style);
    }
    msWordBold() {
        if (typeof this.weight == "number")
            return this.weight >= 550;
        const numVal = parseInt(this.weight);
        if (!isNaN(numVal))
            return numVal >= 550;
        return /^\s*(bold|bolder)\s*$/i.test(this.weight);
    }
    get cacheKey() {
        if (!this._cacheKey)
            this._cacheKey = [
                this.style.toString() +
                    this.weight.toString() +
                    this.stretch.toString() +
                    this.unicodeRange.toString() +
                    this.variant.toString() +
                    this.featureSettings.toString() +
                    this.variationSettings.toString() +
                    this.display.toString()
            ].join('/');
        return this._cacheKey;
    }
    parseUnicodeRanges() {
        const ranges = this.unicodeRange ?
            ListUtils.reducedMap(this.unicodeRange.split(','), range => {
                const wildcardMatch = range.match(/U\+(\w*)(\?+)/i);
                let start = NaN;
                let end = NaN;
                if (wildcardMatch) {
                    const lenOfWildcard = wildcardMatch[2].length;
                    start = parseInt(wildcardMatch[1] + StringUtils.repeat('0', lenOfWildcard), 16);
                    end = parseInt(wildcardMatch[1] + StringUtils.repeat('F', lenOfWildcard), 16);
                }
                else {
                    const match = range.match(/U\+(\w+)-?(\w*)/i);
                    if (match) {
                        start = parseInt(match[1], 16);
                        end = match[2].length ? parseInt(match[2], 16) : start;
                    }
                }
                return !isNaN(start) && !isNaN(end) ? new BoundaryInterval(start, end + 1) : null;
            }) :
            [];
        return ranges.length ? ranges.sort() : [FontFaceDescriptors.getDefaultUnicodeRange];
    }
    static create(obj) {
        const result = new FontFaceDescriptors();
        if (!obj)
            return result;
        if (obj.style !== null && obj.style !== undefined)
            result.style = obj.style;
        if (obj.weight !== null && obj.weight !== undefined)
            result.weight = obj.weight;
        if (obj.stretch !== null && obj.stretch !== undefined)
            result.stretch = obj.stretch;
        if (obj.unicodeRange !== null && obj.unicodeRange !== undefined)
            result.unicodeRange = obj.unicodeRange;
        if (obj.variant !== null && obj.variant !== undefined)
            result.variant = obj.variant;
        if (obj.featureSettings !== null && obj.featureSettings !== undefined)
            result.featureSettings = obj.featureSettings;
        if (obj.variationSettings !== null && obj.variationSettings !== undefined)
            result.variationSettings = obj.variationSettings;
        if (obj.display !== null && obj.display !== undefined)
            result.display = obj.display;
        return result;
    }
    clone() {
        const result = new FontFaceDescriptors();
        result.style = this.style;
        result.weight = this.weight;
        result.stretch = this.stretch;
        result.unicodeRange = this.unicodeRange;
        result.variant = this.variant;
        result.featureSettings = this.featureSettings;
        result.variationSettings = this.variationSettings;
        result.display = this.display;
        return result;
    }
}
