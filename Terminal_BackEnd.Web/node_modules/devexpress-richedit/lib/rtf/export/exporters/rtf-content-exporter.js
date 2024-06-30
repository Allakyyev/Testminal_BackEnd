import { MapCreator } from '../../../base-utils/map-creator';
import { CrossExistingIterator } from '../../../core/formats/utils/cross-existing-iterator';
import { TableIterator } from '../../../core/layout-formatter/box/generator/recursive-objects-iterators';
import { BorderLineStyle } from '../../../core/model/borders/enums';
import { ColorHelper } from '../../../core/model/color/color';
import { DXColor } from '../../../core/model/color/dx-color';
import { Field } from '../../../core/model/fields/field';
import { DocumentProtectionType } from '../../../core/model/json/enums/json-document-enums';
import { ModelIterator } from '../../../core/model/model-iterator';
import { NumberingFormat } from '../../../core/model/numbering-lists/list-level-properties';
import { ControlOptions } from '../../../core/model/options/control';
import { CryptProviderType, HashAlgorithmType } from '../../../core/model/options/document-protection';
import { RangePermission } from '../../../core/model/range-permissions';
import { RunType } from '../../../core/model/runs/run-type';
import { HeaderFooterType, SectionStartType } from '../../../core/model/section/enums';
import { ConditionalTableStyleFormatting } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { VerticalAlignment } from '../../import/model/section/general-section-info';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { CharacterPropertiesExportHelper } from '../../utils/character-properties-export-helper';
import { Characters } from '../characters';
import { PieceTableNumberingListCountersManager } from '../piece-table-numbering-list-counters-manager';
import { RtfBuilder } from '../rtf-builder';
import { DocumentPropertyNames, ExportFinalParagraphMark, RtfNumberingListExportFormat } from '../rtf-document-exporter-options';
import { RtfInlinePictureExportStrategy } from './picture/rtf-inline-picture-export-strategy';
import { RtfAnchoredPictureRunExporter } from './rtf-anchored-picture-run-exporter';
import { RtfAnchoredTextBoxRunExporter } from './rtf-anchored-text-box-run-exporter';
import { RtfCharacterPropertiesExporter } from './rtf-character-properties-exporter';
import { RtfNumberingListExporter } from './rtf-numbering-list-exporter';
import { RtfParagraphPropertiesExporter } from './rtf-paragraph-properties-exporter';
import { RtfSectionPropertiesExporter } from './rtf-section-properties-exporter';
import { RtfStyleExporter } from './rtf-style-exporter';
import { RtfTableExporter } from './table/rtf-table-exporter';
export class RtfContentExporter {
    constructor(documentModel, options, rtfExportHelper) {
        this.shouldFourceUpdateIterators = false;
        this.documentModel = documentModel;
        this.subDocument = this.documentModel.mainSubDocument;
        this.pieceTableNumberingListCounters = new PieceTableNumberingListCountersManager();
        this.rtfExportHelper = rtfExportHelper;
        this.options = options;
        this.rtfBuilder = this.createRtfBuilder();
        this.paragraphPropertiesExporter = new RtfParagraphPropertiesExporter(documentModel, rtfExportHelper, this.rtfBuilder);
        this.characterPropertiesExporter = new RtfCharacterPropertiesExporter(documentModel, rtfExportHelper, this.rtfBuilder, options);
        this.sectionPropertiesExporter = new RtfSectionPropertiesExporter(documentModel, rtfExportHelper, this.rtfBuilder);
        this.runHandlerMap = new MapCreator()
            .add(RunType.TextRun, this.exportTextRun)
            .add(RunType.FieldCodeStartRun, this.fieldCodeStartRunHandler)
            .add(RunType.FieldCodeEndRun, this.fieldCodeEndRunHandler)
            .add(RunType.FieldResultEndRun, this.fieldResultEndRunHandler)
            .add(RunType.InlinePictureRun, this.inlinePictureRunHandler)
            .add(RunType.InlineTextBoxRun, this.inlineTextBoxRunHandler)
            .add(RunType.AnchoredPictureRun, this.anchoredPictureRunHandler)
            .add(RunType.AnchoredTextBoxRun, this.anchoredTextBoxRunHandler)
            .get();
    }
    get shouldExportHiddenText() { return true; }
    ;
    createRtfBuilder() {
        return new RtfBuilder();
    }
    export() {
        this.exportDefaultCharacterProperties();
        this.exportDefaultParagraphProperties();
        this.exportStyleTable();
        if (this.options.listExportFormat == RtfNumberingListExportFormat.RtfFormat)
            this.exportNumberingListTable();
        this.populateUserTable();
        this.rtfBuilder.clear();
        this.exportDocumentInformation();
        this.exportDocumentSettings();
        if (this.options.wrapContentInGroup)
            this.rtfBuilder.openGroup();
        this.exportSubDocument(this.documentModel.mainSubDocument, this.exportDocument);
        if (this.options.wrapContentInGroup)
            this.rtfBuilder.closeGroup();
    }
    shouldSplitRuns() {
        return this.subDocument.bookmarks.length > 0;
    }
    splitRuns() {
        this.subDocument.bookmarks.forEach(bookmark => {
            this.splitRun(bookmark.start);
            this.splitRun(bookmark.end);
        });
    }
    splitRun(position) {
        if (position == this.subDocument.getDocumentEndPosition())
            return;
        const chunkInfo = this.subDocument.getRunAndIndexesByPosition(position);
        if (chunkInfo.charOffset > 0)
            chunkInfo.chunk.splitRun(chunkInfo.runIndex, chunkInfo.charOffset);
    }
    initializeSubDocument(startSectionParagraphIndex) {
        this.permissionsIterator = this.createPermissionsIterator();
        this.bookmarksIterator = this.createBookmarkIterator();
        this.tableIterator = new TableIterator(this.subDocument.tables);
        this.tableIterator.init(0);
        this.shouldFourceUpdateIterators = true;
        this.startSectionParagraphIndex = startSectionParagraphIndex;
    }
    updateIterators(position) {
        if (this.shouldFourceUpdateIterators)
            this.forceUpdateIterators(position);
    }
    forceUpdateIterators(position) {
        this.tableIterator.update(position);
        this.shouldFourceUpdateIterators = false;
    }
    exportSubDocument(subDocument, pieceTableExporter) {
        const originalSubDocument = this.subDocument;
        const originalPieceTableNumberingListCounters = this.pieceTableNumberingListCounters;
        const originalPieceTableStartSectionParagraphIndex = this.startSectionParagraphIndex;
        const originalPermissionsIterator = this.permissionsIterator;
        const originalBookmarksIterator = this.bookmarksIterator;
        this.subDocument = subDocument;
        this.pieceTableNumberingListCounters = new PieceTableNumberingListCountersManager();
        this.initializeSubDocument(0);
        pieceTableExporter.call(this);
        if (originalSubDocument == null)
            this.subDocument = this.documentModel.mainSubDocument;
        else {
            this.subDocument = originalSubDocument;
            this.initializeSubDocument(originalPieceTableStartSectionParagraphIndex);
        }
        this.pieceTableNumberingListCounters = originalPieceTableNumberingListCounters ? originalPieceTableNumberingListCounters : new PieceTableNumberingListCountersManager();
        this.permissionsIterator = originalPermissionsIterator ? originalPermissionsIterator : this.createPermissionsIterator();
        this.bookmarksIterator = originalBookmarksIterator ? originalBookmarksIterator : this.createBookmarkIterator();
    }
    createPermissionsIterator() {
        const permissionsIterator = new CrossExistingIterator(this.subDocument.rangePermissions);
        permissionsIterator.init();
        return permissionsIterator;
    }
    createBookmarkIterator() {
        const bookmarksIterator = new CrossExistingIterator(this.subDocument.bookmarks);
        bookmarksIterator.init();
        return bookmarksIterator;
    }
    exportDefaultCharacterProperties() {
        if (!StringUtils.isNullOrEmpty(this.rtfExportHelper.defaultCharacterProperties))
            return;
        this.rtfBuilder.clear();
        const characterProperties = this.documentModel.defaultCharacterProperties;
        if (characterProperties) {
            const characterPropertiesExporter = new RtfCharacterPropertiesExporter(this.documentModel, this.rtfExportHelper, this.rtfBuilder, this.options);
            const foreColor = characterProperties.textColor.toRgb(this.documentModel.colorProvider);
            if (!DXColor.isTransparentOrEmpty(foreColor) && foreColor != ColorHelper.BLACK_COLOR)
                this.rtfExportHelper.getColorIndex(characterProperties.textColor);
            characterPropertiesExporter.exportCharacterProperties(characterProperties, true, false, false);
            this.rtfExportHelper.defaultCharacterProperties = this.rtfBuilder.rtfContent.getText();
        }
    }
    exportDefaultParagraphProperties() {
        if (!StringUtils.isNullOrEmpty(this.rtfExportHelper.defaultParagraphProperties))
            return;
        this.rtfBuilder.clear();
        const paragraphProperties = this.documentModel.defaultParagraphProperties;
        if (paragraphProperties) {
            const paragraphPropertiesExporter = new RtfParagraphPropertiesExporter(this.documentModel, this.rtfExportHelper, this.rtfBuilder);
            paragraphPropertiesExporter.exportParagraphPropertiesCore(paragraphProperties, true);
            this.rtfExportHelper.defaultParagraphProperties = this.rtfBuilder.rtfContent.getText();
        }
    }
    exportStyleTable() {
        const styleExporter = new RtfStyleExporter(this.documentModel, this.createRtfBuilder(), this.rtfExportHelper, this.options);
        styleExporter.exportStyleSheet(this.documentModel.paragraphStyles, this.documentModel.characterStyles, this.documentModel.tableStyles);
    }
    exportNumberingListTable() {
        const listExporter = new RtfNumberingListExporter(this);
        const numberingLists = this.documentModel.numberingLists;
        let startIndex = 0;
        startIndex = Math.min(startIndex, this.calculateFirstExportedNumberingListsIndexForStyles(this.documentModel.paragraphStyles));
        const count = numberingLists.length - startIndex;
        listExporter.export(numberingLists, startIndex, count);
    }
    calculateFirstExportedNumberingListsIndexForStyles(paragraphStyleCollection) {
        let result = Number.MAX_SAFE_INTEGER;
        ListUtils.forEach(paragraphStyleCollection, (style) => {
            const styleListIndex = style.getNumberingListIndex();
            if (styleListIndex >= 0)
                result = Math.min(result, styleListIndex);
        });
        return result;
    }
    populateUserTable() {
        this.rtfExportHelper.userCollection = [];
        NumberMapUtils.forEach(this.documentModel.subDocuments, (subDoc) => {
            this.populateUserList(subDoc, this.rtfExportHelper.userCollection);
        });
    }
    populateUserList(pieceTable, users) {
        const rangePermissions = pieceTable.rangePermissions;
        const count = rangePermissions.length;
        for (let i = 0; i < count; i++) {
            const userName = rangePermissions[i].userName;
            if (!StringUtils.isNullOrEmpty(userName) && users.indexOf(userName) < 0)
                users.push(userName);
        }
    }
    exportDocumentInformation() {
        if (!this.shouldExportDocumentInformation())
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.DocumentInformation);
        this.exportDocumentProperties();
        this.exportDocumentProtectionPasswordHash();
        this.rtfBuilder.closeGroup();
    }
    exportDocumentProtectionPasswordHash() {
        if (!this.shouldExportDocumentProtectionPasswordHash())
            return;
        if (this.shouldExportDocumentProtectionPasswordHashInWord2007Format())
            this.exportDocumentProtectionPasswordHashWord2007();
        else
            this.exportDocumentProtectionPasswordHashWord2003();
    }
    exportDocumentProtectionPasswordHashWord2007() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.PasswordHash);
        const bytes = this.getDocumentProtectionPasswordHashWord2007Bytes();
        this.rtfBuilder.writeByteArrayAsHex(bytes);
        this.rtfBuilder.closeGroup();
    }
    getDocumentProtectionPasswordHashWord2007Bytes() {
        const properties = this.documentModel.documentProtectionProperties;
        const passwordHash = properties.passwordHash;
        const passwordPrefix = properties.passwordPrefix ? properties.passwordPrefix : [];
        const uint32Array = [];
        uint32Array.push(1);
        uint32Array.push(40 + passwordHash.length + passwordPrefix.length);
        uint32Array.push(properties.cryptProviderType == CryptProviderType.RsaFull ? 1 : 24);
        uint32Array.push(0x8000 + properties.hashAlgorithmType);
        uint32Array.push(properties.hashIterationCount);
        uint32Array.push(passwordHash.length);
        uint32Array.push(passwordPrefix.length);
        uint32Array.push(0);
        uint32Array.push(0);
        uint32Array.push(0);
        const tempResult = new Uint8Array(new Uint32Array(uint32Array).buffer);
        const result = new Uint8Array(tempResult.byteLength + passwordHash.length + passwordPrefix.length);
        result.set(tempResult);
        result.set(passwordHash, tempResult.byteLength);
        result.set(passwordPrefix, tempResult.byteLength + passwordHash.length);
        return result;
    }
    exportDocumentProtectionPasswordHashWord2003() {
        const properties = this.documentModel.documentProtectionProperties;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.Password);
        const hash = properties.word2003PasswordHash;
        let value = "";
        if (hash == null) {
            value = "00000000";
        }
        else {
            const view = new DataView(hash, 0);
            const hashValue = view.getInt32(0);
            value = this.documentModel.simpleFormattersManager.formatString("{0:x8}", hashValue);
        }
        this.rtfBuilder.writeTextDirect(value);
        this.rtfBuilder.closeGroup();
    }
    shouldExportDocumentProtectionPasswordHashInWord2007Format() {
        const properties = this.documentModel.documentProtectionProperties;
        return properties.passwordHash != null && properties.hashAlgorithmType != HashAlgorithmType.None;
    }
    shouldExportDocumentInformation() {
        return this.shouldExportDocumentProtectionPasswordHash() || this.shouldExportDocumentProperties();
    }
    shouldExportDocumentProperties() {
        return this.options.exportedDocumentProperties != DocumentPropertyNames.None
            && this.options.exportedDocumentProperties != DocumentPropertyNames.CustomProperties;
    }
    shouldExportDocumentProtectionPasswordHash() {
        const properties = this.documentModel.documentProtectionProperties;
        if (!properties || !properties.enforceProtection || (properties.passwordHash == null && properties.word2003PasswordHash == null))
            return false;
        else
            return true;
    }
    exportDocumentSettings() {
        this.exportFormattingFlags();
        this.exportCompatibilitySettings();
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.DefaultTabWidth, this.documentModel.defaultTabWidth);
        if (this.documentModel.mirrorMargins)
            this.rtfBuilder.writeCommand(RtfExportSR.MirrorMargins);
        if (this.documentModel.differentOddAndEvenPages)
            this.rtfBuilder.writeCommand(RtfExportSR.PageFacing);
        if (this.documentModel.displayBackgroundShape)
            this.rtfBuilder.writeCommand(RtfExportSR.DisplayBackgroundShape, "1");
        if (!DXColor.isTransparentOrEmpty(this.documentModel.pageBackColor))
            this.exportPageBackground();
        this.exportDocumentProtectionProperties();
    }
    exportFormattingFlags() {
        this.rtfBuilder.writeCommand(RtfExportSR.NoUICompatible);
        this.rtfBuilder.writeCommand(RtfExportSR.ShapeDoNotLay);
        this.rtfBuilder.writeCommand(RtfExportSR.HtmlAutoSpacing);
    }
    exportDocumentProtectionProperties() {
        const properties = this.documentModel.documentProtectionProperties;
        if (!properties || !properties.enforceProtection)
            return;
        if (properties.protectionType == DocumentProtectionType.ReadOnly) {
            this.rtfBuilder.writeCommand(RtfExportSR.AnnotationProtection);
            this.rtfBuilder.writeCommand(RtfExportSR.ReadOnlyProtection);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.EnforceProtection, 1);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ProtectionLevel, 3);
        }
        if (properties.protectionType == DocumentProtectionType.AllowComments) {
            this.rtfBuilder.writeCommand(RtfExportSR.AnnotationProtection);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.EnforceProtection, 1);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ProtectionLevel, 1);
        }
    }
    exportPageBackground() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.PageBackground);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.Shape);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.ShapeInstance);
        this.rtfBuilder.writeShapeColorProperty("fillColor", this.documentModel.pageBackColor);
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.closeGroup();
    }
    exportCompatibilitySettings() {
        const settings = this.documentModel.compatibilitySettings;
        if (!settings.dontJustifyLinesEndingInSoftLineBreak)
            this.rtfBuilder.writeCommand(RtfExportSR.CompatibilityDontJustifyLinesEndingInSoftLineBreak);
        this.rtfBuilder.writeCommand(RtfExportSR.CompatibilitySplitPageBreakAndParagraphMark);
    }
    exportDocumentProperties() {
        this.writeDateTimeDocumentProperty(new Date(), RtfExportSR.Created, DocumentPropertyNames.Created);
        this.writeDateTimeDocumentProperty(new Date(), RtfExportSR.Modified, DocumentPropertyNames.Modified);
    }
    writeStringDocumentProperty(value, command, flag) {
        if (value == null || (this.options.exportedDocumentProperties & flag) == 0)
            return;
        if (this.rtfBuilder.textHasNonASCIISymbol(value)) {
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeCommand(RtfExportSR.UnicodeAndANSIGroup);
            this.writeANSIStringProperty(value, command);
            this.writeUnicodeStringProperty(value, command);
            this.rtfBuilder.closeGroup();
        }
        else
            this.writeStringProperty(value, command);
    }
    writeANSIStringProperty(value, command) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(command);
        this.rtfBuilder.writeAnsiText(value);
        this.rtfBuilder.closeGroup();
    }
    writeUnicodeStringProperty(value, command) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.UnicodeGroup);
        this.writeStringProperty(value, command);
        this.rtfBuilder.closeGroup();
    }
    writeStringProperty(value, command) {
        if (value == null)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(command);
        this.rtfBuilder.writeText(value);
        this.rtfBuilder.closeGroup();
    }
    writeDateTimeDocumentProperty(value, command, flag) {
        if (value == null || (this.options.exportedDocumentProperties & flag) == 0)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(command);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.Year, value.getFullYear());
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.Month, value.getMonth());
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.Day, value.getDay());
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.Hour, value.getHours());
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.Minute, value.getMinutes());
        this.rtfBuilder.closeGroup();
    }
    exportDocument() {
        for (const section of this.documentModel.sections)
            this.exportSectionFiltered(section);
    }
    exportSectionFiltered(section) {
        if (this.shouldExportSection(section))
            this.exportSection(section);
    }
    shouldExportSection(_section) {
        return this.shouldExportHiddenText;
    }
    exportSection(section) {
        this.startNewSection(section);
        this.currentSection = section;
        this.startSectionParagraphIndex = this.subDocument.getParagraphIndexByPosition(this.currentSection.interval.start);
        this.exportSectionHeadersFootersCore(section);
        this.updateIterators(section.interval.start);
        this.exportParagraphs(this.subDocument.getParagraphsByInterval(section.interval));
    }
    startNewSection(section) {
        if (!ControlOptions.isEnabled(this.documentModel.options.sections))
            return;
        this.rtfBuilder.writeCommand(RtfExportSR.ResetSectionProperties);
        this.sectionPropertiesExporter.exportSectionProperties(section);
    }
    exportParagraphs(paragraphs) {
        if (!paragraphs.length)
            return;
        let endPosition;
        for (let i = 0; i < paragraphs.length; i++) {
            const paragraph = paragraphs[i];
            i = this.exportParagraphFiltered(paragraph, i);
            endPosition = paragraph.getEndPosition();
        }
        if (this.bookmarksIterator.update(endPosition))
            this.exportBookmark(this.bookmarksIterator);
        if (this.permissionsIterator.update(endPosition))
            this.exportRangePermission(this.permissionsIterator);
    }
    exportParagraphFiltered(paragraph, paragraphIndex) {
        return this.exportParagraph(paragraph, paragraphIndex);
    }
    exportParagraph(paragraph, paragraphIndex) {
        this.tableIterator.update(paragraph.interval.start);
        const tablesInfo = this.tableIterator.generateInfo(paragraph.interval.start);
        if (tablesInfo == null) {
            this.exportSingleParagraph(paragraph);
            return paragraphIndex;
        }
        else
            return RtfTableExporter.exportTable(this, tablesInfo[0].table.getTopLevelParent()) - this.startSectionParagraphIndex;
    }
    exportSingleParagraph(paragraph) {
        this.exportParagraphCore(paragraph, 0, 0, -1);
        this.finishParagraph(paragraph);
    }
    finishParagraph(paragraph) {
        const endParagraphPosition = paragraph.getEndPosition();
        const islastParagraphInDocument = endParagraphPosition == this.subDocument.getDocumentEndPosition();
        if (islastParagraphInDocument && this.supressExportLastParagraph(paragraph))
            return;
        if (!islastParagraphInDocument && endParagraphPosition == this.currentSection.getEndPosition())
            this.rtfBuilder.writeCommand(RtfExportSR.SectionEndMark);
        else
            this.rtfBuilder.writeCommand(RtfExportSR.EndOfParagraph);
    }
    supressExportLastParagraph(_paragraph) {
        if (!this.subDocument.isMain())
            return false;
        return this.options.exportFinalParagraphMark == ExportFinalParagraphMark.Never;
    }
    exportParagraphCore(paragraph, tableNestingLevel, _condTypes, _tableStyleIndex) {
        this.startNewParagraph(paragraph, tableNestingLevel);
        this.exportParagraphRuns(paragraph);
        this.exportParagraphCharacterProperties(paragraph);
    }
    startNewParagraph(paragraph, tableNestingLevel) {
        if (paragraph.isInList())
            this.writeAlternativeText(paragraph);
        this.rtfBuilder.writeCommand(RtfExportSR.ResetParagraphProperties);
        this.startNewInnerParagraph(paragraph, tableNestingLevel);
    }
    startNewInnerParagraph(paragraph, tableNestingLevel) {
        this.rtfBuilder.writeCommand(RtfExportSR.ResetCharacterFormatting);
        this.paragraphPropertiesExporter.exportParagraphProperties(paragraph, tableNestingLevel);
    }
    writeAlternativeText(paragraph) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.AlternativeText);
        this.rtfBuilder.writeCommand(RtfExportSR.ResetParagraphProperties);
        this.rtfBuilder.writeCommand(RtfExportSR.ResetCharacterFormatting);
        const counters = this.subDocument.documentModel.getRangeListCounters(paragraph);
        this.rtfBuilder.writeText(paragraph.getNumberingListTextCore(counters));
        const separator = RtfNumberingListExporter.getListLevelSeparator(paragraph.getListLevel().getListLevelProperties().separator);
        this.rtfBuilder.writeText(separator.toString());
        this.rtfBuilder.closeGroup();
    }
    exportParagraphCharacterProperties(paragraph) {
        const run = this.subDocument.getRunByPosition(paragraph.getEndPosition() - 1);
        this.characterPropertiesExporter.exportParagraphCharacterProperties(run.getCharacterMergedProperties());
    }
    exportParagraphRuns(paragraph) {
        const modelIterator = new ModelIterator(this.subDocument, false);
        modelIterator.setPosition(paragraph.interval.start);
        do {
            this.exportRun(modelIterator.run, modelIterator.getRunText(), modelIterator.getAbsolutePosition());
        } while (modelIterator.moveToNextRun() && modelIterator.getAbsolutePosition() < paragraph.interval.end);
    }
    exportRun(run, runText, absolutePosition) {
        if (this.bookmarksIterator.update(absolutePosition))
            this.exportBookmark(this.bookmarksIterator);
        if (this.permissionsIterator.update(absolutePosition))
            this.exportRangePermission(this.permissionsIterator);
        const handler = this.runHandlerMap[run.getType()];
        if (handler)
            handler.call(this, run, runText, absolutePosition);
        this.updateIterators(absolutePosition);
    }
    exportTextRun(run, runText, absolutePosition) {
        this.rtfBuilder.openGroup();
        this.characterPropertiesExporter.exportCharacterProperties(run.getCharacterMergedProperties());
        this.characterPropertiesExporter.exportCharacterStyle(run.characterStyle, run.paragraph.paragraphStyle);
        const runLength = run.getLength();
        if (this.bookmarksIterator.hasObjects(absolutePosition, runLength) || this.permissionsIterator.hasObjects(absolutePosition, runLength)) {
            let startIndex = 0;
            let length = 1;
            const exportRunText = () => {
                this.rtfBuilder.writeText(runText.substr(startIndex, length));
                startIndex += length;
                length = 0;
            };
            while (startIndex + length < runText.length) {
                const position = absolutePosition + startIndex + length;
                if (this.bookmarksIterator.update(position)) {
                    exportRunText();
                    this.exportBookmark(this.bookmarksIterator);
                }
                if (this.permissionsIterator.update(position)) {
                    exportRunText();
                    this.exportRangePermission(this.permissionsIterator);
                }
                length++;
            }
            if (length > 0)
                this.rtfBuilder.writeText(runText.substr(startIndex, length));
        }
        else
            this.rtfBuilder.writeText(runText);
        this.rtfBuilder.closeGroup();
    }
    exportBookmark(bookmarksIterator) {
        for (const state of bookmarksIterator.addedObjects) {
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeCommand(RtfExportSR.BookmarkStart);
            this.rtfBuilder.writeText(state.object.name);
            this.rtfBuilder.closeGroup();
        }
        for (const state of bookmarksIterator.deletedObjects) {
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeCommand(RtfExportSR.BookmarkEnd);
            this.rtfBuilder.writeText(state.object.name);
            this.rtfBuilder.closeGroup();
        }
    }
    exportRangePermission(permissionsIterator) {
        for (const state of permissionsIterator.addedObjects) {
            const data = this.generateRangePermissionData(state.object);
            if (StringUtils.isNullOrEmpty(data))
                return;
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeCommand(RtfExportSR.RangePermissionStart);
            this.rtfBuilder.writeTextDirect(data);
            this.rtfBuilder.closeGroup();
        }
        for (const state of permissionsIterator.deletedObjects) {
            const data = this.generateRangePermissionData(state.object);
            if (StringUtils.isNullOrEmpty(data))
                return;
            this.rtfBuilder.openGroup();
            this.rtfBuilder.writeCommand(RtfExportSR.RangePermissionEnd);
            this.rtfBuilder.writeTextDirect(data);
            this.rtfBuilder.closeGroup();
        }
    }
    generateRangePermissionData(rangePermission) {
        const helper = this.rtfExportHelper;
        if (!helper)
            return '';
        const userIndex = helper.getUserIndex(rangePermission);
        if (userIndex == 0)
            return '';
        const rangeIndex = this.subDocument.rangePermissions.indexOf(rangePermission);
        if (rangeIndex < 0)
            return '';
        return this.intToShortString(userIndex) + "0100" + this.intToShortString(rangeIndex) + "0000";
    }
    intToShortString(value) {
        value &= 0x0000FFFF;
        const low = value & 0x000000FF;
        const high = value >> 8;
        return StringUtils.padLeft(low.toString(16), 2, '0') + StringUtils.padLeft(high.toString(16), 2, '0');
    }
    fieldCodeStartRunHandler(_run, _runText, absolutePosition) {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.Field);
        const field = this.subDocument.fields[Field.binaryIndexOf(this.subDocument.fields, absolutePosition + 1)];
        if (field.locked)
            this.rtfBuilder.writeCommand(RtfExportSR.FieldLocked);
        this.rtfBuilder.writeCommand(RtfExportSR.FieldCodeView);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.FieldInstructions);
    }
    fieldCodeEndRunHandler(_run, _runText, _absolutePosition) {
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.FieldResult);
    }
    fieldResultEndRunHandler(_run, _runText, _absolutePosition) {
        this.rtfBuilder.closeGroup();
        this.rtfBuilder.closeGroup();
    }
    inlinePictureRunHandler(run, _runText, _absolutePosition) {
        const characterProperties = run.getCharacterMergedProperties();
        const shouldExportCharacterProperties = CharacterPropertiesExportHelper.ShouldExportInlinePictureRunCharacterProperties(characterProperties, this.documentModel.colorProvider);
        if (shouldExportCharacterProperties) {
            this.rtfBuilder.openGroup();
            this.characterPropertiesExporter.exportCharacterProperties(characterProperties);
        }
        const exportStrategy = new RtfInlinePictureExportStrategy();
        const inlinePictureRun = run;
        exportStrategy.export(this.rtfBuilder, inlinePictureRun.info, this.documentModel.cache.imageCache, inlinePictureRun.info.containerProperties);
        if (shouldExportCharacterProperties)
            this.rtfBuilder.closeGroup();
    }
    inlineTextBoxRunHandler(_run, _runText, _absolutePosition) {
        throw new Error(Errors.NotImplemented);
    }
    anchoredPictureRunHandler(run, _runText, _absolutePosition) {
        new RtfAnchoredPictureRunExporter(this.rtfBuilder, run, this.documentModel.cache.imageCache).export();
    }
    anchoredTextBoxRunHandler(run, _runText, _absolutePosition) {
        const textBoxRun = run;
        new RtfAnchoredTextBoxRunExporter(this.rtfBuilder, textBoxRun, () => {
            this.exportSubDocument(this.documentModel.subDocuments[textBoxRun.subDocId], this.exportPieceTable);
        }).export();
    }
    exportSectionHeadersFootersCore(section) {
        if (!ControlOptions.isEnabled(this.documentModel.options.headersFooters))
            return;
        const innerFirstPageHeader = section.headers.getObject(HeaderFooterType.First);
        if (innerFirstPageHeader)
            this.exportFirstPageHeader(innerFirstPageHeader, section.headers.isLinkedToPrevious(HeaderFooterType.First));
        const innerOddPageHeader = section.headers.getObject(HeaderFooterType.Odd);
        if (innerOddPageHeader)
            this.exportOddPageHeader(innerOddPageHeader, section.headers.isLinkedToPrevious(HeaderFooterType.Odd));
        const innerEvenPageHeader = section.headers.getObject(HeaderFooterType.Even);
        if (innerEvenPageHeader)
            this.exportEvenPageHeader(innerEvenPageHeader, section.headers.isLinkedToPrevious(HeaderFooterType.Even));
        const innerFirstPageFooter = section.footers.getObject(HeaderFooterType.First);
        if (innerFirstPageFooter)
            this.exportFirstPageFooter(innerFirstPageFooter, section.footers.isLinkedToPrevious(HeaderFooterType.First));
        const innerOddPageFooter = section.footers.getObject(HeaderFooterType.Odd);
        if (innerOddPageFooter)
            this.exportOddPageFooter(innerOddPageFooter, section.footers.isLinkedToPrevious(HeaderFooterType.Odd));
        const innerEvenPageFooter = section.footers.getObject(HeaderFooterType.Even);
        if (innerEvenPageFooter)
            this.exportEvenPageFooter(innerEvenPageFooter, section.footers.isLinkedToPrevious(HeaderFooterType.Even));
    }
    exportFirstPageHeader(sectionHeader, linkedToPrevious) {
        if (linkedToPrevious)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.SectionFirstPageHeader);
        this.exportFirstPageHeaderCore(sectionHeader, linkedToPrevious);
        this.rtfBuilder.closeGroup();
    }
    exportOddPageHeader(sectionHeader, linkedToPrevious) {
        if (linkedToPrevious)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.SectionOddPageHeader);
        this.exportOddPageHeaderCore(sectionHeader, linkedToPrevious);
        this.rtfBuilder.closeGroup();
    }
    exportEvenPageHeader(sectionHeader, linkedToPrevious) {
        if (linkedToPrevious)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.SectionEvenPageHeader);
        this.exportEvenPageHeaderCore(sectionHeader, linkedToPrevious);
        this.rtfBuilder.closeGroup();
    }
    exportFirstPageFooter(sectionFooter, linkedToPrevious) {
        if (linkedToPrevious)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.SectionFirstPageFooter);
        this.exportFirstPageFooterCore(sectionFooter, linkedToPrevious);
        this.rtfBuilder.closeGroup();
    }
    exportOddPageFooter(sectionFooter, linkedToPrevious) {
        if (linkedToPrevious)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.SectionOddPageFooter);
        this.exportOddPageFooterCore(sectionFooter, linkedToPrevious);
        this.rtfBuilder.closeGroup();
    }
    exportEvenPageFooter(sectionFooter, linkedToPrevious) {
        if (linkedToPrevious)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.SectionEvenPageFooter);
        this.exportEvenPageFooterCore(sectionFooter, linkedToPrevious);
        this.rtfBuilder.closeGroup();
    }
    exportFirstPageHeaderCore(sectionHeader, _linkedToPrevious) {
        const subDocument = this.documentModel.subDocuments[sectionHeader.subDocumentId];
        this.exportSubDocument(subDocument, this.exportPieceTable);
    }
    exportOddPageHeaderCore(sectionHeader, _linkedToPrevious) {
        const subDocument = this.documentModel.subDocuments[sectionHeader.subDocumentId];
        this.exportSubDocument(subDocument, this.exportPieceTable);
    }
    exportEvenPageHeaderCore(sectionHeader, _linkedToPrevious) {
        const subDocument = this.documentModel.subDocuments[sectionHeader.subDocumentId];
        this.exportSubDocument(subDocument, this.exportPieceTable);
    }
    exportFirstPageFooterCore(sectionFooter, _linkedToPrevious) {
        const subDocument = this.documentModel.subDocuments[sectionFooter.subDocumentId];
        this.exportSubDocument(subDocument, this.exportPieceTable);
    }
    exportOddPageFooterCore(sectionFooter, _linkedToPrevious) {
        const subDocument = this.documentModel.subDocuments[sectionFooter.subDocumentId];
        this.exportSubDocument(subDocument, this.exportPieceTable);
    }
    exportEvenPageFooterCore(sectionFooter, _linkedToPrevious) {
        const subDocument = this.documentModel.subDocuments[sectionFooter.subDocumentId];
        this.exportSubDocument(subDocument, this.exportPieceTable);
    }
    exportPieceTable() {
        this.exportParagraphs(this.subDocument.paragraphs);
    }
}
RtfContentExporter.verticalAlignmentTypes = createVerticalAlignmentTypesTable();
RtfContentExporter.sectionStartTypes = createSectionStartTypesTable();
RtfContentExporter.chapterSeparatorTypes = createChapterSeparatorTypesTable();
RtfContentExporter.pageNumberingTypes = createPageNumberingTypesTable();
RtfContentExporter.sectionFootNoteNumberingTypes = createSectionFootNoteNumberingTypesTable();
RtfContentExporter.sectionEndNoteNumberingTypes = createSectionEndNoteNumberingTypesTable();
RtfContentExporter.footNoteNumberingTypes = createFootNoteNumberingTypesTable();
RtfContentExporter.endNoteNumberingTypes = createEndNoteNumberingTypesTable();
RtfContentExporter.borderLineStyles = createBorderLineStylesTable();
RtfContentExporter.conditionalStylesTypes = createConditionalStylesTable();
RtfContentExporter.predefinedUserGroups = createPredefinedUserGroups();
function createVerticalAlignmentTypesTable() {
    return new MapCreator()
        .add(VerticalAlignment.Both, RtfExportSR.VerticalAlignmentJustify)
        .add(VerticalAlignment.Bottom, RtfExportSR.VerticalAlignmentBottom)
        .add(VerticalAlignment.Center, RtfExportSR.VerticalAlignmentCenter)
        .add(VerticalAlignment.Top, RtfExportSR.VerticalAlignmentTop)
        .get();
}
function createSectionStartTypesTable() {
    return new MapCreator()
        .add(SectionStartType.Continuous, RtfExportSR.SectionBreakTypeContinuous)
        .add(SectionStartType.NextPage, RtfExportSR.SectionBreakTypeNextPage)
        .add(SectionStartType.OddPage, RtfExportSR.SectionBreakTypeOddPage)
        .add(SectionStartType.EvenPage, RtfExportSR.SectionBreakTypeEvenPage)
        .add(SectionStartType.Column, RtfExportSR.SectionBreakTypeColumn)
        .get();
}
function createChapterSeparatorTypesTable() {
    return new MapCreator()
        .add(Characters.Hyphen, RtfExportSR.SectionChapterSeparatorHyphen)
        .add('.', RtfExportSR.SectionChapterSeparatorPeriod)
        .add(':', RtfExportSR.SectionChapterSeparatorColon)
        .add(Characters.EmDash, RtfExportSR.SectionChapterSeparatorEmDash)
        .add(Characters.EnDash, RtfExportSR.SectionChapterSeparatorEnDash)
        .get();
}
function createPageNumberingTypesTable() {
    return new MapCreator()
        .add(NumberingFormat.Decimal, RtfExportSR.SectionPageNumberingDecimal)
        .add(NumberingFormat.UpperRoman, RtfExportSR.SectionPageNumberingUpperRoman)
        .add(NumberingFormat.LowerRoman, RtfExportSR.SectionPageNumberingLowerRoman)
        .add(NumberingFormat.UpperLetter, RtfExportSR.SectionPageNumberingUpperLetter)
        .add(NumberingFormat.LowerLetter, RtfExportSR.SectionPageNumberingLowerLetter)
        .add(NumberingFormat.ArabicAbjad, RtfExportSR.SectionPageNumberingArabicAbjad)
        .add(NumberingFormat.ArabicAlpha, RtfExportSR.SectionPageNumberingArabicAlpha)
        .add(NumberingFormat.Chosung, RtfExportSR.SectionPageNumberingChosung)
        .add(NumberingFormat.DecimalEnclosedCircle, RtfExportSR.SectionPageNumberingDecimalEnclosedCircle)
        .add(NumberingFormat.DecimalFullWidth, RtfExportSR.SectionPageNumberingDecimalFullWidth)
        .add(NumberingFormat.Ganada, RtfExportSR.SectionPageNumberingGanada)
        .add(NumberingFormat.HindiVowels, RtfExportSR.SectionPageNumberingHindiVowels)
        .add(NumberingFormat.HindiConsonants, RtfExportSR.SectionPageNumberingHindiConsonants)
        .add(NumberingFormat.HindiNumbers, RtfExportSR.SectionPageNumberingHindiNumbers)
        .add(NumberingFormat.HindiDescriptive, RtfExportSR.SectionPageNumberingHindiDescriptive)
        .add(NumberingFormat.ThaiLetters, RtfExportSR.SectionPageNumberingThaiLetters)
        .add(NumberingFormat.ThaiNumbers, RtfExportSR.SectionPageNumberingThaiNumbers)
        .add(NumberingFormat.ThaiDescriptive, RtfExportSR.SectionPageNumberingThaiDescriptive)
        .add(NumberingFormat.VietnameseDescriptive, RtfExportSR.SectionPageNumberingVietnameseDescriptive)
        .get();
}
function createSectionFootNoteNumberingTypesTable() {
    return new MapCreator()
        .add(NumberingFormat.Decimal, RtfExportSR.SectionFootNoteNumberingFormatDecimal)
        .add(NumberingFormat.UpperRoman, RtfExportSR.SectionFootNoteNumberingFormatUpperRoman)
        .add(NumberingFormat.LowerRoman, RtfExportSR.SectionFootNoteNumberingFormatLowerRoman)
        .add(NumberingFormat.UpperLetter, RtfExportSR.SectionFootNoteNumberingFormatUpperLetter)
        .add(NumberingFormat.LowerLetter, RtfExportSR.SectionFootNoteNumberingFormatLowerLetter)
        .add(NumberingFormat.Chicago, RtfExportSR.SectionFootNoteNumberingFormatChicago)
        .add(NumberingFormat.Chosung, RtfExportSR.SectionFootNoteNumberingFormatChosung)
        .add(NumberingFormat.DecimalEnclosedCircle, RtfExportSR.SectionFootNoteNumberingFormatDecimalEnclosedCircle)
        .add(NumberingFormat.DecimalFullWidth, RtfExportSR.SectionFootNoteNumberingFormatDecimalFullWidth)
        .add(NumberingFormat.Ganada, RtfExportSR.SectionFootNoteNumberingFormatGanada)
        .get();
}
function createSectionEndNoteNumberingTypesTable() {
    return new MapCreator()
        .add(NumberingFormat.Decimal, RtfExportSR.SectionEndNoteNumberingFormatDecimal)
        .add(NumberingFormat.UpperRoman, RtfExportSR.SectionEndNoteNumberingFormatUpperRoman)
        .add(NumberingFormat.LowerRoman, RtfExportSR.SectionEndNoteNumberingFormatLowerRoman)
        .add(NumberingFormat.UpperLetter, RtfExportSR.SectionEndNoteNumberingFormatUpperLetter)
        .add(NumberingFormat.LowerLetter, RtfExportSR.SectionEndNoteNumberingFormatLowerLetter)
        .add(NumberingFormat.Chicago, RtfExportSR.SectionEndNoteNumberingFormatChicago)
        .add(NumberingFormat.Chosung, RtfExportSR.SectionEndNoteNumberingFormatChosung)
        .add(NumberingFormat.DecimalEnclosedCircle, RtfExportSR.SectionEndNoteNumberingFormatDecimalEnclosedCircle)
        .add(NumberingFormat.DecimalFullWidth, RtfExportSR.SectionEndNoteNumberingFormatDecimalFullWidth)
        .add(NumberingFormat.Ganada, RtfExportSR.SectionEndNoteNumberingFormatGanada)
        .get();
}
function createFootNoteNumberingTypesTable() {
    return new MapCreator()
        .add(NumberingFormat.Decimal, RtfExportSR.FootNoteNumberingFormatDecimal)
        .add(NumberingFormat.UpperRoman, RtfExportSR.FootNoteNumberingFormatUpperRoman)
        .add(NumberingFormat.LowerRoman, RtfExportSR.FootNoteNumberingFormatLowerRoman)
        .add(NumberingFormat.UpperLetter, RtfExportSR.FootNoteNumberingFormatUpperLetter)
        .add(NumberingFormat.LowerLetter, RtfExportSR.FootNoteNumberingFormatLowerLetter)
        .add(NumberingFormat.Chicago, RtfExportSR.FootNoteNumberingFormatChicago)
        .add(NumberingFormat.Chosung, RtfExportSR.FootNoteNumberingFormatChosung)
        .add(NumberingFormat.DecimalEnclosedCircle, RtfExportSR.FootNoteNumberingFormatDecimalEnclosedCircle)
        .add(NumberingFormat.DecimalFullWidth, RtfExportSR.FootNoteNumberingFormatDecimalFullWidth)
        .add(NumberingFormat.Ganada, RtfExportSR.FootNoteNumberingFormatGanada)
        .get();
}
function createEndNoteNumberingTypesTable() {
    return new MapCreator()
        .add(NumberingFormat.Decimal, RtfExportSR.EndNoteNumberingFormatDecimal)
        .add(NumberingFormat.UpperRoman, RtfExportSR.EndNoteNumberingFormatUpperRoman)
        .add(NumberingFormat.LowerRoman, RtfExportSR.EndNoteNumberingFormatLowerRoman)
        .add(NumberingFormat.UpperLetter, RtfExportSR.EndNoteNumberingFormatUpperLetter)
        .add(NumberingFormat.LowerLetter, RtfExportSR.EndNoteNumberingFormatLowerLetter)
        .add(NumberingFormat.Chicago, RtfExportSR.EndNoteNumberingFormatChicago)
        .add(NumberingFormat.Chosung, RtfExportSR.EndNoteNumberingFormatChosung)
        .add(NumberingFormat.DecimalEnclosedCircle, RtfExportSR.EndNoteNumberingFormatDecimalEnclosedCircle)
        .add(NumberingFormat.DecimalFullWidth, RtfExportSR.EndNoteNumberingFormatDecimalFullWidth)
        .add(NumberingFormat.Ganada, RtfExportSR.EndNoteNumberingFormatGanada)
        .get();
}
function createPredefinedUserGroups() {
    return new MapCreator()
        .add(0xFFFA, RangePermission.Current_GROUP_NAME)
        .add(0xFFFB, RangePermission.Editors_GROUP_NAME)
        .add(0xFFFC, RangePermission.Owners_GROUP_NAME)
        .add(0xFFFD, RangePermission.Contributors_GROUP_NAME)
        .add(0xFFFE, RangePermission.Administrators_GROUP_NAME)
        .add(0xFFFF, RangePermission.Everyone_GROUP_NAME)
        .get();
}
function createBorderLineStylesTable() {
    return new MapCreator()
        .add(BorderLineStyle.DashDotStroked, RtfExportSR.BorderDashDotStroked)
        .add(BorderLineStyle.Dashed, RtfExportSR.BorderDashed)
        .add(BorderLineStyle.DashSmallGap, RtfExportSR.BorderDashedSmall)
        .add(BorderLineStyle.DotDash, RtfExportSR.BorderDotDashed)
        .add(BorderLineStyle.DotDotDash, RtfExportSR.BorderDotDotDashed)
        .add(BorderLineStyle.Dotted, RtfExportSR.BorderDotted)
        .add(BorderLineStyle.Double, RtfExportSR.BorderDouble)
        .add(BorderLineStyle.DoubleWave, RtfExportSR.BorderDoubleWavy)
        .add(BorderLineStyle.Inset, RtfExportSR.BorderInset)
        .add(BorderLineStyle.None, RtfExportSR.BorderNone)
        .add(BorderLineStyle.Nil, RtfExportSR.NoBorder)
        .add(BorderLineStyle.Outset, RtfExportSR.BorderOutset)
        .add(BorderLineStyle.Single, RtfExportSR.BorderSingle)
        .add(BorderLineStyle.ThickThinLargeGap, RtfExportSR.BorderThickThinLarge)
        .add(BorderLineStyle.ThickThinMediumGap, RtfExportSR.BorderThickThinMedium)
        .add(BorderLineStyle.ThickThinSmallGap, RtfExportSR.BorderThickThinSmall)
        .add(BorderLineStyle.ThinThickLargeGap, RtfExportSR.BorderThinThickLarge)
        .add(BorderLineStyle.ThinThickMediumGap, RtfExportSR.BorderThinThickMedium)
        .add(BorderLineStyle.ThinThickSmallGap, RtfExportSR.BorderThinThickSmall)
        .add(BorderLineStyle.ThinThickThinLargeGap, RtfExportSR.BorderThinThickThinLarge)
        .add(BorderLineStyle.ThinThickThinMediumGap, RtfExportSR.BorderThinThickThinMedium)
        .add(BorderLineStyle.ThinThickThinSmallGap, RtfExportSR.BorderThinThickThinSmall)
        .add(BorderLineStyle.ThreeDEmboss, RtfExportSR.BorderThreeDEmboss)
        .add(BorderLineStyle.ThreeDEngrave, RtfExportSR.BorderThreeDEngrave)
        .add(BorderLineStyle.Triple, RtfExportSR.BorderTriple)
        .add(BorderLineStyle.Wave, RtfExportSR.BorderWavy)
        .get();
}
function createConditionalStylesTable() {
    return new MapCreator()
        .add(ConditionalTableStyleFormatting.BottomLeftCell, RtfExportSR.TableConditionalStyleBottomLeftCell)
        .add(ConditionalTableStyleFormatting.BottomRightCell, RtfExportSR.TableConditionalStyleBottomRightCell)
        .add(ConditionalTableStyleFormatting.EvenColumnBanding, RtfExportSR.TableConditionalStyleEvenColumnBanding)
        .add(ConditionalTableStyleFormatting.EvenRowBanding, RtfExportSR.TableConditionalStyleEvenRowBanding)
        .add(ConditionalTableStyleFormatting.FirstColumn, RtfExportSR.TableConditionalStyleFirstColumn)
        .add(ConditionalTableStyleFormatting.FirstRow, RtfExportSR.TableConditionalStyleFirstRow)
        .add(ConditionalTableStyleFormatting.LastColumn, RtfExportSR.TableConditionalStyleLastColumn)
        .add(ConditionalTableStyleFormatting.LastRow, RtfExportSR.TableConditionalStyleLastRow)
        .add(ConditionalTableStyleFormatting.OddColumnBanding, RtfExportSR.TableConditionalStyleOddColumnBanding)
        .add(ConditionalTableStyleFormatting.OddRowBanding, RtfExportSR.TableConditionalStyleOddRowBanding)
        .add(ConditionalTableStyleFormatting.TopLeftCell, RtfExportSR.TableConditionalStyleTopLeftCell)
        .add(ConditionalTableStyleFormatting.TopRightCell, RtfExportSR.TableConditionalStyleTopRightCell)
        .get();
}
