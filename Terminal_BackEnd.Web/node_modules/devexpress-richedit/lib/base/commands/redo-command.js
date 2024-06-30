import { ControlOptions } from '../../core/model/options/control';
import { CommandBase } from './command-base';
import { SimpleCommandState } from './command-states';
export class RedoCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled() && this.history.canRedo());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.undo);
    }
    executeCore(state, _options) {
        if (state.enabled) {
            this.history.redo();
            return true;
        }
        return false;
    }
    canModify() {
        return true;
    }
}
