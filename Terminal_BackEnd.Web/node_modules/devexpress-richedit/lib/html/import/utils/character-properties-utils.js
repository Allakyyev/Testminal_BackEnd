import { CharacterFormattingScript, CharacterPropertiesMask, StrikeoutType, UnderlineType } from '../../../core/model/character/enums';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { FontChooser } from '../../../core/model/fonts/font-chooser';
import { ControlOptions } from '../../../core/model/options/control';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { MaskedCharacterPropertiesBundle } from '../../../core/rich-utils/properties-bundle';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { LoadFontInfo } from '../load-font-info';
import { HtmlImporterFontUtils } from './font-utils';
export class HtmlImporterMaskedCharacterProperties {
    constructor(importer, loadFontInfos, tempFontInfoCache, allowCreateNewFonts) {
        this.importer = importer;
        this.loadFontInfos = loadFontInfos;
        this.tempFontInfoCache = tempFontInfoCache;
        this.allowCreateNewFonts = allowCreateNewFonts;
    }
    get model() { return this.importer.modelManager.model; }
    ;
    get controlOptions() { return this.importer.modelManager.richOptions.control; }
    ;
    getBundleFrom(element, interval) {
        return new MaskedCharacterPropertiesBundle(this.import(element, interval, this.importer.charPropsBundle.props), this.importer.charPropsBundle.style);
    }
    import(element, interval, initialCharacterProperties) {
        this.initialCharacterProperties = initialCharacterProperties;
        this.result = initialCharacterProperties.clone();
        this.styledElement = DomUtils.isHTMLElementNode(element) ? element : (element.parentElement || element.parentNode);
        if (this.styledElement !== element && this.styledElement.tagName.toUpperCase() == 'TD')
            return this.result;
        this.currentStyle = DomUtils.getCurrentStyle(this.styledElement);
        if (!this.currentStyle)
            return this.result;
        this.importFontBold();
        this.importFontItalic();
        this.importAllCaps();
        this.importStrikeoutType();
        this.importUnderlineType();
        this.importForeColor();
        this.importBackColor();
        this.importFontInfo(interval);
        this.importFontSize();
        this.importHidden();
        this.importSuperscript();
        this.importSubscript();
        return this.result;
    }
    importFontBold() {
        switch (this.currentStyle.fontWeight) {
            case "bold":
            case "700":
                this.result.fontBold = true;
                this.result.setUseValue(CharacterPropertiesMask.UseFontBold, true);
        }
    }
    importFontItalic() {
        if (this.currentStyle.fontStyle == "italic") {
            this.result.fontItalic = true;
            this.result.setUseValue(CharacterPropertiesMask.UseFontItalic, true);
        }
    }
    importAllCaps() {
        if (this.currentStyle.textTransform == "uppercase") {
            this.result.allCaps = true;
            this.result.setUseValue(CharacterPropertiesMask.UseAllCaps, true);
        }
    }
    importStrikeoutType() {
        if (/.*line-through.*/gi.test(this.currentStyle.textDecoration)) {
            this.result.fontStrikeoutType = StrikeoutType.Single;
            this.result.setUseValue(CharacterPropertiesMask.UseFontStrikeoutType, true);
        }
    }
    importUnderlineType() {
        if (/.*underline.*/gi.test(this.currentStyle.textDecoration)) {
            this.result.fontUnderlineType = UnderlineType.Single;
            this.result.setUseValue(CharacterPropertiesMask.UseFontUnderlineType, true);
        }
    }
    importForeColor() {
        if (this.styledElement.style.color !== "") {
            const foreColor = ColorUtils.fromString(this.currentStyle.color);
            if (foreColor != null) {
                this.result.textColor = ColorModelInfo.makeByColor(foreColor);
                this.result.setUseValue(CharacterPropertiesMask.UseForeColorIndex, true);
            }
        }
    }
    importBackColor() {
        if (this.styledElement.style.backgroundColor !== "") {
            const backColor = ColorUtils.fromString(this.currentStyle.backgroundColor);
            if (backColor) {
                this.result.shadingInfo = ShadingInfo.createByColor(ColorModelInfo.makeByColor(backColor));
                this.result.setUseValue(CharacterPropertiesMask.UseShadingInfoIndex, true);
                this.result.setUseValue(CharacterPropertiesMask.UseHighlightColorIndex, false);
            }
        }
    }
    importFontInfo(interval) {
        if (this.styledElement.style.fontFamily) {
            const cssFontFamily = this.currentStyle.fontFamily;
            let fontInfo = new FontChooser(this.model.cache.fontInfoCache).chooseByCssString(cssFontFamily);
            if (!fontInfo) {
                if (ControlOptions.isEnabled(this.controlOptions.characterFormatting) && this.allowCreateNewFonts) {
                    const fontName = DomUtils.getFontFamiliesFromCssString(cssFontFamily)[0];
                    fontInfo = this.tempFontInfoCache.getItemByName(fontName);
                    if (!fontInfo) {
                        const sourceFont = this.initialCharacterProperties.fontInfo || this.model.defaultCharacterProperties.fontInfo;
                        fontInfo = sourceFont.clone();
                        fontInfo.name = fontName;
                        fontInfo.cssString = cssFontFamily;
                        this.tempFontInfoCache.getItem(fontInfo);
                    }
                    this.loadFontInfos.push(new LoadFontInfo(fontInfo, this.importer.subDocument, interval));
                }
                else
                    fontInfo = this.model.defaultCharacterProperties.fontInfo;
            }
            this.result.fontInfo = fontInfo;
            this.result.setUseValue(CharacterPropertiesMask.UseFontName, true);
        }
    }
    importFontSize() {
        if (this.styledElement.style.fontSize) {
            const parentCurrentStyle = DomUtils.getCurrentStyle(this.styledElement.parentElement || this.styledElement.parentNode);
            const fontSize = HtmlImporterFontUtils.getFontSize(this.currentStyle.fontSize, parentCurrentStyle ? parentCurrentStyle.fontSize : null);
            if (fontSize != null && fontSize > 0) {
                this.result.fontSize = fontSize;
                this.result.setUseValue(CharacterPropertiesMask.UseDoubleFontSize, true);
            }
        }
    }
    importHidden() {
        if (this.currentStyle.display == "none") {
            this.result.hidden = true;
            this.result.setUseValue(CharacterPropertiesMask.UseHidden, true);
        }
    }
    importSuperscript() {
        if (this.currentStyle.verticalAlign == "super") {
            this.result.script = CharacterFormattingScript.Superscript;
            this.result.setUseValue(CharacterPropertiesMask.UseScript, true);
        }
    }
    importSubscript() {
        if (this.currentStyle.verticalAlign == "sub") {
            this.result.script = CharacterFormattingScript.Subscript;
            this.result.setUseValue(CharacterPropertiesMask.UseScript, true);
        }
    }
}
