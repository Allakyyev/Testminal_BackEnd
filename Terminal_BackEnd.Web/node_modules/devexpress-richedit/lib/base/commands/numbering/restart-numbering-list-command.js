import { AddParagraphToListHistoryItem } from '../../../core/model/history/items/numbering-list-history-items';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { IntervalCommandStateEx } from '../command-states';
import { NumberingListCommandBase } from './numbering-list-command-base';
export class RestartNumberingListCommand extends NumberingListCommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        const subDocument = options.subDocument;
        var state = new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(options.intervalsInfo.intervals));
        state.visible = false;
        if (state.enabled) {
            var startParagraphIndex = SearchUtils.normedInterpolationIndexOf(subDocument.paragraphs, p => p.startLogPosition.value, options.intervalsInfo.position);
            var paragraph = subDocument.paragraphs[startParagraphIndex];
            if (paragraph.isInList()) {
                var abstractNumberingListIndex = paragraph.getAbstractNumberingListIndex();
                for (var i = startParagraphIndex - 1, prevParagraph; prevParagraph = subDocument.paragraphs[i]; i--) {
                    if (prevParagraph.getAbstractNumberingListIndex() === abstractNumberingListIndex &&
                        prevParagraph.listLevelIndex === paragraph.listLevelIndex) {
                        state.visible = true;
                        break;
                    }
                }
            }
            state.enabled = state.visible;
        }
        return state;
    }
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        var startParagraphIndex = SearchUtils.normedInterpolationIndexOf(subDocument.paragraphs, paragraph => paragraph.startLogPosition.value, options.intervalsInfo.position);
        this.history.beginTransaction();
        var firstParagraph = subDocument.paragraphs[startParagraphIndex];
        var listType = firstParagraph.getNumberingList().getListType();
        var templateIndex = this.getNumberingListTemplateIndex(listType);
        var newListIndex = this.createNewList(this.control.modelManager.model.abstractNumberingListTemplates[templateIndex]);
        var startParagraphAbstractNumberingListIndex = firstParagraph.getAbstractNumberingListIndex();
        for (var i = startParagraphIndex, paragraph; paragraph = subDocument.paragraphs[i]; i++) {
            if (paragraph.getAbstractNumberingListIndex() === startParagraphAbstractNumberingListIndex)
                this.history.addAndRedo(new AddParagraphToListHistoryItem(this.modelManipulator, subDocument, i, newListIndex, paragraph.getListLevelIndex()));
        }
        this.history.endTransaction();
        return true;
    }
}
