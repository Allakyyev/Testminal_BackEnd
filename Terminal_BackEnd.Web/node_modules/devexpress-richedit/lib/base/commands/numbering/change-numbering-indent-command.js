import { ListLevelParagraphLeftIndentHistoryItem } from '../../../core/model/history/items/list-level-paragraph-properties-history-items';
import { AddParagraphToListHistoryItem } from '../../../core/model/history/items/numbering-list-history-items';
import { ParagraphFirstLineIndent } from '../../../core/model/paragraph/paragraph-properties';
import { SimpleCommandState } from '../command-states';
import { ParagraphIndentCommandBase } from '../paragraph-properties/paragraph-indent-command-base';
export class ChangeNumberingIndentCommandBase extends ParagraphIndentCommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        return new SimpleCommandState(this.isEnabled(options));
    }
    isEnabled(options) {
        return super.isEnabled(options) && options.subDocument.getParagraphByPosition(options.intervalsInfo.position).isInList();
    }
    executeCore(_state, options) {
        var paragraphIndices = options.subDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        var firstParagraph = options.subDocument.paragraphs[paragraphIndices[0]];
        if (!firstParagraph.isInList())
            return false;
        this.history.beginTransaction();
        if (this.hasPreviousParagraphsInList(paragraphIndices[0], options.subDocument) || firstParagraph.getListLevelIndex() > 0)
            this.changeListLevelIndices(paragraphIndices, options.subDocument);
        else
            this.changeListLevelIndents(paragraphIndices, options.subDocument);
        this.history.endTransaction();
        return true;
    }
    changeListLevelIndices(paragraphIndices, subDocument) {
        var paragraphIndicesLength = paragraphIndices.length;
        for (let i = 0; i < paragraphIndicesLength; i++) {
            var paragraphIndex = paragraphIndices[i];
            var paragraph = subDocument.paragraphs[paragraphIndex];
            var newListLevelIndex = this.getNewListLevelIndex(paragraph);
            if (newListLevelIndex !== paragraph.getListLevelIndex())
                this.history.addAndRedo(new AddParagraphToListHistoryItem(this.modelManipulator, subDocument, paragraphIndex, paragraph.numberingListIndex, newListLevelIndex));
        }
    }
    changeListLevelIndents(paragraphIndices, subDocument) {
        const startParagraph = subDocument.paragraphs[paragraphIndices[0]];
        const tabs = this.getTabs(paragraphIndices, subDocument);
        const abstractNumberingListIndex = startParagraph.getAbstractNumberingListIndex();
        const abstractNumberingList = startParagraph.getAbstractNumberingList();
        const firstLevelProperties = abstractNumberingList.levels[0].getParagraphMergedProperties();
        const currentLeftIndent = this.getLeftIndentPosition(firstLevelProperties.leftIndent, firstLevelProperties.firstLineIndent, firstLevelProperties.firstLineIndentType);
        const nextListLevelIndent = this.getNextListLevelIndent(currentLeftIndent, tabs);
        this.assignNewIndent(abstractNumberingListIndex, nextListLevelIndent);
    }
    assignNewIndent(abstractNumberingListIndex, nextListLevelIndent) {
        var abstractNumberingList = this.control.modelManager.model.abstractNumberingLists[abstractNumberingListIndex];
        var levels = abstractNumberingList.levels;
        var firstLevelProperties = abstractNumberingList.levels[0].getParagraphMergedProperties();
        var delta = this.calculateLeftIndentDelta(nextListLevelIndent, firstLevelProperties.leftIndent, firstLevelProperties.firstLineIndent, firstLevelProperties.firstLineIndentType);
        var levelCount = levels.length;
        for (var i = 0; i < levelCount; i++) {
            var level = levels[i];
            var levelProperties = level.getParagraphMergedProperties();
            var newLeftIndent = levelProperties.leftIndent + delta;
            if (newLeftIndent >= 0) {
                if (levelProperties.firstLineIndentType == ParagraphFirstLineIndent.Hanging) {
                    var firstLineLeftIndent = newLeftIndent - levelProperties.firstLineIndent;
                    if (firstLineLeftIndent < 0)
                        newLeftIndent -= firstLineLeftIndent;
                }
                if (i == 0 && levelProperties.leftIndent == newLeftIndent)
                    break;
                this.history.addAndRedo(new ListLevelParagraphLeftIndentHistoryItem(this.modelManipulator, true, abstractNumberingListIndex, i, newLeftIndent, true));
            }
            else if (i == 0)
                break;
        }
    }
    calculateLeftIndentDelta(nextListLevelIndent, currentLeftIndent, firstLineIndent, firstLineIndentType) {
        return nextListLevelIndent - this.getLeftIndentPosition(currentLeftIndent, firstLineIndent, firstLineIndentType);
    }
    hasPreviousParagraphsInList(paragraphIndex, subDocument) {
        var abstractNumberingListIndex = subDocument.paragraphs[paragraphIndex].getAbstractNumberingListIndex();
        for (var i = paragraphIndex - 1, prevParagraph; prevParagraph = subDocument.paragraphs[i]; i--) {
            if (prevParagraph.getAbstractNumberingListIndex() === abstractNumberingListIndex)
                return true;
        }
        return false;
    }
    getLeftIndentPosition(currentLeftIndent, firstLineIndent, firstLineIndentType) {
        return firstLineIndentType === ParagraphFirstLineIndent.Hanging ? (currentLeftIndent - firstLineIndent) : currentLeftIndent;
    }
}
export class IncrementNumberingIndentCommand extends ChangeNumberingIndentCommandBase {
    getNextListLevelIndent(currentLeftIndent, tabs) {
        var nearestRightDefaultTab = this.getNearRightDefaultTab(currentLeftIndent);
        var nearestRightTab = this.getNearRightTab(currentLeftIndent, tabs);
        return (nearestRightDefaultTab < nearestRightTab || nearestRightTab == currentLeftIndent) ? nearestRightDefaultTab : nearestRightTab;
    }
    getNewListLevelIndex(paragraph) {
        return Math.min(7, paragraph.getListLevelIndex() + 1);
    }
}
export class DecrementNumberingIndentCommand extends ChangeNumberingIndentCommandBase {
    getNextListLevelIndent(currentLeftIndent, tabs) {
        var nearestLeftDefaultTab = this.getNearLeftDefaultTab(currentLeftIndent);
        var nearestLeftTab = this.getNearLeftTab(currentLeftIndent, tabs);
        return (nearestLeftDefaultTab > nearestLeftTab || nearestLeftTab == currentLeftIndent) ? nearestLeftDefaultTab : nearestLeftTab;
    }
    getNewListLevelIndex(paragraph) {
        return Math.max(0, paragraph.getListLevelIndex() - 1);
    }
}
