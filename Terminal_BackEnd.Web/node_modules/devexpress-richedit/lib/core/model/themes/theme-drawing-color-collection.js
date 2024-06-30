import { Errors } from '@devexpress/utils/lib/errors';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { ThemeColorIndexConstants } from '../color/enums';
import { SchemeColorValues } from './enums';
export class ThemeDrawingColorCollection {
    constructor() {
        this.name = "";
        this.innerCollection = {};
    }
    tryGetDrawingColor(themeColorIndex) {
        return this.innerCollection[themeColorIndex];
    }
    setDrawingColor(themeColorIndex, value) {
        this.innerCollection[themeColorIndex] = value;
    }
    get Light1() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Light1); }
    set Light1(value) { this.setDrawingColor(ThemeColorIndexConstants.Light1, value); }
    get Light2() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Light2); }
    set Light2(value) { this.setDrawingColor(ThemeColorIndexConstants.Light2, value); }
    get Dark1() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Dark1); }
    set Dark1(value) { this.setDrawingColor(ThemeColorIndexConstants.Dark1, value); }
    get Dark2() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Dark2); }
    set Dark2(value) { this.setDrawingColor(ThemeColorIndexConstants.Dark2, value); }
    get Accent1() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Accent1); }
    set Accent1(value) { this.setDrawingColor(ThemeColorIndexConstants.Accent1, value); }
    get Accent2() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Accent2); }
    set Accent2(value) { this.setDrawingColor(ThemeColorIndexConstants.Accent2, value); }
    get Accent3() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Accent3); }
    set Accent3(value) { this.setDrawingColor(ThemeColorIndexConstants.Accent3, value); }
    get Accent4() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Accent4); }
    set Accent4(value) { this.setDrawingColor(ThemeColorIndexConstants.Accent4, value); }
    get Accent5() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Accent5); }
    set Accent5(value) { this.setDrawingColor(ThemeColorIndexConstants.Accent5, value); }
    get Accent6() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Accent6); }
    set Accent6(value) { this.setDrawingColor(ThemeColorIndexConstants.Accent6, value); }
    get Hyperlink() { return this.tryGetDrawingColor(ThemeColorIndexConstants.Hyperlink); }
    set Hyperlink(value) { this.setDrawingColor(ThemeColorIndexConstants.Hyperlink, value); }
    get FollowedHyperlink() { return this.tryGetDrawingColor(ThemeColorIndexConstants.FollowedHyperlink); }
    set FollowedHyperlink(value) { this.setDrawingColor(ThemeColorIndexConstants.FollowedHyperlink, value); }
    isValidate() { return this.checkValidation(); }
    getColorByThemeColorIndex(colorProvider, themeColorIndex) {
        const drawingColor = this.tryGetDrawingColor(themeColorIndex);
        if (drawingColor == null)
            throw new Error(Errors.InternalException);
        return drawingColor.finalColor(colorProvider);
    }
    getColorBySchemeColorValues(colorProvider, value) {
        return this.getColorByThemeColorIndex(colorProvider, ThemeDrawingColorCollection.schemeColorValuesToThemeColorIndexTranslationTable[value]);
    }
    copyFrom(sourceObj) {
        this.clear();
        this.name = sourceObj.name;
        this.innerCollection = NumberMapUtils.map(sourceObj.innerCollection, (val) => val);
    }
    clear() {
        this.name = "";
        NumberMapUtils.clear(this.innerCollection);
    }
    checkValidation() {
        return this.name != null &&
            NumberMapUtils.mapLength(this.innerCollection) == 12 &&
            this.innerCollection[ThemeColorIndexConstants.Dark1] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Light1] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Dark2] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Light2] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Accent1] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Accent2] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Accent3] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Accent4] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Accent5] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Accent6] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.Hyperlink] !== undefined &&
            this.innerCollection[ThemeColorIndexConstants.FollowedHyperlink] !== undefined;
    }
}
ThemeDrawingColorCollection.schemeColorValuesToThemeColorIndexTranslationTable = {
    [SchemeColorValues.Background1]: ThemeColorIndexConstants.Light1,
    [SchemeColorValues.Background2]: ThemeColorIndexConstants.Light2,
    [SchemeColorValues.Text1]: ThemeColorIndexConstants.Dark1,
    [SchemeColorValues.Text2]: ThemeColorIndexConstants.Dark2,
    [SchemeColorValues.Light1]: ThemeColorIndexConstants.Light1,
    [SchemeColorValues.Light2]: ThemeColorIndexConstants.Light2,
    [SchemeColorValues.Dark1]: ThemeColorIndexConstants.Dark1,
    [SchemeColorValues.Dark2]: ThemeColorIndexConstants.Dark2,
    [SchemeColorValues.Accent1]: ThemeColorIndexConstants.Accent1,
    [SchemeColorValues.Accent2]: ThemeColorIndexConstants.Accent2,
    [SchemeColorValues.Accent3]: ThemeColorIndexConstants.Accent3,
    [SchemeColorValues.Accent4]: ThemeColorIndexConstants.Accent4,
    [SchemeColorValues.Accent5]: ThemeColorIndexConstants.Accent5,
    [SchemeColorValues.Accent6]: ThemeColorIndexConstants.Accent6,
    [SchemeColorValues.Hyperlink]: ThemeColorIndexConstants.Hyperlink,
    [SchemeColorValues.FollowedHyperlink]: ThemeColorIndexConstants.FollowedHyperlink,
};
