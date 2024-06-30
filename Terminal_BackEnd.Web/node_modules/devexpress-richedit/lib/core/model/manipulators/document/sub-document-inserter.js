import { Initializer } from '@devexpress/utils/lib/class/initializer';
import { Errors } from '@devexpress/utils/lib/errors';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isDefined } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { MaskedCharacterPropertiesBundle, MaskedParagraphPropertiesBundleFull, ParagraphListInfo } from '../../../rich-utils/properties-bundle';
import { HyperlinkInfoChangedSubDocumentChange } from '../../changes/sub-document/field/hyperlink-info-changed';
import { FieldInsertedSubDocumentChange } from '../../changes/sub-document/field/inserted';
import { Field } from '../../fields/field';
import { FontHiddenHistoryItem } from '../../history/items/character-properties-history-items';
import { AbstractNumberingList, NumberingList } from '../../numbering-lists/numbering-list';
import { RunType } from '../../runs/run-type';
import { SubDocumentInterval, SubDocumentPosition } from '../../sub-document';
import { Table } from '../../tables/main-structures/table';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
import { BaseTextBoxInfo } from '../text-box-manipulator';
import { InsertTextManipulatorParams } from '../text-manipulator/insert-text-manipulator-params';
export class SubDocumentInserterOptions extends Initializer {
    constructor() {
        super(...arguments);
        this.insertParagraphMarkBeforeIfStartsWithTable = true;
        this.enableCharacterStyleCreation = true;
        this.enableParagraphStyleCreation = true;
        this.enableTableStyleCreation = true;
        this.overlapTableCellContent = false;
        this.numberingListCache = {};
        this.abstractNumberingListCache = {};
    }
}
export class SubDocumentInserter {
    constructor(targetModelManipulator, options, targetSubDocPos, sourceSubDocInterval) {
        this.numberingListCache = {};
        this.abstractNumberingListIndexesMap = {};
        this.unloadedCacheImageInfo = [];
        this.abstractNumberingListIndexesMap = options.abstractNumberingListCache;
        this.numberingListCache = options.numberingListCache;
        if (!targetModelManipulator.modelManager.clientMode) {
            options.enableCharacterStyleCreation = false;
            options.enableParagraphStyleCreation = false;
            options.enableTableStyleCreation = false;
        }
        this.targetModelManipulator = targetModelManipulator;
        this.options = options;
        this.targetSubDocPos = targetSubDocPos;
        this.sourceSubDocInterval = sourceSubDocInterval;
        this.newTables = [];
        this.runHandlers = {
            [RunType.TextRun]: this.textRunHandler.bind(this),
            [RunType.ParagraphRun]: this.paragraphRunHandler.bind(this),
            [RunType.SectionRun]: this.sectionRunHandler.bind(this),
            [RunType.FieldCodeStartRun]: this.fieldCodeRunHandler.bind(this),
            [RunType.FieldCodeEndRun]: this.textRunHandler.bind(this),
            [RunType.FieldResultEndRun]: this.textRunHandler.bind(this),
            [RunType.LayoutDependentRun]: this.textRunHandler.bind(this),
            [RunType.InlinePictureRun]: this.inlinePictureRunHandler.bind(this),
            [RunType.InlineTextBoxRun]: this.notSupportedRunHandler.bind(this),
            [RunType.AnchoredPictureRun]: this.anchoredPictureRunHandler.bind(this),
            [RunType.AnchoredTextBoxRun]: this.anchoredTextBoxRunHandler.bind(this),
            [RunType.Undefined]: this.notSupportedRunHandler.bind(this),
            [RunType.FootNoteRun]: this.notSupportedRunHandler.bind(this),
            [RunType.EndNoteRun]: this.notSupportedRunHandler.bind(this),
            [RunType.NoteSeparatorRun]: this.notSupportedRunHandler.bind(this),
            [RunType.NoteContinuationSeparatorRun]: this.notSupportedRunHandler.bind(this),
        };
    }
    get history() { return this.targetModelManipulator.modelManager.history; }
    get modelsConstOffset() { return this.targetStartPosition - this.sourceInterval.start; }
    get sameModel() { return this.sourceDocumentModel === this.targetDocumentModel; }
    get currInsertSubDocumentPosition() {
        return new SubDocumentPosition(this.targetSubDocument, this.currentTargetPosition);
    }
    insert() {
        this.sourceSubDocument = this.sourceSubDocInterval.subDocument;
        this.sourceInterval = this.sourceSubDocInterval.interval;
        this.targetSubDocument = this.targetSubDocPos.subDocument;
        this.targetStartPosition = this.targetSubDocPos.position;
        this.sourceDocumentModel = this.sourceSubDocInterval.subDocument.documentModel;
        this.targetDocumentModel = this.targetSubDocPos.subDocument.documentModel;
        this.currentTargetPosition = this.targetSubDocPos.position;
        this.constRunIterator = this.sourceSubDocInterval.subDocument.getConstRunIterator(this.sourceSubDocInterval.interval);
        this.fromFieldIndexesWhatNeedCopyInfo = [];
        this.insertedSubDocuments = [];
        this.history.addTransaction(() => {
            this.prependTableByParagraph();
            while (this.constRunIterator.moveNext()) {
                const currentRun = this.constRunIterator.currentRun;
                const handler = this.runHandlers[currentRun.getType()];
                if (!handler)
                    throw new Error(Errors.internalExceptionTemplate(`SubDocumentInserter. Inknown run type "${currentRun.getType()}."`));
                handler(currentRun);
                this.currentTargetPosition += currentRun.getLength();
            }
            this.collectTables();
            this.collectFields();
            this.collectBookmarks();
            if (this.options.overlapTableCellContent) {
                const lastInsertedParagraph = this.targetSubDocument.getParagraphByPosition(this.currInsertSubDocumentPosition.position - 1);
                const nextParagraph = this.targetSubDocument.getParagraphByPosition(this.currInsertSubDocumentPosition.position);
                nextParagraph.copyFrom(lastInsertedParagraph);
                const lastInsertedParagraphMarkInterval = new SubDocumentInterval(this.targetSubDocument, new FixedInterval(this.currInsertSubDocumentPosition.position - 1, 1));
                this.targetModelManipulator.range.removeInterval(lastInsertedParagraphMarkInterval, false, false, false);
            }
            ListUtils.unique(this.unloadedCacheImageInfo, (a, b) => a.currId - b.currId).forEach(info => this.targetModelManipulator.picture.loader.load(info));
        });
        this.insertedInterval = FixedInterval.fromPositions(this.targetSubDocPos.position, this.currentTargetPosition);
    }
    fieldCodeRunHandler(currentRun) {
        const fromGlobPos = this.constRunIterator.currentChunk.startLogPosition.value + currentRun.startOffset;
        this.fromFieldIndexesWhatNeedCopyInfo.push(Field.normedBinaryIndexOf(this.sourceSubDocument.fields, fromGlobPos + 1));
        this.textRunHandler(currentRun);
    }
    textRunHandler(currentRun) {
        this.targetModelManipulator.text.insertTextInner(new InsertTextManipulatorParams(this.currInsertSubDocumentPosition, this.getCharPropsBundle(currentRun), currentRun.getType() == RunType.LayoutDependentRun && this.targetSubDocument.isMain() ? RunType.TextRun : currentRun.getType(), this.constRunIterator.currentChunk.getRunText(currentRun)));
    }
    inlinePictureRunHandler(currentRun) {
        var _a;
        const loadOptions = (_a = this.options.pictureSizeUpdater) === null || _a === void 0 ? void 0 : _a.getImageLoadingOptions(currentRun);
        this.targetModelManipulator.picture.insertInlinePictureInner(this.currInsertSubDocumentPosition, this.getCharPropsBundle(currentRun), this.getInlinePictureInfo(currentRun.info), loadOptions);
    }
    anchoredPictureRunHandler(currentRun) {
        this.targetModelManipulator.picture.insertAnchoredPictureInner(this.currInsertSubDocumentPosition, this.getCharPropsBundle(currentRun), this.getAnchorPictureInfo(currentRun.info));
    }
    anchoredTextBoxRunHandler(currentRun) {
        const currentAnchoredTextBoxRun = currentRun;
        if (this.targetSubDocument.isTextBox()) {
            this.targetModelManipulator.text.insertTextInner(new InsertTextManipulatorParams(this.currInsertSubDocumentPosition, this.getCharPropsBundle(currentRun), RunType.TextRun, " "));
        }
        else {
            let newAnchoredTextBox = this.targetModelManipulator.textBox.insertAnchoredTextBox(this.currInsertSubDocumentPosition, this.getCharPropsBundle(currentRun), new BaseTextBoxInfo(null, currentAnchoredTextBoxRun.size.clone(), currentAnchoredTextBoxRun.shape.clone(), currentAnchoredTextBoxRun.anchorInfo.clone(), currentAnchoredTextBoxRun.textBoxProperties.clone(), currentAnchoredTextBoxRun.containerProperties.clone()));
            const sourceSubDoc = this.sourceDocumentModel.subDocuments[currentAnchoredTextBoxRun.subDocId];
            const targetSubDoc = this.targetModelManipulator.model.subDocuments[newAnchoredTextBox.subDocId];
            this.insertedSubDocuments.push(targetSubDoc);
            new SubDocumentInserter(this.targetModelManipulator, this.options, new SubDocumentPosition(targetSubDoc, 0), new SubDocumentInterval(sourceSubDoc, new FixedInterval(0, sourceSubDoc.getDocumentEndPosition())))
                .insert();
            this.targetModelManipulator.range.removeIntervalInner(targetSubDoc, new FixedInterval(targetSubDoc.getDocumentEndPosition() - 2, 1), false);
        }
    }
    paragraphRunHandler(currentRun) {
        this.targetModelManipulator.paragraph.insertParagraphInner(new InsertParagraphManipulatorParams(this.currInsertSubDocumentPosition, this.getCharPropsBundle(currentRun), this.getMaskedParagraphPropertiesBundleFull(currentRun.paragraph), true, () => { }));
    }
    sectionRunHandler(currentRun) {
        this.targetModelManipulator.section.insertSection(this.currInsertSubDocumentPosition, this.getCharPropsBundle(currentRun), this.constRunIterator.currentSection.sectionProperties.clone(), true, this.getMaskedParagraphPropertiesBundleFull(currentRun.paragraph), true);
    }
    notSupportedRunHandler(_currentRun) {
    }
    collectTables() {
        let sourceInterval = this.sourceSubDocInterval.interval;
        sourceInterval = new FixedInterval(sourceInterval.start, sourceInterval.length - (this.options.overlapTableCellContent ? 1 : 0));
        const sourceTables = this.sourceSubDocument.tables;
        const startTblInd = Math.max(0, SearchUtils.normedInterpolationIndexOf(sourceTables, (t) => t.getStartPosition(), sourceInterval.start));
        const modelsConstOffset = this.modelsConstOffset;
        for (let tblInd = startTblInd, sourceTbl; sourceTbl = sourceTables[tblInd]; tblInd++) {
            const sourceTableInterval = sourceTbl.interval;
            if (sourceTableInterval.start >= sourceInterval.end)
                break;
            const intersection = IntervalAlgorithms.getIntersectionNonNullLength(sourceTbl.interval, sourceInterval);
            if (!intersection || intersection.length != sourceTbl.interval.length)
                continue;
            const patternTable = this.getPatternTable(sourceTbl);
            const targetTable = this.targetModelManipulator.table.pasteTable(this.targetSubDocument, patternTable, modelsConstOffset + sourceTbl.getStartPosition());
            patternTable.destructor(this.sourceSubDocInterval.subDocument.positionManager);
            this.newTables.push(targetTable);
        }
    }
    getPatternTable(sourceTable) {
        const targetTable = sourceTable.clone(this.sourceSubDocInterval.subDocument);
        targetTable.properties = this.getTableProperties(sourceTable.properties);
        targetTable.style = this.getTableStyle(sourceTable.style);
        for (const targetRow of targetTable.rows) {
            targetRow.properties = this.getTableRowProperties(targetRow.properties);
            targetRow.tablePropertiesException = this.getTableProperties(targetRow.tablePropertiesException);
            for (const targetCell of targetRow.cells) {
                targetCell.properties = this.getTableCellProperties(targetCell.properties);
                targetCell.style = this.getTableCellStyle(targetCell.style);
            }
        }
        return targetTable;
    }
    collectFields() {
        if (this.fromFieldIndexesWhatNeedCopyInfo.length > 0) {
            const sourceFields = this.sourceSubDocument.fields;
            const targetFields = this.targetSubDocument.fields;
            const modelsConstOffset = this.modelsConstOffset;
            const toStartCodePosFirstField = modelsConstOffset + sourceFields[this.fromFieldIndexesWhatNeedCopyInfo[0]].getCodeStartPosition();
            let toFieldIndex = Field.normedBinaryIndexOf(targetFields, toStartCodePosFirstField);
            if (toFieldIndex < 0 || targetFields[toFieldIndex].getCodeStartPosition() < toStartCodePosFirstField)
                toFieldIndex++;
            while (this.fromFieldIndexesWhatNeedCopyInfo.length > 0) {
                const fromField = this.sourceSubDocument.fields[this.fromFieldIndexesWhatNeedCopyInfo.shift()];
                const newField = new Field(this.targetSubDocument.positionManager, toFieldIndex, fromField.getFieldStartPosition() + modelsConstOffset, fromField.getSeparatorPosition() + modelsConstOffset, fromField.getFieldEndPosition() + modelsConstOffset, fromField.showCode, fromField.isHyperlinkField() ? fromField.getHyperlinkInfo().clone() : undefined);
                Field.addField(targetFields, newField);
                toFieldIndex++;
                this.targetModelManipulator.notifyModelChanged(new FieldInsertedSubDocumentChange(this.targetSubDocument.id, newField.getFieldStartPosition(), newField.getSeparatorPosition(), newField.getFieldEndPosition()));
                if (newField.isHyperlinkField())
                    this.targetModelManipulator.notifyModelChanged(new HyperlinkInfoChangedSubDocumentChange(this.targetSubDocument.id, newField.getResultInterval(), newField.getCodeInterval(), newField.getHyperlinkInfo()));
            }
        }
    }
    collectBookmarks() {
        this.targetModelManipulator.bookmark.insertBookmarksFromSubDocument(this.sourceSubDocument, this.targetSubDocument, this.sourceInterval, this.modelsConstOffset);
    }
    prependTableByParagraph() {
        if (this.options.insertParagraphMarkBeforeIfStartsWithTable) {
            const tbl = Table.getTableByPosition(this.sourceSubDocument.tables, this.sourceInterval.start, false);
            if (tbl && tbl.getStartPosition() == this.sourceInterval.start &&
                (this.targetSubDocument.getParagraphByPosition(this.targetStartPosition).startLogPosition.value != this.targetStartPosition ||
                    ListUtils.unsafeAnyOf(this.targetSubDocument.tables, (tbl) => tbl.getEndPosition() == this.targetStartPosition))) {
                this.targetModelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(this.targetSubDocument, this.targetStartPosition)));
                this.history.addAndRedo(new FontHiddenHistoryItem(this.targetModelManipulator, new SubDocumentInterval(this.targetSubDocument, new FixedInterval(this.targetStartPosition, 1)), true, true));
                this.targetStartPosition++;
                this.currentTargetPosition++;
            }
        }
    }
    getFontInfo(font) {
        const fontInfoCache = this.targetDocumentModel.cache.fontInfoCache;
        const targetFont = fontInfoCache.getItemByName(font.name);
        return targetFont ? targetFont :
            this.targetModelManipulator.modelManager.richOptions.fonts.getPermittedFont(fontInfoCache, font);
    }
    getColorModelInfo(color) {
        return this.targetDocumentModel.cache.colorModelInfoCache.getItem(color);
    }
    getCharPropsBundle(run) {
        return new MaskedCharacterPropertiesBundle(this.getMaskedCharacterProperties(run.maskedCharacterProperties), this.getCharacterStyle(run.characterStyle));
    }
    getMaskedParagraphPropertiesBundleFull(paragraph) {
        return new MaskedParagraphPropertiesBundleFull(this.getMaskedParagraphProperties(paragraph.maskedParagraphProperties), this.getParagraphStyle(paragraph.paragraphStyle), this.getParagraphListInfo(paragraph), paragraph.tabs.clone());
    }
    getMaskedCharacterProperties(properties) {
        const props = properties.clone();
        if (props.fontInfo)
            props.fontInfo = this.getFontInfo(props.fontInfo);
        props.highlightColor = this.getColorModelInfo(props.highlightColor);
        props.textColor = this.getColorModelInfo(props.textColor);
        props.underlineColor = this.getColorModelInfo(props.underlineColor);
        props.strikeoutColor = this.getColorModelInfo(props.strikeoutColor);
        return props;
    }
    getMaskedParagraphProperties(properties) {
        const props = properties.clone();
        props.shadingInfo = this.targetDocumentModel.cache.shadingInfoCache.getItem(props.shadingInfo);
        return props;
    }
    getTableProperties(properties) {
        const props = properties.clone();
        return props;
    }
    getTableRowProperties(properties) {
        const props = properties.clone();
        return props;
    }
    getTableCellProperties(properties) {
        const props = properties.clone();
        return props;
    }
    getCharacterStyle(style) {
        let targetStyle = this.targetDocumentModel.stylesManager.getCharacterStyleByName(style.styleName);
        if (targetStyle)
            return targetStyle;
        if (!this.options.enableCharacterStyleCreation)
            return this.targetDocumentModel.stylesManager.getDefaultCharacterStyle();
        targetStyle = style.clone();
        this.targetDocumentModel.stylesManager.registerCharacterStyle(targetStyle);
        targetStyle.maskedCharacterProperties = this.getMaskedCharacterProperties(targetStyle.maskedCharacterProperties);
        if (targetStyle.parent)
            targetStyle.parent = this.getCharacterStyle(targetStyle.parent);
        if (targetStyle.linkedStyle)
            targetStyle.linkedStyle = this.getParagraphStyle(targetStyle.linkedStyle);
        return targetStyle;
    }
    getParagraphStyle(style) {
        let targetStyle = this.targetDocumentModel.stylesManager.getParagraphStyleByName(style.styleName);
        if (targetStyle)
            return targetStyle;
        if (!this.options.enableParagraphStyleCreation)
            return this.targetDocumentModel.stylesManager.getDefaultParagraphStyle();
        targetStyle = style.clone();
        this.targetDocumentModel.stylesManager.registerParagraphStyle(targetStyle);
        targetStyle.maskedCharacterProperties = this.getMaskedCharacterProperties(targetStyle.maskedCharacterProperties);
        targetStyle.maskedParagraphProperties = this.getMaskedParagraphProperties(targetStyle.maskedParagraphProperties);
        if (targetStyle.parent)
            targetStyle.parent = this.getParagraphStyle(targetStyle.parent);
        if (targetStyle.linkedStyle)
            targetStyle.linkedStyle = this.getCharacterStyle(targetStyle.linkedStyle);
        return targetStyle;
    }
    getTableStyle(style) {
        let targetStyle = this.targetDocumentModel.stylesManager.getTableStyleByName(style.styleName);
        if (targetStyle)
            return targetStyle;
        if (!this.options.enableTableStyleCreation)
            return this.targetDocumentModel.stylesManager.getDefaultTableStyle();
        targetStyle = style.clone();
        this.targetDocumentModel.stylesManager.registerTableStyle(targetStyle);
        targetStyle.baseConditionalStyle = this.getTableConditionalStyle(targetStyle.baseConditionalStyle);
        targetStyle.conditionalStyles = NumberMapUtils.map(targetStyle.conditionalStyles, cs => this.getTableConditionalStyle(cs));
        if (targetStyle.parent)
            targetStyle.parent = this.getTableStyle(targetStyle.parent);
        return targetStyle;
    }
    getTableConditionalStyle(style) {
        const targetStyle = style.clone();
        targetStyle.maskedCharacterProperties = this.getMaskedCharacterProperties(targetStyle.maskedCharacterProperties);
        targetStyle.maskedParagraphProperties = this.getMaskedParagraphProperties(targetStyle.maskedParagraphProperties);
        targetStyle.tableProperties = this.getTableProperties(targetStyle.tableProperties);
        targetStyle.tableRowProperties = this.getTableRowProperties(targetStyle.tableRowProperties);
        targetStyle.tableCellProperties = this.getTableCellProperties(targetStyle.tableCellProperties);
        return targetStyle;
    }
    getTableCellStyle(style) {
        if (!style)
            return style;
        let targetStyle = this.targetDocumentModel.stylesManager.getTableCellStyleByName(style.styleName);
        if (targetStyle)
            return targetStyle;
        return this.targetDocumentModel.stylesManager.getDefaultTableCellStyle();
    }
    getCacheImageInfo(sourceCacheInfo) {
        let info = null;
        if (sourceCacheInfo.isLoaded) {
            if (this.targetModelManipulator.modelManager.clientMode)
                info = this.targetDocumentModel.cache.imageCache.createLoadedInfo(sourceCacheInfo.base64, sourceCacheInfo.size);
            else
                info = this.targetDocumentModel.cache.imageCache.createUnloadedInfoByBase64(sourceCacheInfo.base64, sourceCacheInfo.size);
        }
        else if (sourceCacheInfo.imageUrl)
            info = this.targetDocumentModel.cache.imageCache.createUnloadedInfoByUrl(sourceCacheInfo.imageUrl);
        else if (sourceCacheInfo.file)
            info = this.targetDocumentModel.cache.imageCache.createUnloadedInfoByFile(sourceCacheInfo.file);
        else
            info = this.targetDocumentModel.cache.imageCache.createUnloadedInfoByBase64(sourceCacheInfo.base64);
        if (!info.isLoaded)
            this.unloadedCacheImageInfo.push(info);
        return info;
    }
    getInlinePictureInfo(sourceInfo) {
        const targetPicInfo = sourceInfo.clone();
        targetPicInfo.size.cacheInfo = this.getCacheImageInfo(targetPicInfo.size.cacheInfo);
        return targetPicInfo;
    }
    getAnchorPictureInfo(sourceInfo) {
        const targetPicInfo = sourceInfo.clone();
        targetPicInfo.size.cacheInfo = this.getCacheImageInfo(targetPicInfo.size.cacheInfo);
        return targetPicInfo;
    }
    getParagraphListInfo(sourceParagraph) {
        const result = new ParagraphListInfo(-1, sourceParagraph.listLevelIndex);
        const numberingListIndex = sourceParagraph.getNumberingListIndex();
        if (numberingListIndex >= 0) {
            if (this.sameModel) {
                const sourceNumbList = this.sourceDocumentModel.numberingLists[numberingListIndex];
                result.numberingListIndex = this.targetDocumentModel.getNumberingListIndexById(sourceNumbList.getId());
                if (result.numberingListIndex < 0) {
                    let targetAbstrNumbListInd = this.targetDocumentModel.getAbstractNumberingListIndexById(this.sourceDocumentModel.abstractNumberingLists[sourceNumbList.abstractNumberingListIndex].getId());
                    if (targetAbstrNumbListInd < 0) {
                        const targetAbstrNumbList = new AbstractNumberingList(this.targetDocumentModel);
                        targetAbstrNumbList.copyFrom(this.sourceDocumentModel.abstractNumberingLists[sourceNumbList.abstractNumberingListIndex]);
                        targetAbstrNumbList.resetId();
                        targetAbstrNumbList.getId();
                        targetAbstrNumbListInd = this.targetModelManipulator.numberingList.addAbstractNumberingList(targetAbstrNumbList);
                    }
                    const targetNumberingList = new NumberingList(this.targetDocumentModel, targetAbstrNumbListInd);
                    targetNumberingList.copyFrom(sourceNumbList);
                    result.numberingListIndex = this.targetModelManipulator.numberingList.addNumberingList(targetNumberingList);
                }
            }
            else {
                let targetIndex = this.getListIndex(this.numberingListCache, this.targetDocumentModel.numberingLists, numberingListIndex);
                if (targetIndex !== undefined)
                    result.numberingListIndex = targetIndex;
                else {
                    const sourceNumbList = this.sourceDocumentModel.numberingLists[numberingListIndex];
                    const targetAbstrNumbListInd = this.getAbstractNumberingListId(sourceNumbList.abstractNumberingListIndex);
                    const targetNumberingList = new NumberingList(this.targetDocumentModel, targetAbstrNumbListInd);
                    targetNumberingList.copyFrom(sourceNumbList);
                    targetNumberingList.resetId();
                    targetNumberingList.getId();
                    result.numberingListIndex = this.targetModelManipulator.numberingList.addNumberingList(targetNumberingList);
                    const targetNumbListId = this.targetDocumentModel.numberingLists[result.numberingListIndex].getId();
                    this.numberingListCache[targetNumbListId] = numberingListIndex;
                }
            }
        }
        if (result.numberingListIndex < 0) {
            const targetParagraph = this.targetSubDocument.getParagraphByPosition(this.currentTargetPosition);
            const targetParagraphNumberingListIndex = targetParagraph.getNumberingListIndex();
            if (targetParagraphNumberingListIndex >= 0) {
                if (this.targetStartPosition === targetParagraph.startLogPosition.value) {
                    result.numberingListIndex = targetParagraphNumberingListIndex;
                    result.listLevelIndex = targetParagraph.getListLevelIndex();
                }
            }
        }
        return result;
    }
    getAbstractNumberingListId(sourceAbstrNumbListIndex) {
        let targetIndex = this.getListIndex(this.abstractNumberingListIndexesMap, this.targetDocumentModel.abstractNumberingLists, sourceAbstrNumbListIndex);
        if (targetIndex !== undefined)
            return targetIndex;
        const targetAbstrNumbList = new AbstractNumberingList(this.targetDocumentModel);
        targetAbstrNumbList.copyFrom(this.sourceDocumentModel.abstractNumberingLists[sourceAbstrNumbListIndex]);
        targetAbstrNumbList.resetId();
        targetAbstrNumbList.getId();
        targetIndex = this.targetModelManipulator.numberingList.addAbstractNumberingList(targetAbstrNumbList);
        const targetNumberingListId = this.targetDocumentModel.abstractNumberingLists[targetIndex].getId();
        this.abstractNumberingListIndexesMap[targetNumberingListId] = sourceAbstrNumbListIndex;
        return targetIndex;
    }
    getListIndex(cache, list, sourceIndex) {
        const targetIndex = NumberMapUtils.keyBy(cache, (val) => val == sourceIndex);
        return isDefined(targetIndex) ? ListUtils.indexBy(list, (list) => list.getId() == targetIndex) : undefined;
    }
}
