import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { IntervalCommandStateEx } from '../command-states';
import { NumberingListCommandBase } from './numbering-list-command-base';
export class DeleteNumerationFromParagraphsCommand extends NumberingListCommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        return new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(options.intervalsInfo.intervals));
    }
    executeCore(_state, options) {
        var paragraphIndices = options.subDocument.getParagraphIndicesByIntervals(options.intervalsInfo.intervals);
        this.history.beginTransaction();
        this.deleteNumberingList(paragraphIndices, options.subDocument);
        this.history.endTransaction();
        return true;
    }
    getNumberingListType() {
        return null;
    }
}
