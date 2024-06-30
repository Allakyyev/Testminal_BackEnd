import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MaskedCharacterPropertiesBundle, MaskedParagraphPropertiesBundleFull, ParagraphListInfo } from '../../../rich-utils/properties-bundle';
import { HyperlinkInfoChangedSubDocumentChange } from '../../changes/sub-document/field/hyperlink-info-changed';
import { FieldInsertedSubDocumentChange } from '../../changes/sub-document/field/inserted';
import { Field } from '../../fields/field';
import { AbstractNumberingList, NumberingList } from '../../numbering-lists/numbering-list';
import { AnchoredPictureRun } from '../../runs/anchored-picture-run';
import { InlinePictureRun } from '../../runs/inline-picture-run';
import { RunType } from '../../runs/run-type';
import { SubDocumentInterval, SubDocumentPosition } from '../../sub-document';
import { BaseManipulator } from '../base-manipulator';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
import { BaseTextBoxInfo } from '../text-box-manipulator';
import { InsertTextManipulatorParams } from '../text-manipulator/insert-text-manipulator-params';
export class DocumentMerger extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
    }
    mergeDocumentModel(sourceInfo, targetSubDocPos) {
        this.history.beginTransaction();
        const targetSubDocument = targetSubDocPos.subDocument;
        let targetPosition = targetSubDocPos.position;
        const sourceSubDocument = sourceInfo.subDocument;
        const sourceInterval = sourceInfo.interval;
        const fromDocumentModel = sourceSubDocument.documentModel;
        const toDocumentModel = targetSubDocument.documentModel;
        const constRunIterator = sourceSubDocument.getConstRunIterator(sourceInterval);
        const fromFieldIndexesWhatNeedCopyInfo = [];
        const fromFields = sourceSubDocument.fields;
        const toFields = targetSubDocument.fields;
        const modelsOffset = targetPosition - sourceInterval.start;
        const insertImgCacheInfo = (cacheInfo) => {
            cacheInfo = cacheInfo.clone();
            toDocumentModel.cache.imageCache.registerFromAnotherModel(cacheInfo);
            this.modelManipulator.picture.loader.load(cacheInfo);
            return cacheInfo;
        };
        let isMoved = constRunIterator.moveNext();
        if (isMoved && this.needInsertParagraphBeforeTable(sourceSubDocument, sourceInterval)) {
            this.insertParagraph(toDocumentModel, targetSubDocument, constRunIterator.currentRun, targetPosition, -1, constRunIterator.currentRun.paragraph.listLevelIndex);
            targetPosition++;
        }
        let toCurrentPosition = targetPosition;
        while (isMoved) {
            var currentRun = constRunIterator.currentRun;
            switch (currentRun.getType()) {
                case RunType.FieldCodeStartRun:
                    var fromGlobPos = constRunIterator.currentChunk.startLogPosition.value + currentRun.startOffset;
                    fromFieldIndexesWhatNeedCopyInfo.push(Field.normedBinaryIndexOf(sourceSubDocument.fields, fromGlobPos + 1));
                case RunType.FieldCodeEndRun:
                case RunType.FieldResultEndRun:
                case RunType.TextRun:
                case RunType.LayoutDependentRun:
                    var insertedText = constRunIterator.currentChunk.getRunText(currentRun);
                    var insertedMaskedCharacterProperties = toDocumentModel.cache.maskedCharacterPropertiesCache.getItem(currentRun.maskedCharacterProperties);
                    var insertedCharacterStyle = toDocumentModel.stylesManager.addCharacterStyle(currentRun.characterStyle);
                    this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(targetSubDocument, toCurrentPosition), new MaskedCharacterPropertiesBundle(insertedMaskedCharacterProperties, insertedCharacterStyle), currentRun.getType() == RunType.LayoutDependentRun && targetSubDocument.isMain() ? RunType.TextRun : currentRun.getType(), insertedText));
                    break;
                case RunType.InlinePictureRun: {
                    var currentPictureRun = currentRun;
                    if (!(currentPictureRun instanceof InlinePictureRun))
                        throw new Error("In TexManipulator.insertPartSubDocumentInOtherSubDocument currentPictureRun not have type InlinePictureRun");
                    const info = currentPictureRun.info.clone();
                    info.size.cacheInfo = insertImgCacheInfo(info.size.cacheInfo);
                    this.modelManipulator.picture.insertInlinePictureInner(new SubDocumentPosition(targetSubDocument, toCurrentPosition), currentPictureRun.getCharPropsBundle(toDocumentModel), info);
                    break;
                }
                case RunType.AnchoredPictureRun: {
                    let currentAnchoredPictureRun = currentRun;
                    if (!(currentAnchoredPictureRun instanceof AnchoredPictureRun))
                        throw new Error("In TexManipulator.insertPartSubDocumentInOtherSubDocument currentAnchoredPictureRun not have type AnchoredPictureRun");
                    this.modelManipulator.picture.insertAnchoredPictureInner(new SubDocumentPosition(targetSubDocument, toCurrentPosition), currentAnchoredPictureRun.getCharPropsBundle(toDocumentModel), currentAnchoredPictureRun.info.clone());
                    break;
                }
                case RunType.InlineTextBoxRun:
                    break;
                case RunType.AnchoredTextBoxRun: {
                    const currentAnchoredTextBoxRun = currentRun;
                    if (targetSubDocument.isTextBox()) {
                        this.modelManipulator.text.insertTextInner(new InsertTextManipulatorParams(new SubDocumentPosition(targetSubDocument, toCurrentPosition), currentAnchoredTextBoxRun.getCharPropsBundle(toDocumentModel), RunType.TextRun, " "));
                        break;
                    }
                    let newAnchoredTextBox = this.modelManipulator.textBox.insertAnchoredTextBox(new SubDocumentPosition(targetSubDocument, toCurrentPosition), currentRun.getCharPropsBundle(toDocumentModel), new BaseTextBoxInfo(null, currentAnchoredTextBoxRun.size.clone(), currentAnchoredTextBoxRun.shape.clone(), currentAnchoredTextBoxRun.anchorInfo.clone(), currentAnchoredTextBoxRun.textBoxProperties.clone(), currentAnchoredTextBoxRun.containerProperties.clone()));
                    const sourceSubDoc = this.modelManipulator.model.subDocuments[currentAnchoredTextBoxRun.subDocId];
                    const targetSubDoc = this.modelManipulator.model.subDocuments[newAnchoredTextBox.subDocId];
                    this.mergeDocumentModel(new SubDocumentInterval(sourceSubDoc, new FixedInterval(0, sourceSubDoc.getDocumentEndPosition())), new SubDocumentPosition(targetSubDoc, 0));
                    this.modelManipulator.range.removeIntervalInner(targetSubDoc, new FixedInterval(targetSubDoc.getDocumentEndPosition() - 2, 1), false);
                    break;
                }
                case RunType.ParagraphRun:
                    var toNumberingListIndex = -1;
                    var toListLevelIndex = currentRun.paragraph.listLevelIndex;
                    if (currentRun.paragraph.numberingListIndex >= 0) {
                        var fromNumberingList = fromDocumentModel.numberingLists[currentRun.paragraph.numberingListIndex];
                        toNumberingListIndex = toDocumentModel.getNumberingListIndexById(fromNumberingList.getId());
                        if (toNumberingListIndex < 0) {
                            var toAbstractNumberingListIndex = toDocumentModel.getAbstractNumberingListIndexById(fromDocumentModel.abstractNumberingLists[fromNumberingList.abstractNumberingListIndex].getId());
                            if (toAbstractNumberingListIndex < 0) {
                                var toAbstractNumberingList = new AbstractNumberingList(toDocumentModel);
                                toAbstractNumberingList.copyFrom(fromDocumentModel.abstractNumberingLists[fromNumberingList.abstractNumberingListIndex]);
                                toAbstractNumberingListIndex = this.modelManipulator.numberingList.addAbstractNumberingList(toAbstractNumberingList);
                            }
                            var toNumberingList = new NumberingList(toDocumentModel, toAbstractNumberingListIndex);
                            toNumberingList.copyFrom(fromNumberingList);
                            toNumberingListIndex = this.modelManipulator.numberingList.addNumberingList(toNumberingList);
                        }
                    }
                    if (toNumberingListIndex < 0) {
                        var toParagraph = targetSubDocument.getParagraphByPosition(toCurrentPosition);
                        var toParagraphNumberingListIndex = toParagraph.getNumberingListIndex();
                        if (toParagraphNumberingListIndex >= 0) {
                            if (targetPosition === toParagraph.startLogPosition.value) {
                                toNumberingListIndex = toParagraphNumberingListIndex;
                                toListLevelIndex = toParagraph.getListLevelIndex();
                            }
                        }
                    }
                    this.insertParagraph(toDocumentModel, targetSubDocument, currentRun, toCurrentPosition, toNumberingListIndex, toListLevelIndex);
                    break;
                case RunType.SectionRun:
                    this.modelManipulator.section.insertSection(new SubDocumentPosition(targetSubDocument, toCurrentPosition), currentRun.getCharPropsBundle(toDocumentModel), constRunIterator.currentSection.sectionProperties.clone(), true, currentRun.paragraph.getParagraphBundleFull(toDocumentModel), true);
                    break;
                default: throw new Error("In TextManipulator.insertPartSubDocumentInOtherSubDocument need insert some inknown run type = " + currentRun.getType());
            }
            toCurrentPosition += currentRun.getLength();
            isMoved = constRunIterator.moveNext();
        }
        let newTables = [];
        for (let i = 0, table; table = sourceSubDocument.tables[i]; i++)
            newTables.push(this.modelManipulator.table.pasteTable(targetSubDocument, table, targetPosition + table.getStartPosition()));
        if (fromFieldIndexesWhatNeedCopyInfo.length > 0) {
            var toStartCodePosFirstField = modelsOffset + fromFields[fromFieldIndexesWhatNeedCopyInfo[0]].getCodeStartPosition();
            var toFieldIndex = Field.normedBinaryIndexOf(toFields, toStartCodePosFirstField);
            if (toFieldIndex < 0 || toFields[toFieldIndex].getCodeStartPosition() < toStartCodePosFirstField)
                toFieldIndex++;
            while (fromFieldIndexesWhatNeedCopyInfo.length > 0) {
                var fromField = sourceSubDocument.fields[fromFieldIndexesWhatNeedCopyInfo.shift()];
                var newField = new Field(targetSubDocument.positionManager, toFieldIndex, fromField.getFieldStartPosition() + modelsOffset, fromField.getSeparatorPosition() + modelsOffset, fromField.getFieldEndPosition() + modelsOffset, fromField.showCode, fromField.isHyperlinkField() ? fromField.getHyperlinkInfo().clone() : undefined);
                Field.addField(toFields, newField);
                toFieldIndex++;
                this.modelManipulator.notifyModelChanged(new FieldInsertedSubDocumentChange(targetSubDocument.id, newField.getFieldStartPosition(), newField.getSeparatorPosition(), newField.getFieldEndPosition()));
                if (newField.isHyperlinkField())
                    this.modelManipulator.notifyModelChanged(new HyperlinkInfoChangedSubDocumentChange(targetSubDocument.id, newField.getResultInterval(), newField.getCodeInterval(), newField.getHyperlinkInfo()));
            }
        }
        this.modelManipulator.bookmark.insertBookmarksFromSubDocument(sourceSubDocument, targetSubDocument, sourceInterval, modelsOffset);
        this.history.endTransaction();
        return newTables;
    }
    needInsertParagraphBeforeTable(sourceSubDocument, sourceInterval) {
        const paragraph = sourceSubDocument.getParagraphByPosition(sourceInterval.start);
        if (paragraph.interval.start != sourceInterval.start)
            return false;
        return ListUtils.anyOf(sourceSubDocument.tables, (table) => table.interval.start <= sourceInterval.start && table.interval.end >= sourceInterval.start);
    }
    insertParagraph(toDocumentModel, targetSubDocument, currentRun, toCurrentPosition, toNumberingListIndex, toListLevelIndex) {
        this.modelManipulator.paragraph.insertParagraphInner(new InsertParagraphManipulatorParams(new SubDocumentPosition(targetSubDocument, toCurrentPosition), currentRun.getCharPropsBundle(toDocumentModel), new MaskedParagraphPropertiesBundleFull(toDocumentModel.cache.maskedParagraphPropertiesCache.getItem(currentRun.paragraph.maskedParagraphProperties), currentRun.paragraph.paragraphStyle, new ParagraphListInfo(toNumberingListIndex, toListLevelIndex), currentRun.paragraph.tabs.clone()), true, () => { }));
    }
}
