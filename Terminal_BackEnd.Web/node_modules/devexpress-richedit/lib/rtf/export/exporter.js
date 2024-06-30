import { TintAndShadeCalculator } from '../../core/formats/utils/color/tint-and-shade-calculator';
import { DXColor } from '../../core/model/color/dx-color';
import { ColorType } from '../../core/model/color/enums';
import { Int32Constants } from '@devexpress/utils/lib/constants';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { RtfExportSR } from '../translation-table/rtf-export-sr';
import { RtfContentExporter } from './exporters/rtf-content-exporter';
import { RtfExportHelper } from './helpers/rtf-export-helper';
export class RtfExporter {
    constructor(modelManipulator, options) {
        this.modelManipulator = modelManipulator;
        this.documentModel = modelManipulator.model;
        this.options = options;
        this.rtfExportHelper = new RtfExportHelper();
        this.contentExporter = new RtfContentExporter(this.documentModel, options, this.rtfExportHelper);
        this.rtfBuilder = this.contentExporter.createRtfBuilder();
    }
    exportToBlob(callback) {
        this.modelManipulator.picture.loader.ensureAllPicturesLoaded(this.options.ensurePictureLoadedTimeout, (_loaded) => {
            callback(new Blob([this.exportAsString()], { type: 'application/rtf' }));
        });
    }
    exportToBase64(callback) {
        this.modelManipulator.picture.loader.ensureAllPicturesLoaded(this.options.ensurePictureLoadedTimeout, (_loaded) => {
            callback(btoa(this.exportAsString()));
        });
    }
    exportAsString() {
        this.exportCore();
        return this.rtfBuilder.rtfContent.getText();
    }
    exportCore() {
        this.contentExporter.export();
        let content = this.contentExporter.rtfBuilder.rtfContent;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.RtfSignature);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.DefaultFontIndex, this.rtfExportHelper.defaultFontIndex);
        this.exportFontTable();
        this.exportColorTable();
        this.exportDefaultProperties();
        this.exportStyleTable();
        this.exportListTable();
        this.exportListOverrideTable();
        this.exportParagraphGroupProperties();
        this.exportUsersTable();
        this.exportDocumentVariables();
        this.rtfBuilder.writeTextDirectUnsafe(content);
        this.rtfBuilder.closeGroup();
    }
    exportListTable() {
        const numberingListCollection = this.rtfExportHelper.numberingListCollection;
        const keys = Object.keys(numberingListCollection);
        if (keys.length <= 0)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.NumberingListTable);
        keys.forEach(key => {
            this.rtfBuilder.writeTextDirect(numberingListCollection[key]);
        });
        this.rtfBuilder.closeGroup();
    }
    exportListOverrideTable() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ListOverrideTable);
        const listOverrideCollection = this.rtfExportHelper.listOverrideCollection;
        const keys = Object.keys(listOverrideCollection);
        keys.forEach(key => {
            this.rtfBuilder.writeTextDirect(listOverrideCollection[key]);
        });
        this.rtfBuilder.closeGroup();
    }
    exportDefaultProperties() {
        this.exportDefaultCharacterProperties();
        this.exportDefaultParagraphProperties();
    }
    exportDefaultCharacterProperties() {
        if (StringUtils.isNullOrEmpty(this.rtfExportHelper.defaultCharacterProperties))
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.DefaultCharacterProperties);
        this.rtfBuilder.writeTextDirect(this.rtfExportHelper.defaultCharacterProperties);
        this.rtfBuilder.closeGroup();
    }
    exportDefaultParagraphProperties() {
        if (StringUtils.isNullOrEmpty(this.rtfExportHelper.defaultParagraphProperties))
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.DefaultParagraphProperties);
        this.rtfBuilder.writeTextDirect(this.rtfExportHelper.defaultParagraphProperties);
        this.rtfBuilder.closeGroup();
    }
    exportStyleTable() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.StyleTable);
        ListUtils.forEach(this.rtfExportHelper.stylesCollection, (style) => {
            this.rtfBuilder.writeTextDirect(style);
        });
        this.rtfBuilder.closeGroup();
    }
    exportUsersTable() {
        const users = this.rtfExportHelper.userCollection;
        if (users.length <= 0)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.UserTable);
        for (let i = 0; i < users.length; i++) {
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeText(users[i]);
            this.rtfBuilder.closeGroup();
        }
        this.rtfBuilder.closeGroup();
    }
    exportDocumentVariables() {
        this.documentModel.docVariables.foreach((name, value) => {
            if (!isDefined(value) || typeof (value) == "object")
                return;
            value = String(value);
            if (StringUtils.isNullOrEmpty(value))
                return;
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeCommand(RtfExportSR.DocumentVariable);
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeText(name);
            this.rtfBuilder.closeGroup();
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeText(value);
            this.rtfBuilder.closeGroup();
            this.rtfBuilder.closeGroup();
        });
    }
    exportParagraphGroupProperties() {
        const webSettings = this.contentExporter.documentModel.webSettings;
        if (!webSettings.isBodyMarginsSet())
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ParagraphGroupPropertiesTable);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ParagraphGroupProperties);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParagraphGroupPropertiesId, 0);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.LeftIndentInTwips, webSettings.leftMargin);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.RightIndentInTwips, webSettings.rightMargin);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SpaceBefore, webSettings.topMargin);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SpaceAfter, webSettings.bottomMargin);
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.closeGroup();
    }
    exportColorTable() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ColorTable);
        ListUtils.forEach(this.rtfExportHelper.colorCollection, (_color, index) => this.exportColorIndexTableEntry(index));
        this.rtfBuilder.closeGroup();
    }
    exportColorIndexTableEntry(colorIndex) {
        const colorInfo = this.rtfExportHelper.colorCollection[colorIndex];
        if (colorInfo.colorType == ColorType.Rgb)
            this.exportRgbColor(colorInfo.toRgb(this.documentModel.colorProvider));
        if (colorInfo.colorType == ColorType.Theme) {
            if (this.options.exportTheme)
                this.exportColorInfo(colorInfo);
            this.exportRgbColor(colorInfo.toRgb(this.documentModel.colorProvider));
        }
        this.rtfBuilder.writeTextDirect(";");
    }
    exportRgbColor(color) {
        if (!DXColor.isTransparentOrEmpty(color)) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ColorRed, ColorUtils.getRed(color));
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ColorGreen, ColorUtils.getGreen(color));
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ColorBlue, ColorUtils.getBlue(color));
        }
    }
    exportColorInfo(colorInfo) {
        const themeColor = RtfExportSR.ThemeColorValuesTable[colorInfo.themeValue];
        if (themeColor)
            this.rtfBuilder.writeCommand(themeColor);
        if (colorInfo.tint < 0 && colorInfo.tint > Int32Constants.MIN_VALUE) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ThemeColorTint, TintAndShadeCalculator.maxTintValue);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ThemeColorShade, TintAndShadeCalculator.calculateShadeFromColorModelInfoTint(colorInfo.tint));
        }
        if (colorInfo.tint > 0 && colorInfo.tint < Int32Constants.MAX_VALUE) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ThemeColorTint, TintAndShadeCalculator.calculateTintFromColorModelInfoTint(colorInfo.tint));
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ThemeColorShade, TintAndShadeCalculator.maxTintValue);
        }
    }
    exportFontTable() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.FontTable);
        const fontNames = this.rtfExportHelper.fontNamesCollection;
        const count = fontNames.length;
        for (let i = 0; i < count; i++)
            this.exportFontTableEntry(fontNames[i], i);
        this.rtfBuilder.closeGroup();
    }
    exportFontTableEntry(fontName, fontIndex) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.FontNumber, fontIndex);
        const containsNonAnsiChar = this.rtfBuilder.containsNonAnsiChar(fontName);
        if (containsNonAnsiChar)
            this.rtfBuilder.openGroup();
        this.rtfBuilder.writeText(fontName);
        if (containsNonAnsiChar)
            this.rtfBuilder.closeGroup();
        this.rtfBuilder.writeTextDirect(";");
        this.rtfBuilder.closeGroup();
    }
}
