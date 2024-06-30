import { ControlOptions } from '../../../core/model/options/control';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ToggleViewMergedDataCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.value = this.control.modelManager.richOptions.mailMerge.viewMergedData;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields) &&
            this.control.modelManager.richOptions.mailMerge.isEnabled;
    }
    canModify() {
        return true;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        const mailMergeOptions = this.control.modelManager.richOptions.mailMerge;
        return typeof parameter === 'boolean' ? parameter : !mailMergeOptions.viewMergedData;
    }
    executeCore(_state, options) {
        var mailMergeOptions = this.control.modelManager.richOptions.mailMerge;
        let viewMergedData = options.param;
        if (mailMergeOptions.viewMergedData !== viewMergedData) {
            mailMergeOptions.viewMergedData = viewMergedData;
            this.control.commandManager.getCommand(RichEditClientCommand.UpdateAllFields).execute(this.control.commandManager.isPublicApiCall);
            return true;
        }
        return false;
    }
}
