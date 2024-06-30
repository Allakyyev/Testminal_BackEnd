import { DocumentProtectionType } from '../../../../core/model/json/enums/json-document-enums';
import { RichUtils } from '../../../../core/model/rich-utils';
import { HeaderFooterType, LineNumberingRestartType, SectionStartType } from '../../../../core/model/section/enums';
import { CompatibilityMode } from '../../../../core/model/document-model';
import { RtfListConverter } from '../../model/numbering-lists/rtf-list-converter';
import { SkipDestination } from '../base/skip-destination';
import { CustomPropertiesDestination } from '../custom-properties-destination';
import { InfoDestination } from '../info/info-destination';
import { ListOverrideTableDestination } from '../numbering-list/list-override-table-destination';
import { ListTableDestination } from '../numbering-list/list-table-destination';
import { PageBackgroundDestination } from '../page-background-destination';
import { DefaultCharacterPropertiesDestination } from '../properties/default-character-properties-destination';
import { DefaultParagraphPropertiesDestination } from '../properties/default-paragraph-properties-destination';
import { StyleSheetDestination } from '../styles/style-sheet-destination';
import { DestinationType } from '../utils/destination-type';
import { DestinationSubDocument } from './destination-sub-document';
export class DefaultDestination extends DestinationSubDocument {
    get destinationType() { return DestinationType.DefaultDestination; }
    static onDeffKeyword(importer, parameterValue, _hasParameter) {
        importer.importers.font.defaultFontNumber = parameterValue;
    }
    static onInfoKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new InfoDestination(importer);
    }
    static onUserPropKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new CustomPropertiesDestination(importer);
    }
    static onDefaultCharacterPropertiesKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new DefaultCharacterPropertiesDestination(importer);
    }
    static onDefaultParagraphPropertiesKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new DefaultParagraphPropertiesDestination(importer);
    }
    static onPageBackground(importer, _parameterValue, _hasParameter) {
        importer.destination = new PageBackgroundDestination(importer);
    }
    static onThemeData(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onColorsSchemeMapping(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onNoFeatureThrottle(importer, parameterValue, _hasParameter) {
        importer.importerOptions.enableNotCompatibleUIFunctionality = parameterValue == 1;
    }
    static onNoUICompat(importer, _parameterValue, _hasParameter) {
        importer.documentModel.compatibilitySettings.compatibilityMode = CompatibilityMode.Word2007;
        importer.importerOptions.enableNotCompatibleUIFunctionality = true;
    }
    static onDefaultTabKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter || parameterValue <= 0)
            parameterValue = 720;
        importer.documentModel.defaultTabWidth = parameterValue;
    }
    static onMirrorMargins(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 1;
        importer.documentModel.mirrorMargins = parameterValue != 0;
    }
    static onRemovePersonalInformation(_importer, _parameterValue, _hasParameter) {
    }
    static onEnforceDocumentProtection(_importer, _parameterValue, _hasParameter) {
    }
    static onFormProtection(importer, _parameterValue, _hasParameter) {
        const protectionProperties = importer.documentModel.documentProtectionProperties;
        protectionProperties.enforceProtection = true;
        protectionProperties.protectionType = DocumentProtectionType.ReadOnly;
    }
    static onRevisionProtection(importer, _parameterValue, _hasParameter) {
        const protectionProperties = importer.documentModel.documentProtectionProperties;
        protectionProperties.enforceProtection = true;
        protectionProperties.protectionType = DocumentProtectionType.TrackedChanges;
    }
    static onAnnotationProtection(importer, _parameterValue, _hasParameter) {
        const protectionProperties = importer.documentModel.documentProtectionProperties;
        protectionProperties.enforceProtection = true;
        protectionProperties.protectionType = DocumentProtectionType.AllowComments;
    }
    static onReadOnlyProtection(importer, _parameterValue, _hasParameter) {
        const protectionProperties = importer.documentModel.documentProtectionProperties;
        if (!protectionProperties.enforceProtection)
            return;
        protectionProperties.protectionType = DocumentProtectionType.ReadOnly;
    }
    static onDocumentProtectionLevel(importer, parameterValue, hasParameter) {
        const protectionProperties = importer.documentModel.documentProtectionProperties;
        if (!hasParameter || protectionProperties.protectionType != DocumentProtectionType.None)
            return;
        switch (parameterValue) {
            case 0:
                protectionProperties.protectionType = DocumentProtectionType.TrackedChanges;
                break;
            case 1:
                protectionProperties.protectionType = DocumentProtectionType.AllowComments;
                break;
            case 2:
            case 3:
                protectionProperties.protectionType = DocumentProtectionType.ReadOnly;
                break;
            case 7:
                protectionProperties.protectionType = DocumentProtectionType.None;
                break;
        }
    }
    static onPageBreakKeyword(importer, _parameterValue, _hasParameter) {
        importer.parseCharWithoutDecoding(RichUtils.specialCharacters.PageBreak);
    }
    static onColumnBreakKeyword(importer, _parameterValue, _hasParameter) {
        importer.parseCharWithoutDecoding(RichUtils.specialCharacters.ColumnBreak);
    }
    static onPaperWidthKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 12240;
        const value = parameterValue;
        importer.importers.section.defaultSectionProperties.coreProperties.pageWidth = value;
        importer.importers.section.currentProperties.coreProperties.pageWidth = value;
    }
    static onPaperHeightKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 15840;
        const value = parameterValue;
        importer.importers.section.defaultSectionProperties.coreProperties.pageHeight = value;
        importer.importers.section.currentProperties.coreProperties.pageHeight = value;
    }
    static onPaperSizeKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onLandscapeKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.defaultSectionProperties.coreProperties.landscape = true;
        importer.importers.section.currentProperties.coreProperties.landscape = true;
    }
    static onGutterKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onLeftMarginKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 1800;
        const value = parameterValue;
        importer.importers.section.defaultSectionProperties.coreProperties.marginLeft = value;
        importer.importers.section.currentProperties.coreProperties.marginLeft = value;
    }
    static onRightMarginKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 1800;
        const value = parameterValue;
        importer.importers.section.defaultSectionProperties.coreProperties.marginRight = value;
        importer.importers.section.currentProperties.coreProperties.marginRight = value;
    }
    static onTopMarginKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 1440;
        const value = parameterValue;
        importer.importers.section.defaultSectionProperties.coreProperties.marginTop = value;
        importer.importers.section.currentProperties.coreProperties.marginTop = value;
    }
    static onBottomMarginKeyword(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 1440;
        const value = parameterValue;
        importer.importers.section.defaultSectionProperties.coreProperties.marginBottom = value;
        importer.importers.section.currentProperties.coreProperties.marginBottom = value;
    }
    static onGutterAtRight(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingStart(_importer, _parameterValue, _hasParameter) {
    }
    static onPageFacing(importer, _parameterValue, _hasParameter) {
        importer.documentModel.differentOddAndEvenPages = true;
    }
    static onNoColumnBalance(_importer, _parameterValue, _hasParameter) {
    }
    static onDoNotAlignTableRowsIndependently(_importer, _parameterValue, _hasParameter) {
    }
    static onDoNotExpandShiftReturn(_importer, _parameterValue, _hasParameter) {
    }
    static onSplitPageBreakAndParagraphMark(_importer, _parameterValue, _hasParameter) {
    }
    static onAllowTablesToExtendIntoMargin(_importer, _parameterValue, _hasParameter) {
    }
    static onDisplayBackgroundShape(importer, parameterValue, _hasParameter) {
        importer.documentModel.displayBackgroundShape = parameterValue == 1 ? true : false;
    }
    static onPageNumberingDecimal(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingUpperRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingLowerRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingUpperLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingLowerLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingArabicAbjad(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingArabicAlpha(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingChosung(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingDecimalEnclosedCircle(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingDecimalFullWidth(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingGanada(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingHindiVowels(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingHindiConsonants(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingHindiNumbers(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingHindiDescriptive(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingThaiLetters(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingThaiNumbers(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingThaiDescriptive(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingVietnameseDescriptive(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingChapterHeaderStyle(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingChapterSeparatorHyphen(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingChapterSeparatorPeriod(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingChapterSeparatorColon(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingChapterSeparatorEmDash(_importer, _parameterValue, _hasParameter) {
    }
    static onPageNumberingChapterSeparatorEnDash(_importer, _parameterValue, _hasParameter) {
    }
    static onVerticalTextAlignmentBottom(_importer, _parameterValue, _hasParameter) {
    }
    static onVerticalTextAlignmentTop(_importer, _parameterValue, _hasParameter) {
    }
    static onVerticalTextAlignmentCenter(_importer, _parameterValue, _hasParameter) {
    }
    static onVerticalTextAlignmentJustify(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionPageNumberingStart(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 1;
        importer.importers.section.currentProperties.pageNumbering.firstPageNumber = parameterValue;
        importer.importers.section.currentProperties.pageNumbering.continueNumbering = false;
    }
    static onSectionPageNumberingContinuous(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.restartPageNumbering = false;
    }
    static onSectionPageNumberingRestart(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.restartPageNumbering = true;
    }
    static onSectionTextFlow(_importer, _parameterValue, _hasParameter) {
    }
    static onLineNumberingStep(_importer, _parameterValue, _hasParameter) {
    }
    static onLineNumberingDistance(_importer, _parameterValue, _hasParameter) {
    }
    static onLineNumberingStartingLineNumber(_importer, _parameterValue, _hasParameter) {
    }
    static onLineNumberingRestart(_importer, _parameterValue, _hasParameter) {
    }
    static onLineNumberingRestartOnEachPage(_importer, _parameterValue, _hasParameter) {
    }
    static onLineNumberingContinuous(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionPaperWidth(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.pageWidth = parameterValue;
    }
    static onSectionPaperHeight(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.pageHeight = parameterValue;
    }
    static onSectionLandscape(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.landscape = true;
    }
    static onSectionLeftMargin(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.marginLeft = parameterValue;
    }
    static onSectionRightMargin(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.marginRight = parameterValue;
    }
    static onSectionTopMargin(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.marginTop = parameterValue;
    }
    static onSectionBottomMargin(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.marginBottom = parameterValue;
    }
    static onSectionGutter(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionHeaderOffset(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 720;
        importer.importers.section.currentProperties.coreProperties.headerOffset = parameterValue;
    }
    static onSectionFooterOffset(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 720;
        importer.importers.section.currentProperties.coreProperties.footerOffset = parameterValue;
    }
    static onSectionFirstPagePaperSource(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionOtherPagePaperSource(_importer, _parameterValue, _hasParameter) {
    }
    static onOnlyAllowEditingOfFormFields(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionColumnCount(importer, parameterValue, hasParameter) {
        if (!hasParameter || parameterValue < 1)
            parameterValue = 1;
        importer.importers.section.currentProperties.coreProperties.columnCount = parameterValue;
        importer.importers.section.currentProperties.coreProperties.equalWidthColumns = true;
    }
    static onSectionColumnSpace(importer, parameterValue, hasParameter) {
        if (!hasParameter)
            parameterValue = 720;
        importer.importers.section.currentProperties.coreProperties.space = parameterValue;
        importer.importers.section.currentProperties.coreProperties.equalWidthColumns = true;
    }
    static onSectionCurrentColumnIndex(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.currentColumnIndex = parameterValue - 1;
        importer.importers.section.currentProperties.coreProperties.equalWidthColumns = false;
    }
    static onSectionCurrentColumnSpace(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.setCurrentColumnSpace(parameterValue);
        importer.importers.section.currentProperties.coreProperties.equalWidthColumns = false;
    }
    static onSectionCurrentColumnWidth(importer, parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.setCurrentColumnWidth(parameterValue);
        importer.importers.section.currentProperties.coreProperties.equalWidthColumns = false;
    }
    static onSectionDrawVerticalSeparator(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionBreakNone(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.startType = SectionStartType.Continuous;
    }
    static onSectionBreakColumn(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.startType = SectionStartType.Column;
    }
    static onSectionBreakPage(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.startType = SectionStartType.NextPage;
    }
    static onSectionBreakEvenPage(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.startType = SectionStartType.EvenPage;
    }
    static onSectionBreakOddPage(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.startType = SectionStartType.OddPage;
    }
    static onSectionDefault(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.copyFrom(importer.importers.section.defaultSectionProperties);
    }
    static onNewSection(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertSection();
        importer.importers.table.tableReader.resetState();
    }
    static onHeaderKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(true, HeaderFooterType.Odd);
    }
    static onHeaderForLeftPagesKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(true, HeaderFooterType.Even);
    }
    static onHeaderForRightPagesKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(true, HeaderFooterType.Odd);
    }
    static onHeaderForFirstPageKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(true, HeaderFooterType.First);
    }
    static onFooterKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(false, HeaderFooterType.Odd);
    }
    static onFooterForLeftPagesKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(false, HeaderFooterType.Even);
    }
    static onFooterForRightPagesKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(false, HeaderFooterType.Odd);
    }
    static onFooterForFirstPageKeyword(importer, _parameterValue, _hasParameter) {
        importer.importers.section.insertHeaderFooter(false, HeaderFooterType.First);
    }
    static onSectionDifferentFirstPage(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.coreProperties.differentFirstPage = true;
    }
    static onListTableKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ListTableDestination(importer);
        importer.importers.character.characterFormatting.coreProperties.resetAllUse();
    }
    static onListOverrideTableKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new ListOverrideTableDestination(importer);
        importer.importers.character.characterFormatting.coreProperties.resetAllUse();
    }
    static onLtrSectionKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onRtlSectionKeyword(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNotePlacementBelowText(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNotePlacementPageBottom(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingStart(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingRestartEachPage(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingRestartEachSection(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingRestartContinuous(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingDecimal(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingLowerCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingUpperCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingLowerCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingUpperCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingChicago(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingChosung(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingDecimalEnclosedCircle(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingDecimalFullWidth(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionFootNoteNumberingGanada(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingStart(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingRestartEachSection(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingRestartContinuous(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingDecimal(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingLowerCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingUpperCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingLowerCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingUpperCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingChicago(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingChosung(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingDecimalEnclosedCircle(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingDecimalFullWidth(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionEndNoteNumberingGanada(_importer, _parameterValue, _hasParameter) {
    }
    static onSectionLineNumberingCountBy(importer, parameterValue, hasParameter) {
        if (hasParameter)
            importer.importers.section.currentProperties.lineNumbering.countBy = Math.max(0, parameterValue);
    }
    static onSectionLineNumberingDistance(importer, parameterValue, hasParameter) {
        if (hasParameter && parameterValue >= 0)
            importer.importers.section.currentProperties.lineNumbering.distance = Math.max(0, parameterValue);
    }
    static onSectionLineNumberingStart(importer, parameterValue, hasParameter) {
        if (hasParameter)
            importer.importers.section.currentProperties.lineNumbering.start = Math.max(1, parameterValue);
    }
    static onSectionLineNumberingNewSection(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.lineNumbering.restart = LineNumberingRestartType.NewSection;
    }
    static onSectionLineNumberingNewPage(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.lineNumbering.restart = LineNumberingRestartType.NewPage;
    }
    static onSectionLineNumberingContinuous(importer, _parameterValue, _hasParameter) {
        importer.importers.section.currentProperties.lineNumbering.restart = LineNumberingRestartType.Continuous;
    }
    static onFootNotePlacementEndOfSection(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNotePlacementEndOfDocument(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNotePlacementBelowText(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNotePlacementPageBottom(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingStart(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingRestartEachPage(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingRestartEachSection(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingRestartContinuous(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingDecimal(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingLowerCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingUpperCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingLowerCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingUpperCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingChicago(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingChosung(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingDecimalEnclosedCircle(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingDecimalFullWidth(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteNumberingGanada(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNotePlacementEndOfSection(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNotePlacementEndOfDocument(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNotePlacementBelowText(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNotePlacementPageBottom(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingStart(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingRestartEachSection(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingRestartContinuous(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingDecimal(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingLowerCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingUpperCaseLetter(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingLowerCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingUpperCaseRoman(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingChicago(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingChosung(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingDecimalEnclosedCircle(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingDecimalFullWidth(_importer, _parameterValue, _hasParameter) {
    }
    static onEndNoteNumberingGanada(_importer, _parameterValue, _hasParameter) {
    }
    static onFootNoteKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onCommentStartPositionKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onCommentEndPositionKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onCommentIdKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onCommentAuthorKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    static onCommentAnnotationKeyword(importer, _parameterValue, _hasParameter) {
        importer.destination = new SkipDestination(importer);
    }
    beforeNestedGroupFinishedCore(_nestedDestination) {
    }
    nestedGroupFinished(nestedDestination) {
        super.nestedGroupFinished(nestedDestination);
        if (nestedDestination instanceof ListTableDestination)
            this.importer.documentProperties.listTableComplete = true;
        if (nestedDestination instanceof ListOverrideTableDestination)
            this.importer.documentProperties.listOverrideTableComplete = true;
        if (this.importer.documentProperties.listOverrideTableComplete && this.importer.documentProperties.listTableComplete) {
            const converter = new RtfListConverter(this.importer);
            converter.convert(this.importer.documentProperties.listTable, this.importer.documentProperties.listOverrideTable);
            this.importer.documentProperties.listTableComplete = false;
            this.importer.documentProperties.listOverrideTableComplete = false;
        }
        if (nestedDestination instanceof StyleSheetDestination)
            this.importer.importers.style.applyStyleLinks();
    }
    afterNestedGroupFinished(_nestedDestination) {
    }
    createClone() {
        return new DefaultDestination(this.importer, this.subDocument);
    }
}
