import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { isNumber } from '@devexpress/utils/lib/utils/common';
export class ColorHelper {
    static getPredefinedColor(color) {
        return ColorUtils.fromHashString(color, 0);
    }
    static anyToColor(value, defaultValue) {
        if (isNumber(value) && !isNaN(value))
            return value;
        if (typeof value === "string") {
            var intValue = parseInt(value);
            return !isNaN(intValue) && value == intValue ? intValue : ColorUtils.fromHashString(value);
        }
        return defaultValue;
    }
    static getActualForeColor(foreColor, backColor) {
        if (foreColor == ColorHelper.AUTOMATIC_COLOR) {
            var backColorIsLight = backColor == ColorHelper.AUTOMATIC_COLOR ||
                backColor == ColorHelper.NO_COLOR ||
                ColorHelper.calculateLumaY(backColor) >= ColorHelper.DEFAULT_BOUNDARY_LUMA;
            foreColor = backColorIsLight ? ColorUtils.DARK_COLOR : ColorUtils.LIGHT_COLOR;
        }
        return ColorHelper.getCssString(foreColor, true);
    }
    static getCssString(color, isAutoColorTranslateToDark) {
        if (color == ColorHelper.AUTOMATIC_COLOR)
            return ColorUtils.colorToHash(isAutoColorTranslateToDark ? ColorUtils.DARK_COLOR : ColorUtils.LIGHT_COLOR);
        return ColorHelper.getCssStringInternal(color);
    }
    static IsDarkColor(color) {
        return ColorHelper.calculateLumaY(color) < ColorHelper.DEFAULT_BOUNDARY_LUMA;
    }
    static getCssStringInternal(color) {
        var alpfa = ColorUtils.getAlpha(color);
        switch (alpfa) {
            case 0: return "transparent";
            case 255: return ColorUtils.colorToHash(color);
            default: return "rgba(" + ColorUtils.getRed(color) + "," + ColorUtils.getGreen(color) + "," + ColorUtils.getBlue(color) + "," + ColorHelper.getOpacity(color) + ")";
        }
    }
    static getOpacity(color) {
        return ColorUtils.getAlpha(color) / 255;
    }
    static isEmptyBgColor(color) {
        return color === this.AUTOMATIC_COLOR || color === this.NO_COLOR;
    }
    static calculateLumaY(color) {
        return ColorHelper.DEFAULT_BOUNDARY_LUMA_RED * ColorUtils.getRed(color) +
            ColorHelper.DEFAULT_BOUNDARY_LUMA_GREEN * ColorUtils.getGreen(color) +
            ColorHelper.DEFAULT_BOUNDARY_LUMA_BLUE * ColorUtils.getBlue(color);
    }
}
ColorHelper.DEFAULT_BOUNDARY_LUMA = 60.762 * 65536;
ColorHelper.DEFAULT_BOUNDARY_LUMA_RED = 0.299 * 65536;
ColorHelper.DEFAULT_BOUNDARY_LUMA_BLUE = 0.114 * 65536;
ColorHelper.DEFAULT_BOUNDARY_LUMA_GREEN = 0.587 * 65536;
ColorHelper.BLACK_COLOR = -16777216;
ColorHelper.AUTOMATIC_COLOR = 0;
ColorHelper.NO_COLOR = 16777215;
