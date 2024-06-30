import { MapCreator } from '../../../../base-utils/map-creator';
import { ThemeColorIndexConstants, ThemeColorValues } from '../../../model/color/enums';
import { SchemeColorValues } from '../../../model/themes/enums';
import { ThemeDrawingColorCollection } from '../../../model/themes/theme-drawing-color-collection';
export class ThemeColorIndexCalculator {
    static calculateThemeColorIndex(themeValue) {
        const schemeValue = ThemeColorIndexCalculator.richEditThemeColorValuesToSchemeColorValuesTranslationTable[themeValue];
        const themeColorIndex = ThemeDrawingColorCollection.schemeColorValuesToThemeColorIndexTranslationTable[schemeValue];
        if (schemeValue !== undefined && themeColorIndex !== undefined)
            return themeColorIndex;
        const themeColorIndexVariantB = ThemeColorIndexCalculator.richEditThemeColorValuesToThemeColorIndexTranslationTable[themeValue];
        return themeColorIndexVariantB !== undefined ? themeColorIndexVariantB : ThemeColorIndexConstants.None;
    }
}
ThemeColorIndexCalculator.richEditThemeColorValuesToSchemeColorValuesTranslationTable = new MapCreator()
    .add(ThemeColorValues.Accent1, SchemeColorValues.Accent1)
    .add(ThemeColorValues.Accent2, SchemeColorValues.Accent2)
    .add(ThemeColorValues.Accent3, SchemeColorValues.Accent3)
    .add(ThemeColorValues.Accent4, SchemeColorValues.Accent4)
    .add(ThemeColorValues.Accent5, SchemeColorValues.Accent5)
    .add(ThemeColorValues.Accent6, SchemeColorValues.Accent6)
    .add(ThemeColorValues.Background1, SchemeColorValues.Background1)
    .add(ThemeColorValues.Background2, SchemeColorValues.Background2)
    .add(ThemeColorValues.Dark1, SchemeColorValues.Text1)
    .add(ThemeColorValues.Dark2, SchemeColorValues.Text2)
    .add(ThemeColorValues.FollowedHyperlink, SchemeColorValues.FollowedHyperlink)
    .add(ThemeColorValues.Hyperlink, SchemeColorValues.Hyperlink)
    .add(ThemeColorValues.Light1, SchemeColorValues.Background1)
    .add(ThemeColorValues.Light2, SchemeColorValues.Background2)
    .add(ThemeColorValues.Text1, SchemeColorValues.Text1)
    .add(ThemeColorValues.Text2, SchemeColorValues.Text2)
    .get();
ThemeColorIndexCalculator.richEditThemeColorValuesToThemeColorIndexTranslationTable = new MapCreator()
    .add(ThemeColorValues.Accent1, ThemeColorIndexConstants.Accent1)
    .add(ThemeColorValues.Accent2, ThemeColorIndexConstants.Accent2)
    .add(ThemeColorValues.Accent3, ThemeColorIndexConstants.Accent3)
    .add(ThemeColorValues.Accent4, ThemeColorIndexConstants.Accent4)
    .add(ThemeColorValues.Accent5, ThemeColorIndexConstants.Accent5)
    .add(ThemeColorValues.Accent6, ThemeColorIndexConstants.Accent6)
    .add(ThemeColorValues.Background1, ThemeColorIndexConstants.Light1)
    .add(ThemeColorValues.Background2, ThemeColorIndexConstants.Light2)
    .add(ThemeColorValues.Dark1, ThemeColorIndexConstants.Dark1)
    .add(ThemeColorValues.Dark2, ThemeColorIndexConstants.Dark2)
    .add(ThemeColorValues.FollowedHyperlink, ThemeColorIndexConstants.FollowedHyperlink)
    .add(ThemeColorValues.Hyperlink, ThemeColorIndexConstants.Hyperlink)
    .add(ThemeColorValues.Light1, ThemeColorIndexConstants.Light1)
    .add(ThemeColorValues.Light2, ThemeColorIndexConstants.Light2)
    .add(ThemeColorValues.Text1, ThemeColorIndexConstants.Dark1)
    .add(ThemeColorValues.Text2, ThemeColorIndexConstants.Dark2)
    .add(ThemeColorValues.None, ThemeColorIndexConstants.None)
    .get();
