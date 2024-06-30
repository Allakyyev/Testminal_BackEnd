import { DrawingColorType, ThemeColorIndexConstants } from '../../../core/model/color/enums';
import { DrawingTextFont } from '../../../core/model/drawing/drawing-text-font';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../translation-table/translation-tables';
import { ContentType, DocxNsType } from '../../utils/constants';
import { ExporterBaseWithRootElement } from './base';
import { RelationCollectionExporter } from './relations/relation-collection';
export class ThemeExporter extends ExporterBaseWithRootElement {
    get filePath() { return 'word/theme/theme1.xml'; }
    get rootElement() { return 'theme'; }
    get rootNSPrefix() { return this.data.constants.namespaces[DocxNsType.DrawingML].prefix; }
    get rootNSValue() { return this.data.constants.namespaces[DocxNsType.DrawingML].namespace; }
    fillWriter() {
        this.data.pushRelationExporter(new RelationCollectionExporter(this.data, 'word/theme/_rels/theme1.xml.rels'));
        this.writer.attr('name', this.data.model.colorProvider.officeTheme.name);
        this.generateThemeElementsContent();
        this.generateObjectDefaults();
        this.generateExtraClrScheme();
        this.data.popRelationExporter();
        this.data.contentTypesExporter.registerContentTypeOverride('/word/theme/theme1.xml', ContentType.theme);
    }
    createElement(tag, action) {
        this.writer.elementStartNS(DocxNsType.DrawingML, tag);
        action.call(this);
        this.writer.endElement();
    }
    writeIntValue(attr, value, defaultValue) {
        if (value != defaultValue)
            this.writer.attr(attr, value.toString());
    }
    generateThemeElementsContent() {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'themeElements');
        this.generateThemeColorSchemesContent();
        this.generateThemeFontSchemesContent();
        this.generateThemeFormatSchemesContent();
        this.writer.endElement();
    }
    generateObjectDefaults() {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'objectDefaults');
        this.writer.endElement();
    }
    generateExtraClrScheme() {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'extraClrSchemeLst');
        this.writer.endElement();
    }
    generateThemeColorSchemesContent() {
        const colors = this.data.model.colorProvider.officeTheme.colors;
        this.writer.elementStartNS(DocxNsType.DrawingML, 'clrScheme');
        this.writer.attr('name', this.data.model.colorProvider.officeTheme.colors.name);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Dark1, colors.Dark1);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Light1, colors.Light1);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Dark2, colors.Dark2);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Light2, colors.Light2);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Accent1, colors.Accent1);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Accent2, colors.Accent2);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Accent3, colors.Accent3);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Accent4, colors.Accent4);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Accent5, colors.Accent5);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Accent6, colors.Accent6);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.Hyperlink, colors.Hyperlink);
        this.generateThemeColorSchemeContent(ThemeColorIndexConstants.FollowedHyperlink, colors.FollowedHyperlink);
        this.writer.endElement();
    }
    generateThemeColorSchemeContent(themeColorIndex, color) {
        this.writer.elementStartNS(DocxNsType.DrawingML, TranslationTables.simple2ThemeColorIndexTable[themeColorIndex]);
        this.generateDrawingColorContent(color);
        this.writer.endElement();
    }
    generateThemeFontSchemesContent() {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'fontScheme');
        this.writer.attr('name', this.data.model.colorProvider.officeTheme.fontScheme.name);
        this.generateThemeFontSchemePartContent(this.data.model.colorProvider.officeTheme.fontScheme.majorFont, 'majorFont');
        this.generateThemeFontSchemePartContent(this.data.model.colorProvider.officeTheme.fontScheme.minorFont, 'minorFont');
        this.writer.endElement();
    }
    generateThemeFontSchemePartContent(scheme, tagName) {
        this.writer.elementStartNS(DocxNsType.DrawingML, tagName);
        this.generateDrawingTextFontContent(scheme.latin, 'latin');
        this.generateDrawingTextFontContent(scheme.eastAsian, 'ea');
        this.generateDrawingTextFontContent(scheme.complexScript, 'cs');
        StringMapUtils.forEach(scheme.supplementalFonts, (value, key) => this.generateThemeSupplementalFontContent(key, value));
        this.writer.endElement();
    }
    generateThemeSupplementalFontContent(script, typeface) {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'font');
        this.writer.attr('script', script);
        this.writer.attr('typeface', typeface);
        this.writer.endElement();
    }
    generateDrawingTextFontContent(textFont, tagName) {
        const typeface = textFont.typeface;
        const panose = textFont.panose;
        const pitchFamily = textFont.pitchFamily;
        const charset = textFont.charset;
        this.writer.elementStartNS(DocxNsType.DrawingML, tagName);
        this.writer.attr('typeface', StringUtils.isNullOrEmpty(typeface) ? '' : typeface);
        if (!StringUtils.isNullOrEmpty(panose) && panose.length == 20)
            this.writer.attr('panose', panose);
        this.writeIntValue('pitchFamily', pitchFamily, DrawingTextFont.DefaultPitchFamily);
        this.writeIntValue('charset', charset, DrawingTextFont.DefaultCharset);
        this.writer.endElement();
    }
    generateDrawingColorContent(color) {
        if (color)
            switch (color.colorType) {
                case DrawingColorType.Rgb:
                    this.exportRgbColor(color);
                    break;
                case DrawingColorType.System:
                    this.exportSystemColor(color);
                    break;
            }
    }
    exportSystemColor(color) {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'sysClr');
        this.exportSystemColorAttributes(color.system);
        this.exportLastComputedColorAttribute(color.finalColor(this.data.model.colorProvider));
        this.writer.endElement();
    }
    exportRgbColor(color) {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'srgbClr');
        this.exportRgbColorAttributes(color.originalColor.rgb);
        this.writer.endElement();
    }
    exportRgbColorAttributes(color) {
        this.exportColorAttributes('val', color);
    }
    exportColorAttributes(tag, color) {
        this.writer.attr(tag, ColorUtils.colorToHash(color).substr(1));
    }
    exportSystemColorAttributes(color) {
        const value = TranslationTables.systemColorTable.exportMap[color];
        if (value !== undefined)
            this.writer.attr('val', value.mlValue.openXmlValue);
    }
    exportLastComputedColorAttribute(color) {
        this.exportColorAttributes('lastClr', color);
    }
    generateThemeFormatSchemesContent() {
        this.writer.elementStartNS(DocxNsType.DrawingML, 'fmtScheme');
        const name = this.data.model.colorProvider.officeTheme.formatScheme.name;
        if (!StringUtils.isNullOrEmpty(name))
            this.writer.attr('name', name);
        this.createElement('fillStyleLst', this.generateDrawingFillContent);
        this.createElement('lnStyleLst', this.generateOutlineContent);
        this.createElement('effectStyleLst', this.generateDrawingEffectStyleContent);
        this.createElement('bgFillStyleLst', this.generateDrawingBgFillContent);
        this.writer.endElement();
    }
    addTempString(str) {
        return `<tmpElement xmlns:${this.data.constants.namespaces[DocxNsType.DrawingML].prefix}=` +
            `\"${this.data.constants.namespaces[DocxNsType.DrawingML].namespace}\">` +
            str +
            '</tmpElement>';
    }
    generateDrawingFillContent() {
        this.writer.writeRaw(this.addTempString('<a:solidFill>' +
            '<a:schemeClr val="phClr"/>' +
            '</a:solidFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0">' +
            '<a:schemeClr val="phClr">' +
            '<a:tint val="50000"/>' +
            '<a:satMod val="300000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '<a:gs pos="35000">' +
            '<a:schemeClr val="phClr">' +
            '<a:tint val="37000"/>' +
            '<a:satMod val="300000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '<a:gs pos="100000">' +
            '<a:schemeClr val="phClr">' +
            '<a:tint val="15000"/>' +
            '<a:satMod val="350000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '</a:gsLst>' +
            '<a:lin ang="16200000" scaled="1"/>' +
            '</a:gradFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0">' +
            '<a:schemeClr val="phClr">' +
            '<a:shade val="51000"/>' +
            '<a:satMod val="130000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '<a:gs pos="80000">' +
            '<a:schemeClr val="phClr">' +
            '<a:shade val="93000"/>' +
            '<a:satMod val="130000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '<a:gs pos="100000">' +
            '<a:schemeClr val="phClr">' +
            '<a:shade val="94000"/>' +
            '<a:satMod val="135000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '</a:gsLst>' +
            '<a:lin ang="16200000" scaled="0"/>' +
            '</a:gradFill>'));
    }
    generateOutlineContent() {
        this.writer.writeRaw(this.addTempString('<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr">' +
            '<a:solidFill>' +
            '<a:schemeClr val="phClr">' +
            '<a:shade val="95000"/>' +
            '<a:satMod val="105000"/>' +
            '</a:schemeClr>' +
            '</a:solidFill>' +
            '<a:prstDash val="solid"/>' +
            '</a:ln>' +
            '<a:ln w="25400" cap="flat" cmpd="sng" algn="ctr">' +
            '<a:solidFill>' +
            '<a:schemeClr val="phClr"/>' +
            '</a:solidFill>' +
            '<a:prstDash val="solid"/>' +
            '</a:ln>' +
            '<a:ln w="38100" cap="flat" cmpd="sng" algn="ctr">' +
            '<a:solidFill>' +
            '<a:schemeClr val="phClr"/>' +
            '</a:solidFill>' +
            '<a:prstDash val="solid"/>' +
            '</a:ln>'));
    }
    generateDrawingEffectStyleContent() {
        this.writer.writeRaw(this.addTempString('<a:effectStyle>' +
            '<a:effectLst>' +
            '<a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0">' +
            '<a:srgbClr val="000000">' +
            '<a:alpha val="38000"/>' +
            '</a:srgbClr>' +
            '</a:outerShdw>' +
            '</a:effectLst>' +
            '</a:effectStyle>' +
            '<a:effectStyle>' +
            '<a:effectLst>' +
            '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0">' +
            '<a:srgbClr val="000000">' +
            '<a:alpha val="35000"/>' +
            '</a:srgbClr>' +
            '</a:outerShdw>' +
            '</a:effectLst>' +
            '</a:effectStyle>' +
            '<a:effectStyle>' +
            '<a:effectLst>' +
            '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0">' +
            '<a:srgbClr val="000000">' +
            '<a:alpha val="35000"/>' +
            '</a:srgbClr>' +
            '</a:outerShdw>' +
            '</a:effectLst>' +
            '<a:scene3d>' +
            '<a:camera prst="orthographicFront">' +
            '<a:rot lat="0" lon="0" rev="0"/>' +
            '</a:camera>' +
            '<a:lightRig rig="threePt" dir="t">' +
            '<a:rot lat="0" lon="0" rev="1200000"/>' +
            '</a:lightRig>' +
            '</a:scene3d>' +
            '<a:sp3d>' +
            '<a:bevelT w="63500" h="25400"/>' +
            '</a:sp3d>' +
            '</a:effectStyle>'));
    }
    generateDrawingBgFillContent() {
        this.writer.writeRaw(this.addTempString('<a:solidFill>' +
            '<a:schemeClr val="phClr"/>' +
            '</a:solidFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0">' +
            '<a:schemeClr val="phClr">' +
            '<a:tint val="40000"/>' +
            '<a:satMod val="350000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '<a:gs pos="40000">' +
            '<a:schemeClr val="phClr">' +
            '<a:tint val="45000"/>' +
            '<a:shade val="99000"/>' +
            '<a:satMod val="350000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '<a:gs pos="100000">' +
            '<a:schemeClr val="phClr">' +
            '<a:shade val="20000"/>' +
            '<a:satMod val="255000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '</a:gsLst>' +
            '<a:path path="circle">' +
            '<a:fillToRect l="50000" t="-80000" r="50000" b="180000"/>' +
            '</a:path>' +
            '</a:gradFill>' +
            '<a:gradFill rotWithShape="1">' +
            '<a:gsLst>' +
            '<a:gs pos="0">' +
            '<a:schemeClr val="phClr">' +
            '<a:tint val="80000"/>' +
            '<a:satMod val="300000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '<a:gs pos="100000">' +
            '<a:schemeClr val="phClr">' +
            '<a:shade val="30000"/>' +
            '<a:satMod val="200000"/>' +
            '</a:schemeClr>' +
            '</a:gs>' +
            '</a:gsLst>' +
            '<a:path path="circle">' +
            '<a:fillToRect l="50000" t="50000" r="50000" b="50000"/>' +
            '</a:path>' +
            '</a:gradFill>'));
    }
}
