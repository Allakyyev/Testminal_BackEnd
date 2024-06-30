import { AddParagraphToListHistoryItem } from '../../../core/model/history/items/numbering-list-history-items';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { IntervalCommandStateEx } from '../command-states';
import { NumberingListCommandBase } from './numbering-list-command-base';
export class ContinueNumberingListCommand extends NumberingListCommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        const subDocument = options.subDocument;
        var state = new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(this.selection.intervalsInfo.intervals));
        state.visible = false;
        if (state.enabled) {
            var startParagraphIndex = SearchUtils.normedInterpolationIndexOf(subDocument.paragraphs, p => p.startLogPosition.value, state.intervals[0].start);
            var paragraph = subDocument.paragraphs[startParagraphIndex];
            if (paragraph.isInList() && this.getTargetNumberingListIndex(startParagraphIndex, paragraph.getAbstractNumberingListIndex(), subDocument) >= 0)
                state.visible = true;
            state.enabled = state.visible;
        }
        return state;
    }
    executeCore(state, options) {
        const subDocument = options.subDocument;
        var startParagraphIndex = SearchUtils.normedInterpolationIndexOf(options.subDocument.paragraphs, p => p.startLogPosition.value, state.intervals[0].start);
        var startParagraphAbstractNumberingListIndex = subDocument.paragraphs[startParagraphIndex].getAbstractNumberingListIndex();
        var targetNumberingListIndex = this.getTargetNumberingListIndex(startParagraphIndex, startParagraphAbstractNumberingListIndex, subDocument);
        this.history.beginTransaction();
        for (var i = startParagraphIndex, paragraph; paragraph = subDocument.paragraphs[i]; i++) {
            if (paragraph.getAbstractNumberingListIndex() === startParagraphAbstractNumberingListIndex)
                this.history.addAndRedo(new AddParagraphToListHistoryItem(this.modelManipulator, subDocument, i, targetNumberingListIndex, paragraph.getListLevelIndex()));
        }
        this.history.endTransaction();
        return true;
    }
    getTargetNumberingListIndex(startParagraphIndex, currentAbstractNumberingListIndex, subDocument) {
        for (var i = startParagraphIndex - 1, prevParagraph; prevParagraph = subDocument.paragraphs[i]; i--) {
            var prevParagraphAbstractNumberingListIndex = prevParagraph.getAbstractNumberingListIndex();
            if (prevParagraphAbstractNumberingListIndex === currentAbstractNumberingListIndex)
                return -1;
            if (prevParagraphAbstractNumberingListIndex >= 0)
                return prevParagraph.getNumberingListIndex();
        }
        return -1;
    }
}
