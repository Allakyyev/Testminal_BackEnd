import { Constants } from '@devexpress/utils/lib/constants';
import { Errors } from '@devexpress/utils/lib/errors';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { ColorModelInfoCache } from '../caches/hashed-caches/color-model-info-cache';
import { ColorHSL } from './color-hsl';
import { DXSystemColors } from './d-xsystem-colors';
import { DXColor } from './dx-color';
import { ColorType } from './enums';
class ColorDistanceInfo {
    constructor(distance, colorIndex) {
        this.distance = distance;
        this.colorIndex = colorIndex;
    }
    static comparator(a, b) {
        return a.distance - b.distance;
    }
}
export class ColorDifference {
    static RGB(x, y) {
        return Math.sqrt(Math.pow((ColorUtils.getRed(x) - ColorUtils.getRed(y)) / 255, 2) +
            Math.pow((ColorUtils.getGreen(x) - ColorUtils.getGreen(y)) / 255, 2) +
            Math.pow((ColorUtils.getBlue(x) - ColorUtils.getBlue(y)) / 255, 2));
    }
    static HSB(x, y) {
        const xHSL = ColorHSL.fromColorRGB(x);
        const yHSL = ColorHSL.fromColorRGB(y);
        let deltaH = Math.abs(xHSL.hue - yHSL.hue);
        if (deltaH > 180.0)
            deltaH = 360.0 - deltaH;
        deltaH /= 57.3;
        const deltaB = Math.abs(xHSL.luminance - yHSL.luminance) * 3.0;
        const deltaS = Math.abs(xHSL.saturation - yHSL.saturation) * 1.5;
        return deltaB + deltaH + deltaS;
    }
}
export class Palette {
    constructor() {
        this.reset();
    }
    getColorByIndex(index) {
        const color = this.colorTable[index];
        if (color === undefined)
            throw new Error(Errors.InternalException);
        return color;
    }
    setColor(index, color) {
        const oldColor = this.colorTable[index];
        if (oldColor !== undefined) {
            if (oldColor != color) {
                this.isCustomIndexedColorTable = true;
                this.colorTable[index] = color;
            }
        }
        else
            throw new Error(Errors.InternalException);
    }
    reset() {
        const sbc = DXSystemColors.scrollBar;
        this.colorTable = {
            [0]: ColorUtils.fromArgbNumber(0, 0, 0, 0),
            [1]: ColorUtils.fromArgbNumber(0, 255, 255, 255),
            [2]: ColorUtils.fromArgbNumber(0, 255, 0, 0),
            [3]: ColorUtils.fromArgbNumber(0, 0, 255, 0),
            [4]: ColorUtils.fromArgbNumber(0, 0, 0, 255),
            [5]: ColorUtils.fromArgbNumber(0, 255, 255, 0),
            [6]: ColorUtils.fromArgbNumber(0, 255, 0, 255),
            [7]: ColorUtils.fromArgbNumber(0, 0, 255, 255),
            [8]: ColorUtils.fromArgbNumber(0, 0, 0, 0),
            [9]: ColorUtils.fromArgbNumber(0, 255, 255, 255),
            [10]: ColorUtils.fromArgbNumber(0, 255, 0, 0),
            [11]: ColorUtils.fromArgbNumber(0, 0, 255, 0),
            [12]: ColorUtils.fromArgbNumber(0, 0, 0, 255),
            [13]: ColorUtils.fromArgbNumber(0, 255, 255, 0),
            [14]: ColorUtils.fromArgbNumber(0, 255, 0, 255),
            [15]: ColorUtils.fromArgbNumber(0, 0, 255, 255),
            [16]: ColorUtils.fromArgbNumber(0, 128, 0, 0),
            [17]: ColorUtils.fromArgbNumber(0, 0, 128, 0),
            [18]: ColorUtils.fromArgbNumber(0, 0, 0, 128),
            [19]: ColorUtils.fromArgbNumber(0, 128, 128, 0),
            [20]: ColorUtils.fromArgbNumber(0, 128, 0, 128),
            [21]: ColorUtils.fromArgbNumber(0, 0, 128, 128),
            [22]: ColorUtils.fromArgbNumber(0, 192, 192, 192),
            [23]: ColorUtils.fromArgbNumber(0, 128, 128, 128),
            [24]: ColorUtils.fromArgbNumber(0, 153, 153, 255),
            [25]: ColorUtils.fromArgbNumber(0, 153, 51, 102),
            [26]: ColorUtils.fromArgbNumber(0, 255, 255, 204),
            [27]: ColorUtils.fromArgbNumber(0, 204, 255, 255),
            [28]: ColorUtils.fromArgbNumber(0, 102, 0, 102),
            [29]: ColorUtils.fromArgbNumber(0, 255, 128, 128),
            [30]: ColorUtils.fromArgbNumber(0, 0, 102, 204),
            [31]: ColorUtils.fromArgbNumber(0, 204, 204, 255),
            [32]: ColorUtils.fromArgbNumber(0, 0, 0, 128),
            [33]: ColorUtils.fromArgbNumber(0, 255, 0, 255),
            [34]: ColorUtils.fromArgbNumber(0, 255, 255, 0),
            [35]: ColorUtils.fromArgbNumber(0, 0, 255, 255),
            [36]: ColorUtils.fromArgbNumber(0, 128, 0, 128),
            [37]: ColorUtils.fromArgbNumber(0, 128, 0, 0),
            [38]: ColorUtils.fromArgbNumber(0, 0, 128, 128),
            [39]: ColorUtils.fromArgbNumber(0, 0, 0, 255),
            [40]: ColorUtils.fromArgbNumber(0, 0, 204, 255),
            [41]: ColorUtils.fromArgbNumber(0, 204, 255, 255),
            [42]: ColorUtils.fromArgbNumber(0, 204, 255, 204),
            [43]: ColorUtils.fromArgbNumber(0, 255, 255, 153),
            [44]: ColorUtils.fromArgbNumber(0, 153, 204, 255),
            [45]: ColorUtils.fromArgbNumber(0, 255, 153, 204),
            [46]: ColorUtils.fromArgbNumber(0, 204, 153, 255),
            [47]: ColorUtils.fromArgbNumber(0, 255, 204, 153),
            [48]: ColorUtils.fromArgbNumber(0, 51, 102, 255),
            [49]: ColorUtils.fromArgbNumber(0, 51, 204, 204),
            [50]: ColorUtils.fromArgbNumber(0, 153, 204, 0),
            [51]: ColorUtils.fromArgbNumber(0, 255, 204, 0),
            [52]: ColorUtils.fromArgbNumber(0, 255, 153, 0),
            [53]: ColorUtils.fromArgbNumber(0, 255, 102, 0),
            [54]: ColorUtils.fromArgbNumber(0, 102, 102, 153),
            [55]: ColorUtils.fromArgbNumber(0, 150, 150, 150),
            [56]: ColorUtils.fromArgbNumber(0, 0, 51, 102),
            [57]: ColorUtils.fromArgbNumber(0, 51, 153, 102),
            [58]: ColorUtils.fromArgbNumber(0, 0, 51, 0),
            [59]: ColorUtils.fromArgbNumber(0, 51, 51, 0),
            [60]: ColorUtils.fromArgbNumber(0, 153, 51, 0),
            [61]: ColorUtils.fromArgbNumber(0, 153, 51, 102),
            [62]: ColorUtils.fromArgbNumber(0, 51, 51, 153),
            [63]: ColorUtils.fromArgbNumber(0, 51, 51, 51),
            [Palette.SystemWindowFrameColorIndex]: DXSystemColors.windowFrame,
            [Palette.System3DFaceColorIndex]: DXSystemColors.control,
            [Palette.System3DTextColorIndex]: DXSystemColors.controlText,
            [Palette.System3DHighlightColorIndex]: DXSystemColors.controlLight,
            [Palette.System3DShadowColorIndex]: DXSystemColors.controlDark,
            [Palette.SystemHighlightColorIndex]: DXSystemColors.highlight,
            [Palette.SystemControlTextColorIndex]: DXSystemColors.controlText,
            [Palette.SystemControlScrollColorIndex]: sbc,
            [Palette.SystemControlInverseColorIndex]: DXColor.fromArgb(0, sbc),
            [Palette.SystemControlBodyColorIndex]: DXSystemColors.window,
            [Palette.SystemControlFrameColorIndex]: DXSystemColors.windowFrame,
            [Palette.DefaultForegroundColorIndex]: DXSystemColors.windowText,
            [Palette.DefaultBackgroundColorIndex]: DXSystemColors.window,
            [Palette.DefaultChartForegroundColorIndex]: ColorUtils.fromArgbNumber(0, 0, 0, 0),
            [Palette.DefaultChartBackgroundColorIndex]: ColorUtils.fromArgbNumber(0, 255, 255, 255),
            [Palette.ChartNeutralColorIndex]: ColorUtils.fromArgbNumber(0, 0, 0, 0),
            [Palette.ToolTipFillColorIndex]: DXSystemColors.info,
            [Palette.ToolTipTextColorIndex]: DXSystemColors.infoText,
            [Palette.FontAutomaticColorIndex]: DXColor.empty,
        };
    }
    get defaultForegroundColor() { return this.colorTable[Palette.DefaultForegroundColorIndex]; }
    set defaultForegroundColor(val) { this.colorTable[Palette.DefaultForegroundColorIndex] = val; }
    get defaultBackgroundColor() { return this.colorTable[Palette.DefaultBackgroundColorIndex]; }
    set defaultBackgroundColor(val) { this.colorTable[Palette.DefaultBackgroundColorIndex] = val; }
    get defaultChartForegroundColor() { return this.colorTable[Palette.DefaultChartForegroundColorIndex]; }
    set defaultChartForegroundColor(val) { this.colorTable[Palette.DefaultChartForegroundColorIndex] = val; }
    get defaultChartBackgroundColor() { return this.colorTable[Palette.DefaultChartBackgroundColorIndex]; }
    set defaultChartBackgroundColor(val) { this.colorTable[Palette.DefaultChartBackgroundColorIndex] = val; }
    get chartNeutralColor() { return this.colorTable[Palette.ChartNeutralColorIndex]; }
    get toolTipTextColor() { return this.colorTable[Palette.ToolTipTextColorIndex]; }
    set toolTipTextColor(val) { this.colorTable[Palette.ToolTipTextColorIndex] = val; }
    get fontAutomaticColor() { return this.colorTable[Palette.FontAutomaticColorIndex]; }
    set fontAutomaticColor(val) { this.colorTable[Palette.FontAutomaticColorIndex] = val; }
    isValidColorIndex(index) {
        return this.colorTable[index] !== undefined;
    }
    getColorIndex(colorProvider, colorInfo, foreground) {
        const defaultItem = ColorModelInfoCache.defaultItem;
        if (defaultItem.equals(colorInfo) || colorInfo.colorType == ColorType.Auto)
            return foreground ? Palette.DefaultForegroundColorIndex : Palette.DefaultBackgroundColorIndex;
        if (colorInfo.colorType == ColorType.Index) {
            if (!this.isValidColorIndex(colorInfo.colorIndex))
                return foreground ? Palette.DefaultForegroundColorIndex : Palette.DefaultBackgroundColorIndex;
            return colorInfo.colorIndex;
        }
        return this.getPaletteNearestColorIndex(colorInfo.toRgb(colorProvider));
    }
    getFontColorIndex(colorProvider, colorInfo) {
        if (colorInfo.colorType == ColorType.Auto)
            return Palette.FontAutomaticColorIndex;
        if (colorInfo.colorType == ColorType.Index) {
            if (!this.isValidColorIndex(colorInfo.colorIndex))
                return Palette.FontAutomaticColorIndex;
            return colorInfo.colorIndex;
        }
        return this.getPaletteNearestColorIndex(colorInfo.toRgb(colorProvider));
    }
    getColorIndexByRgbColor(color) {
        let index = this.getExactColorIndex(color, new BoundaryInterval(0, Palette.FontAutomaticColorIndex + 1));
        if (index != -1)
            return index;
        if (ColorUtils.getAlpha(color) == 0xFF) {
            color = DXColor.fromArgb(0, color);
            index = this.getExactColorIndex(color, new BoundaryInterval(0, Palette.FontAutomaticColorIndex + 1));
            if (index != -1)
                return index;
        }
        return Palette.DefaultForegroundColorIndex;
    }
    getExactColorIndex(color, indexInterval) {
        const index = NumberMapUtils.keyBy(this.colorTable, (value, key) => indexInterval.contains(key) && value == color);
        return index === null ? -1 : index;
    }
    getNearestColorIndex(color) {
        const nearest = this.getExactColorIndex(color, new BoundaryInterval(0, 64));
        if (nearest != -1)
            return nearest;
        return this.getNearestColorIndexCore(color, new BoundaryInterval(0, 64));
    }
    getPaletteNearestColorIndex(color) {
        const nearest = this.getExactColorIndex(color, new BoundaryInterval(8, 63));
        if (nearest != -1)
            return nearest;
        return this.getNearestColorIndexCore(color, new BoundaryInterval(8, 64));
    }
    isCompatibleColors(x, y) {
        return ColorUtils.isGray(x) == ColorUtils.isGray(y);
    }
    getColorDistance(x, y, rgbWeight) {
        const hsbD = ColorDifference.HSB(x, y);
        const rgbD = ColorDifference.RGB(x, y) * rgbWeight;
        return hsbD + rgbD;
    }
    getNearestColorIndexCore(color, indexInterval) {
        const items = [];
        NumberMapUtils.forEach(this.colorTable, (value, key) => {
            if (indexInterval.contains(key) && this.isCompatibleColors(value, color))
                items.push(new ColorDistanceInfo(this.getColorDistance(color, value, 3.0), key));
        });
        items.sort(ColorDistanceInfo.comparator);
        const limit = 5;
        if (items.length > limit)
            items.splice(limit);
        let nearest = -1;
        let distance = Constants.MAX_SAFE_INTEGER;
        for (let item of items) {
            if (nearest == -1) {
                nearest = item.colorIndex;
                distance = this.getColorDistance(color, this.colorTable[item.colorIndex], 1.5);
            }
            else {
                const d = this.getColorDistance(color, this.colorTable[item.colorIndex], 1.5);
                if (d < distance) {
                    nearest = item.colorIndex;
                    distance = d;
                }
            }
        }
        return nearest;
    }
    clone() {
        const result = new Palette();
        result.isCustomIndexedColorTable = this.isCustomIndexedColorTable;
        result.colorTable = NumberMapUtils.shallowCopy(this.colorTable);
        return result;
    }
}
Palette.BuiltInColorsCount = 8;
Palette.DefaultForegroundColorIndex = 64;
Palette.DefaultBackgroundColorIndex = 65;
Palette.SystemWindowFrameColorIndex = 66;
Palette.System3DFaceColorIndex = 67;
Palette.System3DTextColorIndex = 68;
Palette.System3DHighlightColorIndex = 69;
Palette.System3DShadowColorIndex = 70;
Palette.SystemHighlightColorIndex = 71;
Palette.SystemControlTextColorIndex = 72;
Palette.SystemControlScrollColorIndex = 73;
Palette.SystemControlInverseColorIndex = 74;
Palette.SystemControlBodyColorIndex = 75;
Palette.SystemControlFrameColorIndex = 76;
Palette.DefaultChartForegroundColorIndex = 77;
Palette.DefaultChartBackgroundColorIndex = 78;
Palette.ChartNeutralColorIndex = 79;
Palette.ToolTipFillColorIndex = 80;
Palette.ToolTipTextColorIndex = 81;
Palette.FontAutomaticColorIndex = 32767;
