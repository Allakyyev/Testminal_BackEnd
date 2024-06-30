import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { BorderLineStyle } from '../../borders/enums';
class TableBorderInfo {
    constructor(compoundArray, widthDivider) {
        this.drawingCompoundArray = [];
        this.compoundArray = compoundArray;
        this.widthDivider = widthDivider;
        this.lineCount = Math.floor(compoundArray.length / 2);
        this.widthMultiplier = this.compoundArray[this.compoundArray.length - 1];
        for (let num of this.compoundArray)
            this.drawingCompoundArray.push(num / this.widthMultiplier);
    }
    getActualWidth(borderWidth) {
        return borderWidth * this.widthMultiplier / this.widthDivider;
    }
}
export class TableBorderCalculator {
    static getPowerfulBorder(colorProvider, aBorder, bBorder) {
        if (!aBorder)
            return bBorder;
        if (!bBorder)
            return aBorder;
        const aBorderWeight = TableBorderCalculator.getWeight(aBorder);
        const bBorderWeight = TableBorderCalculator.getWeight(bBorder);
        if (aBorderWeight > bBorderWeight)
            return aBorder;
        if (bBorderWeight > aBorderWeight)
            return bBorder;
        const aBorderStyleWeight = aBorder.style;
        const bBorderStyleWeight = bBorder.style;
        if (aBorderStyleWeight > bBorderStyleWeight)
            return aBorder;
        if (bBorderStyleWeight > aBorderStyleWeight)
            return bBorder;
        const aBorderColor = colorProvider.getRgbaFromModelColor(aBorder.color);
        const bBorderColor = colorProvider.getRgbaFromModelColor(bBorder.color);
        let aBorderBrightness = TableBorderCalculator.getBrightnessLevelOne(aBorderColor);
        let bBorderBrightness = TableBorderCalculator.getBrightnessLevelOne(bBorderColor);
        if (aBorderBrightness == bBorderBrightness) {
            aBorderBrightness = TableBorderCalculator.getBrightnessLevelTwo(aBorderColor);
            bBorderBrightness = TableBorderCalculator.getBrightnessLevelTwo(bBorderColor);
            if (aBorderBrightness == bBorderBrightness) {
                aBorderBrightness = TableBorderCalculator.getBrightnessLevelThree(aBorderColor);
                bBorderBrightness = TableBorderCalculator.getBrightnessLevelThree(bBorderColor);
            }
        }
        if (aBorderBrightness < bBorderBrightness)
            return aBorder;
        if (bBorderBrightness < aBorderBrightness)
            return bBorder;
        return aBorder;
    }
    static getActualWidth(borderInfo) {
        const { info } = TableBorderCalculator.getActualBorderLineStyle(borderInfo.style);
        return info ? info.getActualWidth(borderInfo.width) : 0;
    }
    static getBrightnessLevelOne(color) {
        return ColorUtils.getRed(color) + TableBorderCalculator.getBrightnessLevelTwo(color);
    }
    static getBrightnessLevelTwo(color) {
        return ColorUtils.getBlue(color) + 2 * ColorUtils.getGreen(color);
    }
    static getBrightnessLevelThree(color) {
        return ColorUtils.getGreen(color);
    }
    static getWeight(borderInfo) {
        const borderStyle = borderInfo.style;
        const { info } = TableBorderCalculator.getActualBorderLineStyle(borderStyle);
        return info ? (info.lineCount * borderStyle) : (borderStyle == BorderLineStyle.Disabled ? Number.MAX_VALUE : 0);
    }
    static getActualBorderLineStyle(borderLineStyle) {
        if (borderLineStyle == BorderLineStyle.None || borderLineStyle == BorderLineStyle.Nil || borderLineStyle == BorderLineStyle.Disabled)
            return { actualLineStyle: borderLineStyle, info: null };
        const info = TableBorderCalculator.lineStyleInfo[borderLineStyle];
        if (info)
            return { actualLineStyle: borderLineStyle, info: info };
        return { actualLineStyle: BorderLineStyle.Single, info: null };
    }
}
TableBorderCalculator.lineStyleInfo = {
    [BorderLineStyle.Single]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.Thick]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.Double]: new TableBorderInfo([0, 1, 2, 3], 1),
    [BorderLineStyle.Dotted]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.Dashed]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.DotDash]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.DotDotDash]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.Triple]: new TableBorderInfo([0, 1, 2, 3, 4, 5], 1),
    [BorderLineStyle.ThinThickSmallGap]: new TableBorderInfo([0, 1, 2, 10], 8),
    [BorderLineStyle.ThickThinSmallGap]: new TableBorderInfo([0, 8, 9, 10], 8),
    [BorderLineStyle.ThinThickThinSmallGap]: new TableBorderInfo([0, 1, 2, 10, 11, 12], 8),
    [BorderLineStyle.ThinThickMediumGap]: new TableBorderInfo([0, 1, 2, 4], 2),
    [BorderLineStyle.ThickThinMediumGap]: new TableBorderInfo([0, 2, 3, 4], 2),
    [BorderLineStyle.ThinThickThinMediumGap]: new TableBorderInfo([0, 1, 2, 4, 5, 6], 2),
    [BorderLineStyle.ThinThickLargeGap]: new TableBorderInfo([0, 1, 9, 11], 8),
    [BorderLineStyle.ThickThinLargeGap]: new TableBorderInfo([0, 2, 10, 11], 8),
    [BorderLineStyle.ThinThickThinLargeGap]: new TableBorderInfo([0, 1, 9, 11, 19, 20], 8),
    [BorderLineStyle.Wave]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.DoubleWave]: new TableBorderInfo([0, 1, 1, 2], 1),
    [BorderLineStyle.DashSmallGap]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.DashDotStroked]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.ThreeDEmboss]: new TableBorderInfo([0, 1, 1, 5, 6], 4),
    [BorderLineStyle.ThreeDEngrave]: new TableBorderInfo([0, 1, 1, 5, 6], 4),
    [BorderLineStyle.Outset]: new TableBorderInfo([0, 1], 1),
    [BorderLineStyle.Inset]: new TableBorderInfo([0, 1], 1),
};
