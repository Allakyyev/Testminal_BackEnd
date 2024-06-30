import { AbstractNumberingList, NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { IntervalCommandStateEx } from '../command-states';
import { NumberingListCommandBaseBase } from './numbering-list-command-base';
export class InsertNumerationToParagraphsCommand extends NumberingListCommandBaseBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        return new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(options.intervalsInfo.intervals));
    }
    executeCore(_state, options) {
        this.abstractNumberingList = options.param;
        const paragraphIndices = options.subDocument.getParagraphIndicesByIntervals(options.intervalsInfo.intervals);
        this.history.beginTransaction();
        this.insertNumeration(options.param, options.subDocument, paragraphIndices);
        this.history.endTransaction();
        return true;
    }
    insertNumeration(numberingList, subDocument, paragraphIndices) {
        const paragraphsLayoutPositions = this.getParagraphsLayoutPositions(paragraphIndices, subDocument);
        let targetListIndex;
        if (numberingList instanceof AbstractNumberingList) {
            if (numberingList.getListType() == NumberingType.MultiLevel) {
                this.changeNumberingList(paragraphIndices, subDocument);
                return;
            }
            else {
                targetListIndex = this.createNewList(numberingList);
            }
        }
        else
            targetListIndex = this.control.modelManager.model.numberingLists.indexOf(numberingList);
        let paragraphsLevelIndices = this.getParagraphsLevelIndices(paragraphIndices, paragraphsLayoutPositions, false, targetListIndex, -1, subDocument);
        this.insertNumberingListCore(paragraphIndices, targetListIndex, paragraphsLevelIndices, paragraphsLayoutPositions, subDocument);
    }
    getNumberingListType() {
        return this.abstractNumberingList.getListType();
    }
}
