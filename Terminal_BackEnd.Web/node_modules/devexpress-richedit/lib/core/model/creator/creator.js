import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MaskedCharacterPropertiesBundle } from '../../rich-utils/properties-bundle';
import { MaskedCharacterProperties } from '../character/character-properties';
import { CharacterStyle } from '../character/character-style';
import { CharacterPropertiesMask, UnderlineType } from '../character/enums';
import { Chunk } from '../chunk';
import { ColorHelper } from '../color/color';
import { ColorModelInfo } from '../color/color-model-info';
import { DocumentModel } from '../document-model';
import { DrawingColor } from '../drawing/drawing-color';
import { DrawingColorModelInfo } from '../drawing/drawing-color-model-info';
import { ListLevelProperties } from '../numbering-lists/list-level-properties';
import { NumberingHelper } from '../numbering-lists/numbering-helper';
import { AbstractNumberingList } from '../numbering-lists/numbering-list';
import { Paragraph } from '../paragraph/paragraph';
import { MaskedParagraphProperties, ParagraphFirstLineIndent, ParagraphPropertiesMask } from '../paragraph/paragraph-properties';
import { ParagraphStyle, TabProperties } from '../paragraph/paragraph-style';
import { RichUtils } from '../rich-utils';
import { ParagraphRun } from '../runs/simple-runs';
import { Section } from '../section/section';
import { SectionProperties } from '../section/section-properties';
import { SubDocument } from '../sub-document';
import { TableCellProperties, TableCellPropertiesMask } from '../tables/properties/table-cell-properties';
import { TableProperties, TablePropertiesMask } from '../tables/properties/table-properties';
import { TableRowProperties, TableRowPropertiesMask } from '../tables/properties/table-row-properties';
import { TableConditionalStyle } from '../tables/styles/table-conditional-style';
import { TableStyle } from '../tables/styles/table-style';
import { SystemColorValues } from '../themes/enums';
export class ModelCreator {
    constructor(options) {
        this.options = options;
    }
    static createTemplateCharProps(model) {
        const defProps = new MaskedCharacterProperties();
        defProps.fontInfo = model.cache.fontInfoCache.getItemByName('Calibri');
        return defProps;
    }
    static createDefaultCharProps(model) {
        const defProps = ModelCreator.createTemplateCharProps(model);
        defProps.setAllUse();
        return defProps;
    }
    static createTemplateParProps() {
        return new MaskedParagraphProperties();
    }
    static createDefaultParProps() {
        const defProps = ModelCreator.createTemplateParProps();
        defProps.useValue = ParagraphPropertiesMask.UseAll;
        return defProps;
    }
    static createTemplateTableProps() {
        return new TableProperties();
    }
    static createDefaultTableProps() {
        const defProps = ModelCreator.createTemplateTableProps();
        defProps.mask = TablePropertiesMask.UseAll;
        return defProps;
    }
    static createTemplateTableRowProps() {
        return new TableRowProperties();
    }
    static createDefaultTableRowProps() {
        const defProps = ModelCreator.createTemplateTableRowProps();
        defProps.mask = TableRowPropertiesMask.UseAll;
        return defProps;
    }
    static createTemplateTableCellProps() {
        return new TableCellProperties();
    }
    static createDefaultTableCellProps() {
        const defProps = ModelCreator.createTemplateTableCellProps();
        defProps.mask = TableCellPropertiesMask.UseAll;
        return defProps;
    }
    static createHyperlinkStyleCharProps(model) {
        const hyperlinkCharProp = ModelCreator.createTemplateCharProps(model);
        hyperlinkCharProp.setUseValueFull(CharacterPropertiesMask.UseForeColorIndex | CharacterPropertiesMask.UseFontUnderlineType);
        hyperlinkCharProp.textColor = ColorModelInfo.makeByColor(ColorUtils.fromString('#0000ff'));
        hyperlinkCharProp.fontUnderlineType = UnderlineType.Single;
        return hyperlinkCharProp;
    }
    static createTemplateSecProps() {
        return new SectionProperties();
    }
    static createTemplateTabProps() {
        return new TabProperties();
    }
    createModel(modelOptions) {
        this.model = new DocumentModel(modelOptions, SubDocument.MAIN_SUBDOCUMENT_ID + 1);
        return this;
    }
    setModel(model) {
        this.model = model;
        return this;
    }
    fillModel() {
        const model = this.model;
        const templateCharProps = model.cache.maskedCharacterPropertiesCache.getItem(ModelCreator.createTemplateCharProps(model));
        const templateParProp = model.cache.maskedParagraphPropertiesCache.getItem(ModelCreator.createTemplateParProps());
        const templateTableProp = ModelCreator.createTemplateTableProps();
        const templateTableRowProp = model.cache.tableRowPropertiesCache.getItem(ModelCreator.createTemplateTableRowProps());
        const templateTableCellProp = model.cache.tableCellPropertiesCache.getItem(ModelCreator.createTemplateTableCellProps());
        const templateTabProp = ModelCreator.createTemplateTabProps();
        model.pageBackColor = ColorHelper.AUTOMATIC_COLOR;
        model.defaultTabWidth = 720;
        model.differentOddAndEvenPages = false;
        model.displayBackgroundShape = false;
        model.defaultCharacterProperties = model.cache.maskedCharacterPropertiesCache.getItem(ModelCreator.createDefaultCharProps(model));
        model.defaultParagraphProperties = model.cache.maskedParagraphPropertiesCache.getItem(ModelCreator.createDefaultParProps());
        model.defaultTableProperties = ModelCreator.createDefaultTableProps();
        model.defaultTableCellProperties = model.cache.tableCellPropertiesCache.getItem(ModelCreator.createDefaultTableCellProps());
        model.defaultTableRowProperties = model.cache.tableRowPropertiesCache.getItem(ModelCreator.createDefaultTableRowProps());
        if (this.options.fillAbstractNumberingListTemplates)
            this.initNumberingListTemplates();
        if (this.options.fillCharStyles) {
            model.stylesManager.addCharacterStyle(new CharacterStyle(CharacterStyle.defaultParagraphCharacterStyleName, CharacterStyle.defaultParagraphCharacterStyleName, false, false, false, true, templateCharProps, null));
            model.stylesManager.addCharacterStyle(new CharacterStyle(CharacterStyle.hyperlinkStyleName, CharacterStyle.hyperlinkStyleName, false, false, false, true, ModelCreator.createHyperlinkStyleCharProps(model), null));
        }
        if (this.options.fillParStyles) {
            model.stylesManager.addParagraphStyle(new ParagraphStyle(ParagraphStyle.normalStyleName, ParagraphStyle.normalStyleName, false, false, false, true, templateCharProps, templateParProp, new TabProperties(), false, -1, -1, null));
        }
        if (this.options.fillTableStyles) {
            const tableConditionalStyle = new TableConditionalStyle(templateTableProp, templateTableRowProp, templateTableCellProp, templateParProp, templateCharProps, templateTabProp);
            model.stylesManager.addTableStyle(new TableStyle(TableStyle.DEFAULT_STYLENAME, TableStyle.DEFAULT_STYLENAME, false, false, false, true, {}, tableConditionalStyle, null));
        }
        if (this.options.initOfficeTheme)
            this.initOfficeTheme();
        const subDocument = model.mainSubDocument;
        const chunk = new Chunk(subDocument.positionManager.registerPosition(0), '', true);
        subDocument.chunks = [chunk];
        if (this.options.addParagraph) {
            const parChar = RichUtils.specialCharacters.ParagraphMark.substr(0);
            subDocument.paragraphs = [new Paragraph(subDocument, subDocument.positionManager.registerPosition(0), parChar.length, model.getDefaultParagraphStyle(), templateParProp)];
            chunk.textBuffer = parChar;
            chunk.textRuns = [new ParagraphRun(0, subDocument.paragraphs[0], new MaskedCharacterPropertiesBundle(templateCharProps, model.characterStyles[0]))];
        }
        if (this.options.addSection)
            model.sections = [new Section(model, subDocument.positionManager.registerPosition(0), this.options.addParagraph ? 1 : 0, ModelCreator.createTemplateSecProps())];
        return model;
    }
    initOfficeTheme() {
        this.model.colorProvider.officeTheme.name = 'Office';
        this.model.colorProvider.officeTheme.colors.Accent1 = this.getDrawingColorAsRgb(-12291388);
        this.model.colorProvider.officeTheme.colors.Accent2 = this.getDrawingColorAsRgb(-1213135);
        this.model.colorProvider.officeTheme.colors.Accent3 = this.getDrawingColorAsRgb(-5921371);
        this.model.colorProvider.officeTheme.colors.Accent4 = this.getDrawingColorAsRgb(-16384);
        this.model.colorProvider.officeTheme.colors.Accent5 = this.getDrawingColorAsRgb(-10773547);
        this.model.colorProvider.officeTheme.colors.Accent6 = this.getDrawingColorAsRgb(-9392825);
        this.model.colorProvider.officeTheme.colors.Dark1 = this.getDrawingColorAsSystem(SystemColorValues.ScWindowText);
        this.model.colorProvider.officeTheme.colors.Dark2 = this.getDrawingColorAsSystem(SystemColorValues.ScWindowText);
        this.model.colorProvider.officeTheme.colors.Light1 = this.getDrawingColorAsSystem(SystemColorValues.ScWindow);
        this.model.colorProvider.officeTheme.colors.Light2 = this.getDrawingColorAsRgb(-1579290);
        this.model.colorProvider.officeTheme.colors.FollowedHyperlink = this.getDrawingColorAsRgb(-6992014);
        this.model.colorProvider.officeTheme.colors.Hyperlink = this.getDrawingColorAsRgb(-16423999);
        this.initFontScheme();
    }
    initFontScheme() {
        this.model.colorProvider.officeTheme.fontScheme.name = 'Office';
        const majorFont = this.model.colorProvider.officeTheme.fontScheme.majorFont;
        const majorSuppFonts = {};
        majorSuppFonts.Arab = 'Times New Roman';
        majorSuppFonts.Beng = 'Vrinda';
        majorSuppFonts.Cans = 'Euphemia';
        majorSuppFonts.Cher = 'Plantagenet Cherokee';
        majorSuppFonts.Deva = 'Mangal';
        majorSuppFonts.Ethi = 'Nyala';
        majorSuppFonts.Geor = 'Sylfaen';
        majorSuppFonts.Gujr = 'Shruti';
        majorSuppFonts.Guru = 'Raavi';
        majorSuppFonts.Hang = '맑은 고딕';
        majorSuppFonts.Hans = '等线 Light';
        majorSuppFonts.Hant = '新細明體';
        majorSuppFonts.Hebr = 'Times New Roman';
        majorSuppFonts.Jpan = '游ゴシック Light';
        majorSuppFonts.Khmr = 'MoolBoran';
        majorSuppFonts.Knda = 'Tunga';
        majorSuppFonts.Laoo = 'DokChampa';
        majorSuppFonts.Mlym = 'Kartika';
        majorSuppFonts.Mong = 'Mongolian Baiti';
        majorSuppFonts.Orya = 'Kalinga';
        majorSuppFonts.Sinh = 'Iskoola Pota';
        majorSuppFonts.Syrc = 'Estrangelo Edessa';
        majorSuppFonts.Taml = 'Latha';
        majorSuppFonts.Telu = 'Gautami';
        majorSuppFonts.Thaa = 'MV Boli';
        majorSuppFonts.Thai = 'Angsana New';
        majorSuppFonts.Tibt = 'Microsoft Himalaya';
        majorSuppFonts.Uigh = 'Microsoft Uighur';
        majorSuppFonts.Viet = 'Times New Roman';
        majorSuppFonts.Yiii = 'Microsoft Yi Baiti';
        majorFont.supplementalFonts = majorSuppFonts;
        majorFont.complexScript.charset = 1;
        majorFont.complexScript.pitchFamily = 0;
        majorFont.complexScript.typeface = '';
        majorFont.complexScript.panose = '';
        majorFont.eastAsian.charset = 1;
        majorFont.eastAsian.pitchFamily = 0;
        majorFont.eastAsian.typeface = '';
        majorFont.eastAsian.panose = '';
        majorFont.latin.charset = 1;
        majorFont.latin.pitchFamily = 0;
        majorFont.latin.typeface = 'Calibri Light';
        majorFont.latin.panose = '020F0302020204030204';
        const minorFont = this.model.colorProvider.officeTheme.fontScheme.minorFont;
        const minorSuppFonts = {};
        minorSuppFonts.Arab = 'Arial';
        minorSuppFonts.Beng = 'Vrinda';
        minorSuppFonts.Cans = 'Euphemia';
        minorSuppFonts.Cher = 'Plantagenet Cherokee';
        minorSuppFonts.Deva = 'Mangal';
        minorSuppFonts.Ethi = 'Nyala';
        minorSuppFonts.Geor = 'Sylfaen';
        minorSuppFonts.Gujr = 'Shruti';
        minorSuppFonts.Guru = 'Raavi';
        minorSuppFonts.Hang = '맑은 고딕';
        minorSuppFonts.Hans = '等线';
        minorSuppFonts.Hant = '新細明體';
        minorSuppFonts.Hebr = 'Arial';
        minorSuppFonts.Jpan = '游明朝';
        minorSuppFonts.Khmr = 'DaunPenh';
        minorSuppFonts.Knda = 'Tunga';
        minorSuppFonts.Laoo = 'DokChampa';
        minorSuppFonts.Mlym = 'Kartika';
        minorSuppFonts.Mong = 'Mongolian Baiti';
        minorSuppFonts.Orya = 'Kalinga';
        minorSuppFonts.Sinh = 'Iskoola Pota';
        minorSuppFonts.Syrc = 'Estrangelo Edessa';
        minorSuppFonts.Taml = 'Latha';
        minorSuppFonts.Telu = 'Gautami';
        minorSuppFonts.Thaa = 'MV Boli';
        minorSuppFonts.Thai = 'Cordia New';
        minorSuppFonts.Tibt = 'Microsoft Himalaya';
        minorSuppFonts.Uigh = 'Microsoft Uighur';
        minorSuppFonts.Viet = 'Arial';
        minorSuppFonts.Yiii = 'Microsoft Yi Baiti';
        minorFont.supplementalFonts = minorSuppFonts;
        minorFont.complexScript.charset = 1;
        minorFont.complexScript.pitchFamily = 0;
        minorFont.complexScript.typeface = '';
        minorFont.complexScript.panose = '';
        minorFont.eastAsian.charset = 1;
        minorFont.eastAsian.pitchFamily = 0;
        minorFont.eastAsian.typeface = '';
        minorFont.eastAsian.panose = '';
        minorFont.latin.charset = 1;
        minorFont.latin.pitchFamily = 0;
        minorFont.latin.typeface = 'Calibri';
        minorFont.latin.panose = '020F0502020204030204';
    }
    getDrawingColorAsRgb(rgb) {
        return new DrawingColor(this.model.cache.drawingColorModelInfoCache.getItem(DrawingColorModelInfo.createRGB(rgb)));
    }
    getDrawingColorAsSystem(val) {
        return new DrawingColor(this.model.cache.drawingColorModelInfoCache.getItem(DrawingColorModelInfo.createSystem(val)));
    }
    initNumberingListTemplates() {
        this.model.abstractNumberingListTemplates = [];
        let leftIndent = 0;
        const numberingTemplate = new AbstractNumberingList(this.model);
        ListUtils.forEach(numberingTemplate.levels, (level, index) => {
            const prop = new ListLevelProperties();
            const parProp = new MaskedParagraphProperties();
            parProp.copyFrom(this.model.defaultParagraphProperties);
            prop.displayFormatString = `{${index}}.`;
            prop.templateCode = NumberingHelper.generateNewTemplateCode(this.model);
            parProp.firstLineIndent = 360;
            parProp.firstLineIndentType = ParagraphFirstLineIndent.Hanging;
            leftIndent += 720;
            parProp.leftIndent = leftIndent;
            level.setListLevelProperties(prop);
            level.setParagraphProperties(parProp);
        });
        this.model.abstractNumberingListTemplates.push(numberingTemplate);
        leftIndent = 0;
        const bulletTemplate = new AbstractNumberingList(this.model);
        ListUtils.forEach(bulletTemplate.levels, (level) => {
            const prop = new ListLevelProperties();
            const parProp = new MaskedParagraphProperties();
            parProp.copyFrom(this.model.defaultParagraphProperties);
            prop.displayFormatString = `•`;
            prop.format = 5;
            prop.templateCode = NumberingHelper.generateNewTemplateCode(this.model);
            level.getCharacterProperties().fontInfo = this.model.cache.fontInfoCache.getItemByName('Arial');
            parProp.firstLineIndent = 360;
            parProp.firstLineIndentType = ParagraphFirstLineIndent.Hanging;
            leftIndent += 720;
            parProp.leftIndent = leftIndent;
            level.setListLevelProperties(prop);
            level.setParagraphProperties(parProp);
        });
        this.model.abstractNumberingListTemplates.push(bulletTemplate);
        const multiTemplate = new AbstractNumberingList(this.model);
        let displayFormatString = '';
        const levelOffset = 360;
        const alignPositionsInDocuments = [360, 792, 1224, 1728, 2232, 2736, 3240, 3744, 4320];
        ListUtils.forEach(multiTemplate.levels, (level, index) => {
            const prop = new ListLevelProperties();
            const parProp = new MaskedParagraphProperties();
            parProp.copyFrom(this.model.defaultParagraphProperties);
            displayFormatString += `{${index}}.`;
            prop.displayFormatString = displayFormatString;
            level.setListLevelProperties(prop);
            const firstLinePosition = levelOffset * index;
            parProp.leftIndent = alignPositionsInDocuments[index];
            parProp.firstLineIndent = parProp.leftIndent - firstLinePosition;
            parProp.firstLineIndentType = ParagraphFirstLineIndent.Hanging;
            level.setParagraphProperties(parProp);
        });
        this.model.abstractNumberingListTemplates.push(multiTemplate);
    }
}
