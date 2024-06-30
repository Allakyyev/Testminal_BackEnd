import { ListLevelParagraphLeftIndentHistoryItem } from '../../../core/model/history/items/list-level-paragraph-properties-history-items';
import { ListLevelOriginalLeftIndentHistoryItem } from '../../../core/model/history/items/list-level-properties-history-items';
import { NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { ControlOptions } from '../../../core/model/options/control';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberingListCommandBase } from './numbering-list-command-base';
export class ToggleNumberingListCommand extends NumberingListCommandBase {
    getNumberingListType() {
        return NumberingType.Simple;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.numberingSimple);
    }
    getParagraphsLevelIndices(paragraphIndices, layoutPositions, continueNumberingList, listIndex, listLevelIndex, subDocument) {
        if (listLevelIndex >= 0 || !this.equalLeftIndent(paragraphIndices, layoutPositions, listIndex))
            return super.getParagraphsLevelIndices(paragraphIndices, layoutPositions, continueNumberingList, listIndex, listLevelIndex, subDocument);
        else {
            var result = [];
            for (var i = 0; i < paragraphIndices.length; i++) {
                const paragraph = subDocument.paragraphs[paragraphIndices[i]];
                result.push(paragraph.isInList() ? paragraph.getListLevelIndex() : 0);
            }
            if (!continueNumberingList)
                this.assignLevelsIndents(paragraphIndices[0], listIndex, subDocument);
            return result;
        }
    }
    equalLeftIndent(paragraphIndices, layoutPositions, listIndex) {
        if (paragraphIndices.length === 1)
            return true;
        var minLeftIndent = Number.MAX_VALUE;
        var maxLeftIndent = -Number.MAX_VALUE;
        let paragraphIndicesLength = paragraphIndices.length;
        for (let i = 0; i < paragraphIndicesLength; i++) {
            var layoutPosition = layoutPositions[i];
            var startBoxPosX = layoutPosition.row.numberingListBox ? layoutPosition.row.numberingListBox.textBox.x : this.getStartBox(layoutPosition.row.boxes).x;
            var boxLeft = layoutPosition.row.x + startBoxPosX;
            minLeftIndent = Math.min(boxLeft, minLeftIndent);
            maxLeftIndent = Math.max(boxLeft, maxLeftIndent);
        }
        var numberingList = this.control.modelManager.model.numberingLists[listIndex];
        var leftIndent = numberingList.levels[1].getParagraphMergedProperties().leftIndent -
            numberingList.levels[0].getParagraphMergedProperties().leftIndent;
        return maxLeftIndent - minLeftIndent < leftIndent;
    }
    assignLevelsIndentsCore(paragraphIndex, listIndex, listLevels, subDocument) {
        super.assignLevelsIndentsCore(paragraphIndex, listIndex, listLevels, subDocument);
        const isEmptyList = ListUtils.unsafeAnyOf(subDocument.paragraphs, (p) => p.numberingListIndex == listIndex) == null;
        if (isEmptyList) {
            var paragraph = subDocument.paragraphs[paragraphIndex];
            if (paragraph.isInList())
                return;
            for (var i = 0, listLevel; listLevel = listLevels[i]; i++) {
                var listLevelMergedParagraphProperties = listLevel.getParagraphMergedProperties();
                this.history.addAndRedo(new ListLevelOriginalLeftIndentHistoryItem(this.modelManipulator, false, listIndex, i, listLevelMergedParagraphProperties.leftIndent));
                this.history.addAndRedo(new ListLevelParagraphLeftIndentHistoryItem(this.modelManipulator, false, listIndex, i, listLevelMergedParagraphProperties.leftIndent + paragraph.getParagraphMergedProperties().leftIndent, true));
            }
        }
    }
}
