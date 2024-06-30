import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ColorHSL } from '../color/color-hsl';
import { DXSystemColors } from '../color/d-xsystem-colors';
import { DXColor } from '../color/dx-color';
import { DrawingColorType } from '../color/enums';
import { ScRGBColor } from '../color/sc-rgbcolor';
import { SchemeColorValues, SystemColorValues } from '../themes/enums';
export class DrawingColorModelInfo {
    constructor() {
        this.restoreDefaultValues();
    }
    calculateHash() {
        let hash = MathUtils.somePrimes[10] * this._colorType;
        switch (this._colorType) {
            case DrawingColorType.Hsl:
                hash ^= MathUtils.somePrimes[0] * this._hsl.calculateHash();
                break;
            case DrawingColorType.Preset:
                hash ^= MathUtils.somePrimes[1] * StringUtils.stringHashCode(this._preset);
                break;
            case DrawingColorType.Rgb:
                hash ^= MathUtils.somePrimes[2] * this._rgb;
                break;
            case DrawingColorType.Scheme:
                hash ^= MathUtils.somePrimes[3] * this._schemeColor;
                break;
            case DrawingColorType.ScRgb:
                hash ^= MathUtils.somePrimes[4] * this._scRgb.calculateHash();
                break;
            case DrawingColorType.System:
                hash ^= MathUtils.somePrimes[5] * this._systemColor;
                break;
        }
        return hash;
    }
    getHashCode() {
        return this.hash === undefined ? this.hash = this.calculateHash() : this.hash;
    }
    setColorType(colorType) {
        this.restoreDefaultValues();
        this._colorType = colorType;
    }
    get colorType() { return this._colorType; }
    get rgb() {
        return this._rgb;
    }
    set rgb(value) {
        if (this._colorType != DrawingColorType.Rgb)
            this.setColorType(DrawingColorType.Rgb);
        if (this._rgb != value)
            this._rgb = value;
    }
    get systemColor() {
        return this._systemColor;
    }
    set systemColor(value) {
        if (this._colorType != DrawingColorType.System)
            this.setColorType(DrawingColorType.System);
        if (this._systemColor != value)
            this._systemColor = value;
    }
    get schemeColor() {
        return this._schemeColor;
    }
    set schemeColor(value) {
        if (this._colorType != DrawingColorType.Scheme)
            this.setColorType(DrawingColorType.Scheme);
        if (this._schemeColor != value)
            this._schemeColor = value;
    }
    get hsl() {
        return this._hsl;
    }
    set hsl(value) {
        if (this._colorType != DrawingColorType.Hsl)
            this.setColorType(DrawingColorType.Hsl);
        if (!this._hsl.equals(value))
            this._hsl = value;
    }
    get preset() {
        return this._preset;
    }
    set preset(value) {
        if (this._colorType != DrawingColorType.Preset)
            this.setColorType(DrawingColorType.Preset);
        if (this._preset != value && !StringUtils.isNullOrEmpty(value))
            this._preset = value;
    }
    get scRgb() {
        return this._scRgb;
    }
    set scRgb(value) {
        if (this._colorType != DrawingColorType.ScRgb)
            this.setColorType(DrawingColorType.ScRgb);
        if (!this._scRgb.equals(value))
            this._scRgb = value;
    }
    get isEmpty() {
        return DXColor.isTransparentOrEmpty(this._rgb) && this._colorType == DrawingColorType.Rgb;
    }
    static createRGB(rgb) {
        const result = new DrawingColorModelInfo();
        result.rgb = DXColor.fromArgb(255, rgb);
        return result;
    }
    static createARGB(argb) {
        var result = new DrawingColorModelInfo();
        result.rgb = argb;
        return result;
    }
    static createSystem(systemColor) {
        var result = new DrawingColorModelInfo();
        result.systemColor = systemColor;
        return result;
    }
    static createScheme(schemeColor) {
        var result = new DrawingColorModelInfo();
        result.schemeColor = schemeColor;
        return result;
    }
    static createPreset(preset) {
        var result = new DrawingColorModelInfo();
        result.preset = preset;
        return result;
    }
    static createScRgb(scColor) {
        var result = new DrawingColorModelInfo();
        result.scRgb = scColor;
        return result;
    }
    static createHSL(hsl) {
        var result = new DrawingColorModelInfo();
        result.hsl = hsl;
        return result;
    }
    static sRgbToRgb(hexColor) {
        return ColorUtils.fromHashString(hexColor);
    }
    toRgb(colorProvider, styleColor = DXColor.empty) {
        switch (this._colorType) {
            case DrawingColorType.System:
                return this.getRgbFromSystemColor();
            case DrawingColorType.Scheme:
                return this.getRgbFromSchemeColor(colorProvider, styleColor);
            case DrawingColorType.Hsl:
                return this._hsl.toRgb();
            case DrawingColorType.Preset:
                return this.getRgbFromPreset();
            case DrawingColorType.ScRgb:
                return this._scRgb.toRgb();
            default:
                return this._rgb;
        }
    }
    getRgbFromPreset() {
        var _a;
        return (_a = ColorUtils.fromColorName(this._preset)) !== null && _a !== void 0 ? _a : DXColor.empty;
    }
    getRgbFromSystemColor() {
        return this._systemColor == SystemColorValues.Empty ? DXColor.empty : DrawingColorModelInfo.systemColorTable[this._systemColor];
    }
    getRgbFromSchemeColor(colorProvider, styleColor) {
        if (this._schemeColor == SchemeColorValues.Style)
            return styleColor;
        return this._schemeColor == SchemeColorValues.Empty ? DXColor.empty : colorProvider.officeTheme.colors.getColorBySchemeColorValues(colorProvider, this._schemeColor);
    }
    restoreDefaultValues() {
        this._rgb = DXColor.empty;
        this._schemeColor = SchemeColorValues.Empty;
        this._systemColor = SystemColorValues.Empty;
        this._preset = "";
        this._scRgb = ScRGBColor.defaultValue;
        this._hsl = ColorHSL.defaultValue;
    }
    clone() {
        var result = new DrawingColorModelInfo();
        result.copyFrom(this);
        return result;
    }
    copyFrom(value) {
        this._colorType = value._colorType;
        this._rgb = value._rgb;
        this._schemeColor = value._schemeColor;
        this._systemColor = value._systemColor;
        this._preset = value._preset;
        this._scRgb = value._scRgb;
        this._hsl = value._hsl;
    }
    equals(obj) {
        return obj &&
            this._colorType == obj._colorType &&
            this._rgb == obj._rgb &&
            this._schemeColor == obj._schemeColor &&
            this._systemColor == obj._systemColor &&
            this._preset == obj._preset &&
            this._scRgb.equals(obj._scRgb) &&
            this._hsl.equals(obj._hsl);
    }
}
DrawingColorModelInfo.empty = new DrawingColorModelInfo();
DrawingColorModelInfo.systemColorTable = {
    [SystemColorValues.Sc3dDkShadow]: DXSystemColors.controlDarkDark,
    [SystemColorValues.Sc3dLight]: DXSystemColors.controlLightLight,
    [SystemColorValues.ScActiveBorder]: DXSystemColors.activeBorder,
    [SystemColorValues.ScActiveCaption]: DXSystemColors.activeCaption,
    [SystemColorValues.ScAppWorkspace]: DXSystemColors.appWorkspace,
    [SystemColorValues.ScBackground]: DXSystemColors.desktop,
    [SystemColorValues.ScBtnFace]: DXSystemColors.control,
    [SystemColorValues.ScBtnHighlight]: DXSystemColors.controlLight,
    [SystemColorValues.ScBtnShadow]: DXSystemColors.controlDark,
    [SystemColorValues.ScBtnText]: DXSystemColors.controlText,
    [SystemColorValues.ScCaptionText]: DXSystemColors.activeCaptionText,
    [SystemColorValues.ScGradientActiveCaption]: DXSystemColors.gradientActiveCaption,
    [SystemColorValues.ScGradientInactiveCaption]: DXSystemColors.gradientInactiveCaption,
    [SystemColorValues.ScGrayText]: DXSystemColors.grayText,
    [SystemColorValues.ScHighlight]: DXSystemColors.highlight,
    [SystemColorValues.ScHighlightText]: DXSystemColors.highlightText,
    [SystemColorValues.ScHotLight]: DXSystemColors.hotTrack,
    [SystemColorValues.ScInactiveBorder]: DXSystemColors.inactiveBorder,
    [SystemColorValues.ScInactiveCaption]: DXSystemColors.inactiveCaption,
    [SystemColorValues.ScInactiveCaptionText]: DXSystemColors.inactiveCaptionText,
    [SystemColorValues.ScInfoBk]: DXSystemColors.info,
    [SystemColorValues.ScInfoText]: DXSystemColors.infoText,
    [SystemColorValues.ScMenu]: DXSystemColors.menu,
    [SystemColorValues.ScMenuBar]: DXSystemColors.menuBar,
    [SystemColorValues.ScMenuHighlight]: DXSystemColors.menuHighlight,
    [SystemColorValues.ScMenuText]: DXSystemColors.menuText,
    [SystemColorValues.ScScrollBar]: DXSystemColors.scrollBar,
    [SystemColorValues.ScWindow]: DXSystemColors.window,
    [SystemColorValues.ScWindowFrame]: DXSystemColors.windowFrame,
    [SystemColorValues.ScWindowText]: DXSystemColors.windowText,
};
