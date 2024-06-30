import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { XlFontSchemeStyles } from './enums';
import { ThemeFontSchemePart } from './theme-font-scheme-part';
export class ThemeFontScheme {
    constructor() {
        this.name = "";
        this.minorFont = new ThemeFontSchemePart();
        this.majorFont = new ThemeFontSchemePart();
    }
    get isValidate() { return !StringUtils.isNullOrEmpty(this.name) && this.minorFont.isValid && this.majorFont.isValid; }
    getTypeface(schemeStyle, currentUICulture) {
        if (schemeStyle == XlFontSchemeStyles.None)
            return "";
        if (schemeStyle == XlFontSchemeStyles.Minor)
            return this.minorFont.getTypeface(currentUICulture);
        return this.majorFont.getTypeface(currentUICulture);
    }
    copyFrom(sourceObj) {
        this.name = sourceObj.name;
        this.majorFont.copyFrom(sourceObj.majorFont);
        this.minorFont.copyFrom(sourceObj.minorFont);
    }
    clear() {
        this.name = "";
        this.majorFont.clear();
        this.minorFont.clear();
    }
}
