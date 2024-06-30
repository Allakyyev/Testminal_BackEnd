import { MapCreator } from '../../../base-utils/map-creator';
import { ColorModelInfoCache } from '../../../core/model/caches/hashed-caches/color-model-info-cache';
import { CharacterStyle } from '../../../core/model/character/character-style';
import { CharacterFormattingScript, StrikeoutType, UnderlineType } from '../../../core/model/character/enums';
import { DXColor } from '../../../core/model/color/dx-color';
import { ParagraphStyle } from '../../../core/model/paragraph/paragraph-style';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { RtfShadingInfoExportHelper } from '../helpers/rtf-shading-info-export-helper';
import { RtfRunBackColorExportMode } from '../rtf-document-exporter-options';
import { RtfPropertiesExporter } from './rtf-properties-exporter';
export class RtfCharacterPropertiesExporter extends RtfPropertiesExporter {
    constructor(documentModel, rtfExportHelper, rtfBuilder, options) {
        super(documentModel, rtfExportHelper, rtfBuilder);
        this.emptyColorIndex = -1;
        this.defaultRtfFontSize = 24;
        this.options = options;
    }
    exportCharacterStyle(characterStyle, paragraphStyle) {
        if (this.shouldWriteRunCharacterStyle(characterStyle, paragraphStyle))
            this.writeCharacterStyle(characterStyle);
    }
    shouldWriteRunCharacterStyle(characterStyle, paragraphStyle) {
        if (characterStyle.styleName == CharacterStyle.defaultParagraphCharacterStyleName)
            return false;
        if (paragraphStyle.styleName == ParagraphStyle.normalStyleName)
            return true;
        if (paragraphStyle.linkedStyle && paragraphStyle.linkedStyle == characterStyle)
            return false;
        else
            return true;
    }
    writeCharacterStyle(characterStyle) {
        const styleCollection = this.rtfExportHelper.characterStylesCollectionIndex;
        const styleName = characterStyle.styleName;
        if (StringMapUtils.containsBy(styleCollection, (_val, key) => key == styleName))
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.CharacterStyleIndex, styleCollection[styleName]);
    }
    exportCharacterProperties(characterProperties, checkDefaultColor = false, suppressExportFontSize = false, suppressExportFontName = false) {
        this.exportCharacterPropertiesCore(characterProperties, suppressExportFontSize, suppressExportFontName);
        const info = characterProperties;
        this.writeForegroundColor(info.textColor, checkDefaultColor);
        if (this.options.compatibility.backColorExportMode == RtfRunBackColorExportMode.Default) {
            if (!ColorModelInfoCache.defaultItem.equals(info.highlightColor))
                this.writeHighlightColor(info.highlightColor);
            this.writeRunShading(info.shadingInfo);
        }
        else {
            const colorIndex = this.calculateColorIndex(info);
            if (colorIndex != this.emptyColorIndex)
                this.writeBackgroundColor(colorIndex, this.options.compatibility.backColorExportMode);
        }
        if (!ColorModelInfoCache.defaultItem.equals(info.underlineColor))
            this.writeUnderlineColor(info.underlineColor);
    }
    exportCharacterPropertiesCore(characterProperties, suppressExportFontSize, suppressExportFontName) {
        if (characterProperties.noProof)
            this.rtfBuilder.writeCommand(RtfExportSR.NoProof);
        if (characterProperties.allCaps)
            this.rtfBuilder.writeCommand(RtfExportSR.AllCapitals);
        if (characterProperties.smallCaps)
            this.rtfBuilder.writeCommand(RtfExportSR.SmallCapitals);
        if (characterProperties.hidden)
            this.rtfBuilder.writeCommand(RtfExportSR.HiddenText);
        if (characterProperties.fontBold)
            this.rtfBuilder.writeCommand(RtfExportSR.FontBold);
        if (characterProperties.fontItalic)
            this.rtfBuilder.writeCommand(RtfExportSR.FontItalic);
        if (characterProperties.fontStrikeoutType != StrikeoutType.None)
            this.rtfBuilder.writeCommand(characterProperties.fontStrikeoutType == StrikeoutType.Single ? RtfExportSR.FontStrikeout : RtfExportSR.FontDoubleStrikeout);
        if (characterProperties.script != CharacterFormattingScript.Normal)
            this.rtfBuilder.writeCommand(characterProperties.script == CharacterFormattingScript.Subscript ? RtfExportSR.RunSubScript : RtfExportSR.RunSuperScript);
        if (characterProperties.underlineWordsOnly && characterProperties.fontUnderlineType == UnderlineType.Single) {
            this.rtfBuilder.writeCommand(RtfExportSR.FontUnderlineWordsOnly);
        }
        else {
            if (characterProperties.fontUnderlineType != UnderlineType.None)
                this.writeFontUnderline(characterProperties.fontUnderlineType);
        }
        if (!suppressExportFontName && characterProperties.fontInfo) {
            const fontNameIndex = this.writeFontName(characterProperties.fontInfo.name);
            if (fontNameIndex >= 0)
                this.registerFontCharset(characterProperties, fontNameIndex);
        }
        if (!suppressExportFontSize && characterProperties.fontSize)
            this.writeFontSize(characterProperties.fontSize * 2);
    }
    exportParagraphCharacterProperties(characterProperties) {
        this.exportCharacterPropertiesCore(characterProperties, false, false);
        this.writeForegroundColor(characterProperties.textColor);
    }
    registerFontCharset(_characterProperties, _fontNameIndex) {
    }
    writeFontUnderline(underlineType) {
        if (underlineType == UnderlineType.None)
            return;
        let keyword = RtfCharacterPropertiesExporter.defaultUnderlineTypes[underlineType];
        if (!keyword || keyword == null || keyword.length == 0)
            keyword = RtfCharacterPropertiesExporter.defaultUnderlineTypes[UnderlineType.Single];
        this.rtfBuilder.writeCommand(keyword);
    }
    writeFontName(fontName) {
        let fontNameIndex = this.rtfExportHelper.getFontNameIndex(fontName);
        if (fontNameIndex == this.rtfExportHelper.defaultFontIndex)
            return -1;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.FontNumber, fontNameIndex);
        return fontNameIndex;
    }
    writeFontSize(rtfFontSize) {
        if (rtfFontSize == this.defaultRtfFontSize)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.FontSize, rtfFontSize);
    }
    calculateColorIndex(info) {
        if (!ColorModelInfoCache.defaultItem.equals(info.highlightColor))
            return this.rtfExportHelper.getColorIndex(info.highlightColor);
        const backColor = info.shadingInfo.backColor;
        if (!ColorModelInfoCache.defaultItem.equals(backColor)) {
            const color = info.shadingInfo.backColor.toRgb(this.documentModel.colorProvider);
            if (!DXColor.isTransparentOrEmpty(color))
                return this.rtfExportHelper.getColorIndex(backColor);
        }
        return this.emptyColorIndex;
    }
    writeBackgroundColor(colorIndex, mode) {
        if (mode == RtfRunBackColorExportMode.Chcbpat)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.RunBackgroundColor, colorIndex);
        else if (mode == RtfRunBackColorExportMode.Highlight)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.RunHighlightColor, colorIndex);
        else {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.RunHighlightColor, colorIndex);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.RunBackgroundColor, colorIndex);
        }
    }
    writeRunShading(shadingInfo) {
        RtfShadingInfoExportHelper.exportShadingPattern(this.rtfBuilder, this.documentModel.colorProvider, shadingInfo, RtfExportSR.RunShadingPattern);
        const shadingPatternKeyword = RtfExportSR.RunShadingPatternTable[shadingInfo.shadingPattern];
        if (shadingPatternKeyword)
            this.rtfBuilder.writeCommand(shadingPatternKeyword);
        RtfShadingInfoExportHelper.exportShadingForeColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, RtfExportSR.RunFillColor);
        RtfShadingInfoExportHelper.exportShadingBackColorIndex(this.rtfBuilder, this.rtfExportHelper, this.documentModel.colorProvider, shadingInfo, RtfExportSR.RunBackgroundColor);
    }
    writeForegroundColor(foreColor, checkDefaultColor = false) {
        const colorIndex = this.rtfExportHelper.getColorIndex(foreColor);
        if (!checkDefaultColor || !ColorModelInfoCache.defaultItem.equals(foreColor))
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.RunForegroundColor, colorIndex);
    }
    writeHighlightColor(highlightColor) {
        const colorIndex = this.rtfExportHelper.getColorIndex(highlightColor);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.RunHighlightColor, colorIndex);
    }
    writeUnderlineColor(underlineColor) {
        const colorIndex = this.rtfExportHelper.getColorIndex(underlineColor);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.RunUnderlineColor, colorIndex);
    }
}
RtfCharacterPropertiesExporter.defaultUnderlineTypes = createUnderlineTypesTable();
function createUnderlineTypesTable() {
    return new MapCreator()
        .add(UnderlineType.None, "")
        .add(UnderlineType.Single, RtfExportSR.FontUnderline)
        .add(UnderlineType.Dotted, RtfExportSR.FontUnderlineDotted)
        .add(UnderlineType.Dashed, RtfExportSR.FontUnderlineDashed)
        .add(UnderlineType.DashDotted, RtfExportSR.FontUnderlineDashDotted)
        .add(UnderlineType.DashDotDotted, RtfExportSR.FontUnderlineDashDotDotted)
        .add(UnderlineType.Double, RtfExportSR.FontUnderlineDouble)
        .add(UnderlineType.HeavyWave, RtfExportSR.FontUnderlineHeavyWave)
        .add(UnderlineType.LongDashed, RtfExportSR.FontUnderlineLongDashed)
        .add(UnderlineType.ThickSingle, RtfExportSR.FontUnderlineThickSingle)
        .add(UnderlineType.ThickDotted, RtfExportSR.FontUnderlineThickDotted)
        .add(UnderlineType.ThickDashed, RtfExportSR.FontUnderlineThickDashed)
        .add(UnderlineType.ThickDashDotted, RtfExportSR.FontUnderlineThickDashDotted)
        .add(UnderlineType.ThickDashDotDotted, RtfExportSR.FontUnderlineThickDashDotDotted)
        .add(UnderlineType.ThickLongDashed, RtfExportSR.FontUnderlineThickLongDashed)
        .add(UnderlineType.DoubleWave, RtfExportSR.FontUnderlineDoubleWave)
        .add(UnderlineType.Wave, RtfExportSR.FontUnderlineWave)
        .get();
}
