import { FontTypeHint, ThemeFontType } from './enums';
export class CompositeFontInfo {
    constructor() {
        this.asciiFontName = "";
        this.hightAnsiFontName = "";
        this.complexScriptFontName = "";
        this.eastAsiaFontName = "";
        this.asciiThemeFont = ThemeFontType.None;
        this.hightAnsiThemeFont = ThemeFontType.None;
        this.complexScriptThemeFont = ThemeFontType.None;
        this.eastAsiaThemeFont = ThemeFontType.None;
        this.hintFont = FontTypeHint.Default;
    }
    equals(obj) {
        return obj &&
            this.asciiFontName == this.asciiFontName &&
            this.hightAnsiFontName == this.hightAnsiFontName &&
            this.complexScriptFontName == this.complexScriptFontName &&
            this.eastAsiaFontName == this.eastAsiaFontName &&
            this.asciiThemeFont == this.asciiThemeFont &&
            this.hightAnsiThemeFont == this.hightAnsiThemeFont &&
            this.complexScriptThemeFont == this.complexScriptThemeFont &&
            this.eastAsiaThemeFont == this.eastAsiaThemeFont &&
            this.hintFont == this.hintFont;
    }
    clone() {
        const result = new CompositeFontInfo();
        result.asciiFontName = this.asciiFontName;
        result.hightAnsiFontName = this.hightAnsiFontName;
        result.complexScriptFontName = this.complexScriptFontName;
        result.eastAsiaFontName = this.eastAsiaFontName;
        result.asciiThemeFont = this.asciiThemeFont;
        result.hightAnsiThemeFont = this.hightAnsiThemeFont;
        result.complexScriptThemeFont = this.complexScriptThemeFont;
        result.eastAsiaThemeFont = this.eastAsiaThemeFont;
        result.hintFont = this.hintFont;
        return result;
    }
}
