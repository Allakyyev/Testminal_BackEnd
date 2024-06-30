import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ShowQuickSearchPanelCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state) {
        this.control.owner.showQuickSearchPanel();
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
