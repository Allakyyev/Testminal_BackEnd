import { ThemeColorIndexCalculator } from '../../../core/formats/utils/color/theme-color-index-calculator';
import { TintAndShadeCalculator } from '../../../core/formats/utils/color/tint-and-shade-calculator';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { DXColor } from '../../../core/model/color/dx-color';
import { ThemeColorIndexConstants, ThemeColorValues } from '../../../core/model/color/enums';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DestinationBase } from './base/destination';
import { DestinationType } from './utils/destination-type';
export class ColorTableDestination extends DestinationBase {
    constructor() {
        super(...arguments);
        this.themeColorValue = ThemeColorValues.None;
        this.tint = ColorTableDestination.maxTintValue;
        this.shade = ColorTableDestination.maxTintValue;
    }
    get destinationType() { return DestinationType.ColorTableDestination; }
    get controlCharHT() { return null; }
    get cache() { return this.importer.documentModel.cache.colorModelInfoCache; }
    reset() {
        this.r = this.g = this.b = 0;
        this.wasColor = false;
        this.themeColorValue = ThemeColorValues.None;
        this.tint = this.shade = ColorTableDestination.maxTintValue;
    }
    processKeywordCore(keyword, parameterValue, hasParameter) {
        if (hasParameter == false)
            parameterValue = 0;
        switch (keyword) {
            case "bin":
                return super.processKeywordCore(keyword, parameterValue, hasParameter);
            case "red":
                this.r = parameterValue;
                this.wasColor = true;
                break;
            case "green":
                this.g = parameterValue;
                this.wasColor = true;
                break;
            case "blue":
                this.b = parameterValue;
                this.wasColor = true;
                break;
            case "ctint":
                this.tint = this.calculateTintOrShade(parameterValue);
                this.wasColor = true;
                break;
            case "cshade":
                this.shade = this.calculateTintOrShade(parameterValue);
                this.wasColor = true;
                break;
            case "cmaindarkone":
                this.themeColorValue = ThemeColorValues.Dark1;
                this.wasColor = true;
                break;
            case "cmainlightone":
                this.themeColorValue = ThemeColorValues.Light1;
                this.wasColor = true;
                break;
            case "cmaindarktwo":
                this.themeColorValue = ThemeColorValues.Dark2;
                this.wasColor = true;
                break;
            case "cmainlighttwo":
                this.themeColorValue = ThemeColorValues.Light2;
                this.wasColor = true;
                break;
            case "caccentone":
                this.themeColorValue = ThemeColorValues.Accent1;
                this.wasColor = true;
                break;
            case "caccenttwo":
                this.themeColorValue = ThemeColorValues.Accent2;
                this.wasColor = true;
                break;
            case "caccentthree":
                this.themeColorValue = ThemeColorValues.Accent3;
                this.wasColor = true;
                break;
            case "caccentfour":
                this.themeColorValue = ThemeColorValues.Accent4;
                this.wasColor = true;
                break;
            case "caccentfive":
                this.themeColorValue = ThemeColorValues.Accent5;
                this.wasColor = true;
                break;
            case "caccentsix":
                this.themeColorValue = ThemeColorValues.Accent6;
                this.wasColor = true;
                break;
            case "chyperlink":
                this.themeColorValue = ThemeColorValues.Hyperlink;
                this.wasColor = true;
                break;
            case "cfollowedhyperlink":
                this.themeColorValue = ThemeColorValues.FollowedHyperlink;
                this.wasColor = true;
                break;
            case "cbackgroundone":
                this.themeColorValue = ThemeColorValues.Background1;
                this.wasColor = true;
                break;
            case "ctextone":
                this.themeColorValue = ThemeColorValues.Text1;
                this.wasColor = true;
                break;
            case "cbackgroundtwo":
                this.themeColorValue = ThemeColorValues.Background2;
                this.wasColor = true;
                break;
            case "ctexttwo":
                this.themeColorValue = ThemeColorValues.Text2;
                this.wasColor = true;
                break;
            default:
                return false;
        }
        return true;
    }
    createClone() {
        return new ColorTableDestination(this.importer);
    }
    isColorValid() {
        return this.r >= 0 && this.r <= 255 &&
            this.g >= 0 && this.g <= 255 &&
            this.b >= 0 && this.b <= 255 ||
            this.themeColorValue != ThemeColorValues.None;
    }
    calculateTintOrShade(value) {
        if (value > 255)
            return ColorTableDestination.maxTintValue;
        if (value < 0)
            return ColorTableDestination.minTintValue;
        return value;
    }
    processCharCore(ch) {
        if (ch == ';') {
            if (this.wasColor) {
                if (this.isColorValid()) {
                    const newColor = ColorUtils.fromArgbNumber(255, this.r, this.g, this.b);
                    this.importer.documentProperties.colorIndexes.collection.push(this.cache.getItem(RtfColorImportHelper.createColorModelInfo(newColor, this.tint, this.shade, this.themeColorValue)));
                }
                else
                    this.importer.throwInvalidRtfFile();
            }
            else
                this.importer.documentProperties.colorIndexes.collection.push(this.cache.getItem(ColorModelInfo.makeByColor(DXColor.empty)));
            this.reset();
        }
    }
}
ColorTableDestination.maxTintValue = 255;
ColorTableDestination.minTintValue = 0;
ColorTableDestination.autoColor = DXColor.empty;
class RtfColorImportHelper {
    static createColorModelInfo(color, tint, shade, themeColorValue) {
        const colorModelInfo = ColorModelInfo.makeByColor(color);
        if (themeColorValue != ThemeColorValues.None) {
            const themeColorIndex = ThemeColorIndexCalculator.richEditThemeColorValuesToThemeColorIndexTranslationTable[themeColorValue];
            if (themeColorIndex != ThemeColorIndexConstants.None) {
                colorModelInfo.themeColorIndex = themeColorIndex;
                if (tint == TintAndShadeCalculator.maxTintValue)
                    colorModelInfo.tint = TintAndShadeCalculator.modifyShadeToTint(shade);
                else
                    colorModelInfo.tint = TintAndShadeCalculator.calculateTint(tint);
            }
        }
        return colorModelInfo;
    }
}
