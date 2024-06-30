import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class FontMappings {
    constructor(defaultFontName, rules) {
        this.defaultFontName = defaultFontName;
        this.rules = rules ? rules : [];
    }
    copyFrom(obj) {
        var _a;
        this.defaultFontName = obj.defaultFontName;
        this.rules = ListUtils.map((_a = obj.rules) !== null && _a !== void 0 ? _a : [], rule => new MappingRule(rule.sourceFontFamily, rule.destinationFontName));
    }
}
export class MappingRule {
    constructor(sourceFontFamily, destinationFontName) {
        this.sourceFontFamily = sourceFontFamily;
        this.destinationFontName = destinationFontName;
    }
}
export class FontsSettings {
    constructor() {
        this._defaultFolder = FontsSettings.defaultBaseUrl;
        this.fonts = [];
        this.mappings = new FontMappings();
        this.fontsMap = Object.create(null);
        this.mapRules = Object.create(null);
    }
    static get defaultBaseUrl() { return window.location.origin + '/fonts/'; }
    get defaultFolder() { return this._defaultFolder; }
    ;
    set defaultFolder(val) {
        if (!StringUtils.endsAt(val, '\\') && !StringUtils.endsAt(val, '/'))
            val += '/';
        this._defaultFolder = val;
    }
    get useMappingRules() { return this.limitedFonts && (!!this.mappings.rules.length || !!this.mappings.defaultFontName); }
    get limitedFonts() { return !!this.fonts.length; }
    getPermittedFont(fontInfoCache, font) {
        var _a;
        if (!this.useMappingRules || this.fontsMap[font.name])
            return font;
        const rule = this.mapRules[font.getFontFamilies()[0]];
        if (rule) {
            const destFont = fontInfoCache.getItemByName(rule.destinationFontName);
            if (destFont)
                return destFont;
        }
        return fontInfoCache.getItemByName((_a = this.mappings.defaultFontName) !== null && _a !== void 0 ? _a : this.fonts[0].name);
    }
    copyFrom(obj) {
        this.defaultFolder = obj.defaultFolder;
        this.fonts = ListUtils.map(obj.fonts, font => FontsSettings.createFont(font));
        this.mappings.copyFrom(obj.mappings);
        this.initInternal();
    }
    init(obj) {
        var _a, _b, _c;
        if (obj) {
            this.defaultFolder = (_a = obj.defaultFolder) !== null && _a !== void 0 ? _a : FontsSettings.defaultBaseUrl;
            this.fonts = ListUtils.map((_b = obj.fonts) !== null && _b !== void 0 ? _b : [], font => FontsSettings.createFont(font));
            this.mappings.copyFrom((_c = obj.mappings) !== null && _c !== void 0 ? _c : {});
            this.initInternal();
        }
    }
    clone() {
        const result = new FontsSettings();
        result.copyFrom(this);
        return result;
    }
    initInternal() {
        this.fontsMap = Object.create(null);
        this.fonts.forEach(font => this.fontsMap[font.name] = true);
        this.mapRules = Object.create(null);
        this.mappings.rules.forEach(rule => this.mapRules[rule.sourceFontFamily] = rule);
    }
    static createFont(obj) {
        return {
            name: obj.name,
            fontFamily: obj.fontFamily,
            googleFontsResponse: obj.googleFontsResponse,
            useGoogleFonts: obj.useGoogleFonts,
            italicFontUri: obj.italicFontUri,
            boldFontUri: obj.boldFontUri,
            boldItalicFontUri: obj.boldItalicFontUri,
            regularFontUri: obj.regularFontUri,
        };
    }
}
