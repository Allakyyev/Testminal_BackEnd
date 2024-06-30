import { FindReplaceHelper, SearchDirection } from '../../../core/model/find-replace-helper';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ReplaceAllCommandOptions extends CommandOptions {
    constructor(control, text, replaceText, matchCase) {
        super(control);
        this.text = text;
        this.replaceText = replaceText;
        this.matchCase = matchCase;
    }
}
export class ReplaceAllCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, options) {
        const searchSettings = options;
        let findReplaceHelper = new FindReplaceHelper(this.control.modelManager, this.control.layoutFormatterManager, this.selection.pageIndex, options.subDocument, this.control.layout, (interval) => {
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals([interval])));
        });
        findReplaceHelper.setSearchParams(searchSettings.text, searchSettings.replaceText, SearchDirection.All, searchSettings.matchCase, false, 0, false);
        findReplaceHelper.replaceAll(this.selection.lastSelectedInterval.start);
        return true;
    }
}
