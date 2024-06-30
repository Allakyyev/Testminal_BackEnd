import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { ColorModelInfoCache } from '../caches/hashed-caches/color-model-info-cache';
import { BorderBase } from './border-base';
import { BorderLineStyle } from './enums';
import { LayoutBorder } from './layout-border';
export class BorderInfo {
    constructor() {
        this.style = BorderLineStyle.None;
        this.color = ColorModelInfoCache.defaultItem;
        this.width = 0;
        this.offset = 0;
        this.frame = false;
        this.shadow = false;
    }
    getHashCode() {
        return MathUtils.somePrimes[0] * this.style ^
            MathUtils.somePrimes[1] * this.color.getHashCode() ^
            MathUtils.somePrimes[2] * this.width;
    }
    getBorderBase(colorProvider) {
        return new BorderBase(this.style, this.width, this.color.toRgb(colorProvider));
    }
    getLayoutBorder(colorProvider) {
        return new LayoutBorder(this.style, this.width, this.color.toRgb(colorProvider));
    }
    equals(obj) {
        return obj && this.style == obj.style &&
            this.color.equals(obj.color) &&
            this.width == obj.width &&
            this.offset == obj.offset &&
            this.frame == obj.frame &&
            this.shadow == obj.shadow;
    }
    static equalsBinary(borderInfoA, borderInfoB) {
        return borderInfoA && borderInfoB &&
            borderInfoA.style == borderInfoB.style &&
            borderInfoA.color.equals(borderInfoB.color) &&
            borderInfoA.width == borderInfoB.width &&
            borderInfoA.offset == borderInfoB.offset &&
            borderInfoA.frame == borderInfoB.frame &&
            borderInfoA.shadow == borderInfoB.shadow;
    }
    copyFrom(obj) {
        this.style = obj.style;
        this.color = obj.color.clone();
        this.width = obj.width;
        this.offset = obj.offset;
        this.frame = obj.frame;
        this.shadow = obj.shadow;
    }
    clone() {
        var result = new BorderInfo();
        result.copyFrom(this);
        return result;
    }
}
