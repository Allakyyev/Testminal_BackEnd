import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DrawingColorModelInfoCache } from '../caches/hashed-caches/drawing-color-model-info-cache';
import { DXColor } from '../color/dx-color';
import { DrawingColorType } from '../color/enums';
import { DrawingColorModelInfo } from './drawing-color-model-info';
import { DrawingBulletType } from './enums';
import { AlphaColorTransform } from './transform/alpha-color-transform';
import { ColorTransformCollection } from './transform/color-transform-collection';
export class DrawingColor {
    constructor(color, transforms = new ColorTransformCollection()) {
        this.transforms = transforms;
        this.color = color;
    }
    static createByDrawingColorModel(colorInfo) {
        return new DrawingColor(colorInfo);
    }
    static createByColor(color) {
        const alpha = ColorUtils.getAlpha(color);
        return alpha == 255 ?
            new DrawingColor(DrawingColorModelInfo.createARGB(color)) :
            new DrawingColor(DrawingColorModelInfo.createRGB(color), new ColorTransformCollection([AlphaColorTransform.createFromAlpha(alpha)]));
    }
    get isEmpty() { return this.transforms.transforms.length == 0 && this.color.isEmpty; }
    finalColor(colorProvider) {
        return this.toRgb(colorProvider, DXColor.empty);
    }
    get originalColor() { return this; }
    setColorFromRGB(rgb) {
        const alpha = ColorUtils.getAlpha(rgb);
        if (alpha == 255)
            this.rgb = rgb;
        else {
            this.rgb = DXColor.fromArgb(255, rgb);
            this.transforms.add(AlphaColorTransform.createFromAlpha(alpha));
        }
    }
    get rgb() { return this.color.rgb; }
    set rgb(value) {
        if (this.color.rgb == value && this.color.colorType == DrawingColorType.Rgb)
            return;
        this.color.rgb = value;
    }
    get system() { return this.color.systemColor; }
    set system(value) {
        if (this.color.systemColor == value && this.color.colorType == DrawingColorType.System)
            return;
        this.color.systemColor = value;
    }
    get scheme() { return this.color.schemeColor; }
    set scheme(value) {
        if (this.color.schemeColor == value && this.color.colorType == DrawingColorType.Scheme)
            return;
        this.color.schemeColor = value;
    }
    get preset() { return this.color.preset; }
    set preset(value) {
        if (this.color.preset == value && this.color.colorType == DrawingColorType.Preset)
            return;
        this.color.preset = value;
    }
    get hsl() { return this.color.hsl; }
    set hsl(value) {
        if (this.color.hsl.equals(value) && this.color.colorType == DrawingColorType.Hsl)
            return;
        this.color.hsl = value;
    }
    get scRgb() { return this.color.scRgb; }
    set scRgb(value) {
        if (this.color.scRgb.equals(value) && this.color.colorType == DrawingColorType.ScRgb)
            return;
        this.color.scRgb = value;
    }
    get colorType() { return this.color.colorType; }
    toRgb(colorProvider, styleColor) {
        return this.transforms.applyTransform(this.color.toRgb(colorProvider, styleColor));
    }
    get type() { return DrawingBulletType.Color; }
    equals(obj) {
        return obj &&
            this.color.equals(obj.color) &&
            this.transforms.equals(obj.transforms);
    }
    clear() {
        this.color = DrawingColorModelInfoCache.defaultItem;
        this.transforms.clear();
    }
    clone() {
        return new DrawingColor(this.color.clone(), this.transforms.clone());
    }
}
