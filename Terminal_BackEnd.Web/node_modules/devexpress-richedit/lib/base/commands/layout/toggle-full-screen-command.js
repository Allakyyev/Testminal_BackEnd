import { ControlOptions } from '../../../core/model/options/control';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ToggleFullScreenCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.value = this.control.owner.isInFullScreenMode;
        return state;
    }
    executeCore(_state, options) {
        if (options.param == this.control.owner.isInFullScreenMode)
            return false;
        this.control.owner.toggleFullScreenMode();
        return true;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fullScreen);
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
