import { ThemeColorIndexCalculator } from '../../../core/formats/utils/color/theme-color-index-calculator';
import { TintAndShadeCalculator } from '../../../core/formats/utils/color/tint-and-shade-calculator';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { DXColor } from '../../../core/model/color/dx-color';
import { ThemeColorIndexConstants, ThemeColorValues } from '../../../core/model/color/enums';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../translation-table/translation-tables';
export class OpenXmlColorImportHelper {
    static createColorModelInfo(data, reader, attribute, allowNoColor = false) {
        const themeValue = data.readerHelper.getWpEnumValue(reader, 'themeColor', TranslationTables.themeColorValueTable.importMap, ThemeColorValues.None);
        if (themeValue != ThemeColorValues.None) {
            const themeColorIndex = ThemeColorIndexCalculator.calculateThemeColorIndex(themeValue);
            return themeColorIndex != ThemeColorIndexConstants.None ?
                ColorModelInfo.makeByThemeColorIndex(themeColorIndex, OpenXmlColorImportHelper.getTint(data, reader, 'themeTint', 'themeShade')) :
                ColorModelInfo.makeByThemeColorIndex(DXColor.empty);
        }
        else {
            const color = this.tryConvertAttributeToColor(data, reader, attribute);
            return color !== null ?
                ColorModelInfo.makeByColor(color) :
                (allowNoColor ? null : ColorModelInfo.makeByColor(DXColor.empty));
        }
    }
    static tryConvertAttributeToColor(data, reader, attribute) {
        let result = DXColor.empty;
        const value = data.readerHelper.readAttribute(reader, attribute);
        if (value == 'auto')
            return result;
        if (value != null)
            result = data.readerHelper.parseColor(value, DXColor.empty);
        if (result == DXColor.empty)
            result = data.readerHelper.getWpSTColorValue(reader, attribute, DXColor.empty);
        if (result == DXColor.empty) {
            result = data.readerHelper.getWpEnumValueCore(value, TranslationTables.predefinedBackgroundColors.importMap, DXColor.empty);
            return result != DXColor.empty ? result : null;
        }
        return result;
    }
    static createFillInfo(data, reader) {
        const tint = OpenXmlColorImportHelper.getTint(data, reader, 'themeFillTint', 'themeFillShade');
        const themeValue = data.readerHelper.getWpEnumValue(reader, 'themeFill', TranslationTables.themeColorValueTable.importMap, ThemeColorValues.None);
        if (themeValue != ThemeColorValues.None) {
            const themeColorIndex = ThemeColorIndexCalculator.calculateThemeColorIndex(themeValue);
            if (themeColorIndex != ThemeColorIndexConstants.None)
                return ColorModelInfo.makeByThemeColorIndex(themeColorIndex, tint);
        }
        return ColorModelInfo.makeByColor(data.readerHelper.getWpSTColorValue(reader, 'fill', DXColor.empty), tint);
    }
    static getTint(data, reader, tintAttrName, shadeTintName) {
        const themeFillTint = data.readerHelper.readAttribute(reader, tintAttrName);
        if (!StringUtils.isNullOrEmpty(themeFillTint))
            return TintAndShadeCalculator.calculateTint(data.readerHelper.convertToInt(themeFillTint));
        const themeFillShade = data.readerHelper.readAttribute(reader, shadeTintName);
        if (!StringUtils.isNullOrEmpty(themeFillShade))
            return TintAndShadeCalculator.modifyShadeToTint(data.readerHelper.convertToInt(themeFillShade));
        return 0;
    }
}
