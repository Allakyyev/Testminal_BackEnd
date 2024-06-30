import { TintAndShadeCalculator } from '../../../../core/formats/utils/color/tint-and-shade-calculator';
import { DXColor } from '../../../../core/model/color/dx-color';
import { ThemeColorIndexConstants, ThemeColorValues } from '../../../../core/model/color/enums';
import { ShadingPattern } from '../../../../core/model/shadings/shading-pattern';
import { Constants } from '@devexpress/utils/lib/constants';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { WriterHelper } from '../../utils/writer-helper';
import { BaseExporter } from '../base';
export class ColorExporter extends BaseExporter {
    get colorProvider() { return this.data.model.colorProvider; }
    static convertThemeColorValue(themeColorValue) {
        return WriterHelper.getValueFromTables(TranslationTables.themeColorValueTable, themeColorValue, ThemeColorValues.None);
    }
    static convertThemeColorIndex(themeColorIndex) {
        return WriterHelper.getValueFromTables(TranslationTables.themeColorIndexTable, themeColorIndex, ThemeColorIndexConstants.None);
    }
    static convertShadingPattern(value) {
        return WriterHelper.getValueFromTables(TranslationTables.shadingPatternTable, value, ShadingPattern.Clear);
    }
    static convertColorToString(color) {
        return ColorUtils.colorToHash(color).substr(1);
    }
    exportColorInfo(colorInfo, attribute, exportAutoColor) {
        const color = colorInfo.toRgb(this.colorProvider);
        if (!DXColor.isTransparentOrEmpty(color)) {
            this.writer.writeWpStringAttr(attribute, ColorExporter.convertColorToString(color));
            if (colorInfo.themeValue != ThemeColorValues.None)
                this.writer.writeWpStringAttr('themeColor', ColorExporter.convertThemeColorValue(colorInfo.themeValue));
            else if (colorInfo.themeColorIndex != ThemeColorIndexConstants.None)
                this.writer.writeWpStringAttr('themeColor', ColorExporter.convertThemeColorIndex(colorInfo.themeColorIndex));
            if (colorInfo.tint < 0 && colorInfo.tint > Constants.MIN_SAFE_INTEGER)
                this.writer.writeWpStringAttr('themeShade', WriterHelper.convertToHexString(TintAndShadeCalculator.calculateShadeFromColorModelInfoTint(colorInfo.tint)));
            if (colorInfo.tint > 0)
                this.writer.writeWpStringAttr('themeTint', WriterHelper.convertToHexString(TintAndShadeCalculator.calculateTintFromColorModelInfoTint(colorInfo.tint)));
        }
        else {
            if (exportAutoColor)
                this.writer.writeWpStringAttr(attribute, 'auto');
        }
    }
    convertHighlightColorToString(value) {
        if (DXColor.isTransparentOrEmpty(value))
            return TranslationTables.predefinedBackgroundColors.exportMap[DXColor.empty].mlValue.openXmlValue;
        const result = TranslationTables.predefinedBackgroundColors.exportMap[value];
        if (result !== undefined)
            return result.mlValue.openXmlValue;
        const bestMatchColor = DXColor.calculateNearestColor(TranslationTables.listOfKeysPredefinedBackgroundColors, value);
        const currentTableBackgroundColor = this.data.currentTableBackgroundColor;
        return !DXColor.isTransparentOrEmpty(currentTableBackgroundColor) && currentTableBackgroundColor == value && bestMatchColor != value ?
            '' :
            TranslationTables.predefinedBackgroundColors.exportMap[bestMatchColor].mlValue.openXmlValue;
    }
    exportShadingCore(shadingInfo, exportAutoColor) {
        this.writer.writeWpStartElement('shd');
        this.writer.writeWpStringAttr('val', ColorExporter.convertShadingPattern(shadingInfo.shadingPattern));
        this.exportColorInfo(shadingInfo.foreColor, 'color', exportAutoColor);
        this.exportFillInfo(shadingInfo.backColor);
        this.writer.endElement();
    }
    exportFillInfo(fillInfo) {
        const color = fillInfo.toRgb(this.colorProvider);
        if (!DXColor.isTransparentOrEmpty(color))
            this.writer.writeWpStringAttr('fill', ColorExporter.convertColorToString(color));
        else
            this.writer.writeWpStringAttr('fill', 'auto');
        if (fillInfo.themeValue != ThemeColorValues.None)
            this.writer.writeWpStringAttr('themeFill', ColorExporter.convertThemeColorValue(fillInfo.themeValue));
        else if (fillInfo.themeColorIndex != ThemeColorIndexConstants.None)
            this.writer.writeWpStringAttr('themeFill', ColorExporter.convertThemeColorIndex(fillInfo.themeColorIndex));
        if (fillInfo.tint < 0 && fillInfo.tint > Constants.MIN_SAFE_INTEGER)
            this.writer.writeWpStringAttr('themeFillShade', WriterHelper.convertToHexString(TintAndShadeCalculator.calculateShadeFromColorModelInfoTint(fillInfo.tint)));
        if (fillInfo.tint > 0)
            this.writer.writeWpStringAttr('themeFillTint', WriterHelper.convertToHexString(TintAndShadeCalculator.calculateTintFromColorModelInfoTint(fillInfo.tint)));
    }
}
