import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ColorHelper } from './color';
import { ColorHSL } from './color-hsl';
export class DXColor {
    static isTransparentOrEmpty(color) {
        return color === null || color === undefined || color === DXColor.empty || color === DXColor.transparent;
    }
    static isTransparentOrEmptyorNoColor(color) {
        return color == ColorHelper.NO_COLOR || DXColor.isTransparentOrEmpty(color);
    }
    static isTransparentColor(color) {
        return ColorUtils.getAlpha(color) == 0;
    }
    static isEmpty(color) {
        return color == null || color == undefined;
    }
    static isSemitransparentColor(color) {
        const alpha = ColorUtils.getAlpha(color);
        return alpha > 0 && alpha < 255;
    }
    static fromArgb(alpha, rgbColor) {
        return (alpha << 24) | (ColorUtils.getRed(rgbColor) << 16) | (ColorUtils.getGreen(rgbColor) << 8) | (ColorUtils.getBlue(rgbColor));
    }
    static fromRgb(red, green, blue) {
        return (255 << 24) | (red << 16) | (green << 8) | (blue);
    }
    static fromName(name) {
        const hash = ColorUtils.colorNames[name.toLowerCase()];
        return hash ? ColorUtils.fromHashString(hash) : ColorHelper.AUTOMATIC_COLOR;
    }
    static blend(color, backgroundColor) {
        if (ColorUtils.getAlpha(color) >= 255)
            return color;
        const alpha = ColorUtils.getAlpha(color) / 255.0;
        const one_alpha = 1.0 - alpha;
        return DXColor.fromRgb(Math.floor(ColorUtils.getRed(color) * alpha + ColorUtils.getRed(backgroundColor) * one_alpha), Math.floor(ColorUtils.getGreen(color) * alpha + ColorUtils.getGreen(backgroundColor) * one_alpha), Math.floor(ColorUtils.getBlue(color) * alpha + ColorUtils.getBlue(backgroundColor) * one_alpha));
    }
    static calculateNearestColor(colorsToChooseFrom, startColor) {
        const startHslColor = ColorHSL.fromColorRGB(startColor);
        return !colorsToChooseFrom.length ?
            DXColor.empty :
            ListUtils.min(colorsToChooseFrom, (color) => {
                const hslColor = ColorHSL.fromColorRGB(color);
                let hue = Math.abs(hslColor.floatHue - startHslColor.floatHue);
                if (hue > 1.0)
                    hue = 1.0 - hue;
                return Math.pow(hue, 2) +
                    Math.pow(hslColor.floatSaturation - startHslColor.floatSaturation, 2) +
                    Math.pow(hslColor.luminance - startHslColor.luminance, 2);
            });
    }
}
DXColor.empty = ColorHelper.getPredefinedColor("#000000");
DXColor.transparent = ColorUtils.fromHashString("#FFFFFF", 0);
DXColor.white = ColorUtils.fromHashString(ColorUtils.colorNames.white, 255);
