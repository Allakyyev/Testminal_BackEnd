import { ColorHelper } from '../../../core/model/color/color';
import { DXColor } from '../../../core/model/color/dx-color';
import { RichUtils } from '../../../core/model/rich-utils';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class MarkupLanguageColorParser {
    static parseColor(value) {
        let colorName = '';
        if (value[0] == '#') {
            const indexStart = value.indexOf('[');
            const indexEnd = value.indexOf(']');
            if (indexStart >= 0 && indexEnd >= 0 && indexStart < indexEnd)
                value = (value.slice(0, indexStart) + value.slice(indexEnd + 1)).trim();
            colorName = value.substr(1);
            switch (colorName.length) {
                case 8: return MarkupLanguageColorParser.getColorByArgb(colorName);
                case 4: return MarkupLanguageColorParser.getColorByArgb(StringUtils.repeat(colorName.charAt(0), 2) +
                    StringUtils.repeat(colorName.charAt(1), 2) +
                    StringUtils.repeat(colorName.charAt(2), 2) +
                    StringUtils.repeat(colorName.charAt(3), 2));
                case 6: return MarkupLanguageColorParser.getColorByRgb(colorName);
                case 3: return MarkupLanguageColorParser.getColorByRgb(StringUtils.repeat(colorName.charAt(0), 2) +
                    StringUtils.repeat(colorName.charAt(1), 2) +
                    StringUtils.repeat(colorName.charAt(2), 2));
                default: return MarkupLanguageColorParser.getColorByName(value);
            }
        }
        if (value.length == 6 && !ColorUtils.colorNames[value]) {
            const color = MarkupLanguageColorParser.getColorByRgb(value);
            if (color != DXColor.empty)
                return color;
        }
        if (StringUtils.startsAt(value.toLowerCase(), 'rgb(')) {
            const result = MarkupLanguageColorParser.parseRGB(value.substr(4));
            if (result != DXColor.empty)
                return result;
        }
        return MarkupLanguageColorParser.getColorByName(value);
    }
    static getColorByName(value) {
        const color = DXColor.fromName(value);
        return color === ColorHelper.AUTOMATIC_COLOR ? DXColor.empty : color;
    }
    static getColor(colorName, startIndex) {
        const sr = colorName.substr(startIndex, 2);
        const color = parseInt(sr, 16);
        return color == 0 && sr != '00' ? -1 : color;
    }
    static getColorByRgb(colorName, a = 255) {
        const r = MarkupLanguageColorParser.getColor(colorName, 0);
        const g = MarkupLanguageColorParser.getColor(colorName, 2);
        const b = MarkupLanguageColorParser.getColor(colorName, 4);
        return r != -1 && g != -1 && b != -1 ? (a << 24) | (r << 16) | (g << 8) | b : DXColor.empty;
    }
    static getColorByArgb(colorName) {
        const a = MarkupLanguageColorParser.getColor(colorName, 0);
        const r = MarkupLanguageColorParser.getColor(colorName, 2);
        const g = MarkupLanguageColorParser.getColor(colorName, 4);
        const b = MarkupLanguageColorParser.getColor(colorName, 6);
        return a != -1 && r != -1 && g != -1 && b != -1 ? (a << 24) | (r << 16) | (g << 8) | b : DXColor.empty;
    }
    static parseRGB(value) {
        let rgb = '';
        const colors = [];
        for (const val of value) {
            if (val != ',' && val != ')') {
                if (!RichUtils.isWhitespace.test(val))
                    rgb += val;
            }
            else {
                const color = parseInt(rgb, 10);
                if (!isNaN(color))
                    colors.push(color);
                rgb = '';
            }
        }
        return colors.length == 3 ? (255 << 24) | (colors[0] << 16) | (colors[1] << 8) | colors[2] : DXColor.empty;
    }
}
