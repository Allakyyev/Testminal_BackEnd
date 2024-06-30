import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class HideFindResultsCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, _parameter) {
        if (this.selection.searchIntervals.length)
            this.selection.resetSearchSelection();
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
