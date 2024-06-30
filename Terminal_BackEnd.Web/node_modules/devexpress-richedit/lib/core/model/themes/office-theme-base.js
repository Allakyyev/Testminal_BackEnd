import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ThemeDrawingColorCollection } from './theme-drawing-color-collection';
import { ThemeFontScheme } from './theme-font-scheme';
import { ThemeFormatScheme } from './theme-format-scheme';
export class OfficeTheme {
    constructor() {
        this.name = "";
        this.colors = new ThemeDrawingColorCollection();
        this.fontScheme = new ThemeFontScheme();
        this.formatScheme = new ThemeFormatScheme();
    }
    get isValidate() {
        return !StringUtils.isNullOrEmpty(this.name) && this.colors.isValidate && this.fontScheme.isValidate && this.formatScheme.isValidate;
    }
    copyFrom(sourceObj) {
        this.name = sourceObj.name;
        this.colors.copyFrom(sourceObj.colors);
        this.fontScheme.copyFrom(sourceObj.fontScheme);
        this.formatScheme.copyFrom(sourceObj.formatScheme);
    }
    clear() {
        this.name = "";
        this.colors.clear();
        this.fontScheme.clear();
        this.formatScheme.clear();
    }
    clone() {
        var result = new OfficeTheme();
        result.copyFrom(this);
        return result;
    }
}
