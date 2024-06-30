import { FindReplaceHelper, FindReplaceState, SearchDirection } from '../../../core/model/find-replace-helper';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ReplaceAllCommandOptions } from './replace-all-command';
export class ReplaceNextCommandOptions extends ReplaceAllCommandOptions {
}
export class ReplaceNextCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, options) {
        const searchSettings = options;
        let findReplaceHelper = new FindReplaceHelper(this.control.modelManager, this.control.layoutFormatterManager, this.control.selection.pageIndex, options.subDocument, this.control.layout, (interval) => {
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals([interval])));
        });
        findReplaceHelper.setSearchParams(searchSettings.text, searchSettings.replaceText, SearchDirection.All, searchSettings.matchCase, false, this.selection.intervals[0].start, false);
        if (findReplaceHelper.findNext() === FindReplaceState.Found) {
            findReplaceHelper.replaceLastFound();
            return true;
        }
        return false;
    }
}
