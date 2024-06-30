import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutNumberingListBox } from '../../../core/layout/main-structures/layout-boxes/layout-numbering-list-box';
import { LayoutParagraphMarkBox } from '../../../core/layout/main-structures/layout-boxes/layout-paragraph-mark-box';
import { Field } from '../../../core/model/fields/field';
import { ListLevelFontNameHistoryItem, ListLevelFontSizeHistoryItem } from '../../../core/model/history/items/list-level-character-properties-history-items';
import { ListLevelDisplayFormatStringHistoryItem, ListLevelFormatHistoryItem, ListLevelOriginalLeftIndentHistoryItem } from '../../../core/model/history/items/list-level-properties-history-items';
import { AddAbstractNumberingListHistoryItem, AddNumberingListHistoryItem, AddParagraphToListHistoryItem } from '../../../core/model/history/items/numbering-list-history-items';
import { ParagraphFirstLineIndentHistoryItem, ParagraphFirstLineIndentTypeHistoryItem, ParagraphLeftIndentHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { RemoveIntervalHistoryItem } from '../../../core/model/history/items/remove-interval-history-item';
import { NumberingHelper } from '../../../core/model/numbering-lists/numbering-helper';
import { AbstractNumberingList, NumberingList, NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { NumberingListIndexCalculator } from '../../../core/model/numbering-lists/numbering-list-index-calculator';
import { ParagraphFirstLineIndent } from '../../../core/model/paragraph/paragraph-properties';
import { RichUtils } from '../../../core/model/rich-utils';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Errors } from '@devexpress/utils/lib/errors';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
export class NumberingListCommandBaseBase extends CommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        const intervals = ListUtils.deepCopy(options.intervalsInfo.intervals);
        return new IntervalCommandStateEx(this.isEnabled(), intervals, this.getValue(intervals, options.subDocument));
    }
    getValue(intervals, subDocument) {
        return this.areAllParagraphsHasValidNumberingListType(intervals, subDocument);
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return isNumber(parameter) ? parameter : -1;
    }
    deleteNumberingList(paragraphIndices, subDocument) {
        NumberingHelper.deleteNumberingList(this.control.modelManager, subDocument, paragraphIndices);
    }
    insertNumberingList(paragraphIndices, startIndex, subDocument) {
        var calculator = new NumberingListIndexCalculator(subDocument, this.getNumberingListType(), startIndex === undefined ? -1 : startIndex);
        var targetListInfo = calculator.getTargetListInfo(paragraphIndices);
        var targetListIndex = targetListInfo ? targetListInfo.listIndex : this.createNewList(this.getAbstractNumberingList());
        var targetListLevelIndex = targetListInfo ? targetListInfo.listlevelIndex : -1;
        var paragraphsLayoutPositions = this.getParagraphsLayoutPositions(paragraphIndices, subDocument);
        var paragraphsLevelIndices = this.getParagraphsLevelIndices(paragraphIndices, paragraphsLayoutPositions, !!targetListInfo, targetListIndex, targetListLevelIndex, subDocument);
        this.insertNumberingListCore(paragraphIndices, targetListIndex, paragraphsLevelIndices, paragraphsLayoutPositions, subDocument);
    }
    changeNumberingList(paragraphIndices, subDocument) {
        let paragraph = subDocument.paragraphs[paragraphIndices[0]];
        let numberingListIndex = paragraph.getNumberingListIndex();
        let targetListIndex = this.createNewList(this.getAbstractNumberingList());
        this.assignLevelsIndents(paragraphIndices[0], targetListIndex, subDocument);
        for (let i = 0, paragraph; paragraph = subDocument.paragraphs[i]; i++) {
            if (paragraph.getNumberingListIndex() === numberingListIndex)
                this.history.addAndRedo(new AddParagraphToListHistoryItem(this.modelManipulator, subDocument, i, targetListIndex, paragraph.getListLevelIndex()));
        }
    }
    modifyLevels(paragraphIndices, subDocument) {
        let paragraph = subDocument.paragraphs[paragraphIndices[0]];
        let numberingListIndex = paragraph.getNumberingListIndex();
        const targetListIndex = this.createNewList(this.getAbstractNumberingList());
        const targetList = this.control.modelManager.model.numberingLists[targetListIndex];
        const abstractNumberingListIndex = this.control.modelManager.model.numberingLists[numberingListIndex].abstractNumberingListIndex;
        ListUtils.forEach(paragraphIndices, (index) => {
            const paragraph = subDocument.paragraphs[index];
            if (paragraph.getNumberingListIndex() === numberingListIndex) {
                const levelIndex = paragraph.getListLevelIndex();
                const targetListLevel = targetList.levels[levelIndex];
                this.history.addAndRedo(new ListLevelDisplayFormatStringHistoryItem(this.modelManipulator, true, abstractNumberingListIndex, levelIndex, targetListLevel.getListLevelProperties().displayFormatString));
                this.history.addAndRedo(new ListLevelFormatHistoryItem(this.modelManipulator, true, abstractNumberingListIndex, levelIndex, targetListLevel.getListLevelProperties().format));
                this.history.addAndRedo(new ListLevelFontNameHistoryItem(this.modelManipulator, true, abstractNumberingListIndex, levelIndex, targetListLevel.getCharacterMergedProperties().fontInfo, true));
                this.history.addAndRedo(new ListLevelFontSizeHistoryItem(this.modelManipulator, true, abstractNumberingListIndex, levelIndex, targetListLevel.getCharacterMergedProperties().fontSize, true));
            }
        });
    }
    getAbstractNumberingList() {
        return this.control.modelManager.model.abstractNumberingListTemplates[this.getNumberingListTemplateIndex(this.getNumberingListType())];
    }
    insertNumberingListCore(paragraphIndices, targetListIndex, paragraphsLevelIndices, paragraphsLayoutPositions, subDocument) {
        var paragraphIndicesLength = paragraphIndices.length;
        for (let i = 0; i < paragraphIndicesLength; i++) {
            let paragraphIndex = paragraphIndices[i];
            var paragraph = subDocument.paragraphs[paragraphIndex];
            this.processOldNumberingList(paragraph, subDocument);
            var targetListLevel = paragraphsLevelIndices[i];
            if (!paragraph.isInList())
                this.deleteLeadingWhiteSpaces(paragraph, paragraphsLayoutPositions[i].row.boxes, targetListLevel < 0, subDocument);
            if (targetListLevel >= 0) {
                this.history.addAndRedo(new AddParagraphToListHistoryItem(this.modelManipulator, subDocument, paragraphIndex, targetListIndex, targetListLevel));
                this.history.addAndRedo(new ParagraphLeftIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(paragraph.startLogPosition.value, 1)), paragraph.maskedParagraphProperties.leftIndent, false));
                this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(paragraph.startLogPosition.value, 1)), paragraph.maskedParagraphProperties.firstLineIndent, false));
            }
        }
    }
    processOldNumberingList(paragraph, subDocument) {
        if (paragraph.isInList()) {
            if (paragraph.numberingListIndex == NumberingList.NumberingListNotSettedIndex) {
                var leftIndent = paragraph.getParagraphMergedProperties().leftIndent;
                this.history.addAndRedo(new ParagraphLeftIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(paragraph.startLogPosition.value, 1)), leftIndent, true));
            }
        }
    }
    deleteLeadingWhiteSpaces(paragraph, boxes, replaceOnIndent, subDocument) {
        var length = 0;
        var leftIndent = 0;
        var manipulator = this.modelManipulator;
        for (var i = 0, box; box = boxes[i]; i++) {
            if (box.isWhitespace() && this.notInsideField(paragraph.startLogPosition.value + length + box.getLength(), subDocument)) {
                length += box.getLength();
                leftIndent += box.width;
            }
            else
                break;
        }
        if (length > 0) {
            this.correctSelectionIntervals(new FixedInterval(paragraph.startLogPosition.value, length));
            this.history.addAndRedo(new RemoveIntervalHistoryItem(manipulator, new SubDocumentInterval(subDocument, new FixedInterval(paragraph.startLogPosition.value, length)), false));
        }
        if (replaceOnIndent && leftIndent > 0) {
            leftIndent = UnitConverter.pixelsToTwips(leftIndent);
            var properties = paragraph.getParagraphMergedProperties();
            var interval = paragraph.interval;
            if (properties.firstLineIndentType === ParagraphFirstLineIndent.Hanging) {
                if (leftIndent < properties.firstLineIndent)
                    this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(manipulator, new SubDocumentInterval(subDocument, interval), properties.firstLineIndent - leftIndent, true));
                else if (properties.firstLineIndent === leftIndent) {
                    this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(manipulator, new SubDocumentInterval(subDocument, interval), 0, true));
                    this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(manipulator, new SubDocumentInterval(subDocument, interval), ParagraphFirstLineIndent.None, true));
                }
                else {
                    this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(manipulator, new SubDocumentInterval(subDocument, interval), leftIndent - properties.firstLineIndent, true));
                    this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(manipulator, new SubDocumentInterval(subDocument, interval), ParagraphFirstLineIndent.Indented, true));
                }
            }
            else {
                this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(manipulator, new SubDocumentInterval(subDocument, interval), properties.firstLineIndent + leftIndent, true));
                if (properties.firstLineIndentType === ParagraphFirstLineIndent.None)
                    this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(manipulator, new SubDocumentInterval(subDocument, interval), ParagraphFirstLineIndent.Indented, true));
            }
        }
    }
    notInsideField(position, subDocument) {
        return Field.binaryIndexOf(subDocument.fields, position) < 0;
    }
    correctSelectionIntervals(removingInterval) {
        var intervals = ListUtils.deepCopy(this.selection.intervalsInfo.intervals);
        for (let i = 0, interval; interval = intervals[i]; i++) {
            if (interval.start > removingInterval.start) {
                var newSelectionEnd = Math.max(removingInterval.start, interval.end - removingInterval.length);
                var newSelectionStart = Math.max(removingInterval.start, interval.start - removingInterval.length);
                intervals[i] = FixedInterval.fromPositions(newSelectionStart, newSelectionEnd);
            }
        }
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals(intervals)));
    }
    getParagraphsLayoutPositions(paragraphIndices, subDocument) {
        var result = [];
        var paragraphIndicesLength = paragraphIndices.length;
        for (let i = 0; i < paragraphIndicesLength; i++) {
            var paragraphIndex = paragraphIndices[i];
            var paragraph = subDocument.paragraphs[paragraphIndex];
            var logPosition = paragraph.startLogPosition.value;
            var endRowConflictTags = new LayoutPositionCreatorConflictFlags().setDefault(false);
            var middleRowConflictTags = new LayoutPositionCreatorConflictFlags().setDefault(false);
            result.push(subDocument.isMain()
                ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, logPosition, DocumentLayoutDetailsLevel.Box, endRowConflictTags, middleRowConflictTags)
                : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, logPosition, this.selection.pageIndex, DocumentLayoutDetailsLevel.Box).create(endRowConflictTags, middleRowConflictTags));
        }
        return result;
    }
    getParagraphsLevelIndices(paragraphIndices, layoutPositions, _continueNumberingList, listIndex, listLevelIndex, subDocument) {
        const result = [];
        const numberingList = this.control.modelManager.model.numberingLists[listIndex];
        const paragraphIndicesLength = paragraphIndices.length;
        for (let i = 0; i < paragraphIndicesLength; i++) {
            var paragraphIndex = paragraphIndices[i];
            if (listLevelIndex < 0) {
                const paragraph = subDocument.paragraphs[paragraphIndex];
                const layoutPosition = layoutPositions[i];
                let offsetLeft = layoutPosition.row.x;
                const cellInfo = layoutPosition.row.tableCellInfo;
                if (cellInfo)
                    offsetLeft -= cellInfo.x;
                const box = layoutPosition.row.numberingListBox ? layoutPosition.row.numberingListBox :
                    this.getStartBox(layoutPosition.row.boxes);
                offsetLeft += box instanceof LayoutNumberingListBox ? box.textBox.x : box.x;
                if (box instanceof LayoutParagraphMarkBox && (paragraphIndicesLength > 1 && (paragraph.length <= 1 || i !== 0)))
                    result.push(-1);
                else
                    result.push(this.calculateParagraphListLevel(offsetLeft, paragraph, numberingList));
            }
            else
                result.push(listLevelIndex);
        }
        this.assignLevelsIndents(paragraphIndices[0], listIndex, subDocument);
        return result;
    }
    calculateParagraphListLevel(layoutLeftIndent, _paragraph, numberingList) {
        var modelLeftIndent = UnitConverter.pixelsToTwips(layoutLeftIndent);
        for (var i = 0, level; level = numberingList.levels[i]; i++) {
            var levelParagraphProperties = level.getParagraphMergedProperties();
            var actualNumberingPosition = levelParagraphProperties.firstLineIndentType == ParagraphFirstLineIndent.Hanging ?
                (levelParagraphProperties.leftIndent - levelParagraphProperties.firstLineIndent) : levelParagraphProperties.leftIndent;
            if (modelLeftIndent <= actualNumberingPosition)
                return i;
        }
        return numberingList.levels.length - 1;
    }
    getStartBox(boxes) {
        for (var i = 0, box; box = boxes[i]; i++) {
            if (!box.isWhitespace())
                return box;
        }
        return boxes[0];
    }
    createNewList(template) {
        var abstractNumberingList = new AbstractNumberingList(this.control.modelManager.model);
        abstractNumberingList.copyFrom(template);
        abstractNumberingList.resetId();
        this.history.addAndRedo(new AddAbstractNumberingListHistoryItem(this.modelManipulator, abstractNumberingList));
        var abstractNumberingListIndex = this.control.modelManager.model.abstractNumberingLists.length - 1;
        var numberingList = new NumberingList(this.control.modelManager.model, abstractNumberingListIndex);
        this.history.addAndRedo(new AddNumberingListHistoryItem(this.modelManipulator, numberingList));
        return this.control.modelManager.model.numberingLists.length - 1;
    }
    processParagraphByIndex(_paragraphIndex) {
        return true;
    }
    getNumberingListTemplateIndex(type) {
        return NumberingHelper.getNumberingListTemplateIndex(this.control.modelManager.model, type);
    }
    areAllParagraphsHasValidNumberingListType(intervals, subDocument) {
        var levelType = this.getNumberingListType();
        var paragraphIndices = subDocument.getParagraphIndicesByIntervals(intervals);
        for (let i = paragraphIndices.length - 1; i >= 0; i--) {
            let paragraphIndex = paragraphIndices[i];
            var paragraph = subDocument.paragraphs[paragraphIndex];
            if (!paragraph.isInList() || paragraph.getNumberingList().getLevelType(paragraph.getListLevelIndex()) !== levelType)
                return false;
        }
        return true;
    }
    getNumberingListType() {
        throw new Error(Errors.NotImplemented);
    }
    assignLevelsIndents(paragraphIndex, listIndex, subDocument) {
        var numberingList = this.control.modelManager.model.numberingLists[listIndex];
        this.assignLevelsIndentsCore(paragraphIndex, listIndex, numberingList.levels, subDocument);
    }
    assignLevelsIndentsCore(paragraphIndex, listIndex, listLevels, subDocument) {
        var paragraph = subDocument.paragraphs[paragraphIndex];
        if (!paragraph.isInList())
            return;
        let originNumberingList = paragraph.getNumberingList();
        for (var i = 0, listLevel; listLevel = listLevels[i]; i++) {
            let originListLevelProperties = originNumberingList.levels[0].getListLevelProperties();
            let listLevelProperties = listLevel.getListLevelProperties();
            if (originListLevelProperties.originalLeftIndent !== listLevelProperties.originalLeftIndent)
                this.history.addAndRedo(new ListLevelOriginalLeftIndentHistoryItem(this.modelManipulator, false, listIndex, i, originListLevelProperties.originalLeftIndent));
        }
    }
}
export class NumberingListCommandBase extends NumberingListCommandBaseBase {
    executeCore(state, options) {
        this.history.beginTransaction();
        const subDocument = options.subDocument;
        var paragraphIndices = subDocument.getParagraphIndicesByIntervals(state.intervals);
        let targetStartIndex = options.param;
        if (state.value)
            this.deleteNumberingList(paragraphIndices, subDocument);
        else if (this.selection.isCollapsed() && options.subDocument.paragraphs[paragraphIndices[0]].isInList() && targetStartIndex < 0) {
            const isMultilevelListType = this.getNumberingListType() == NumberingType.MultiLevel;
            const firstLevelSelected = ListUtils.unsafeAnyOf(paragraphIndices, (index) => {
                const paragraph = this.selection.activeSubDocument.paragraphs[index];
                return paragraph.getListLevelIndex() == 0;
            });
            if (isMultilevelListType || firstLevelSelected)
                this.changeNumberingList(paragraphIndices, subDocument);
            else
                this.modifyLevels(paragraphIndices, subDocument);
        }
        else
            this.insertNumberingList(paragraphIndices, targetStartIndex, subDocument);
        this.history.endTransaction();
        this.selection.changeState(newState => newState.setEndOfLine(false));
        return true;
    }
}
