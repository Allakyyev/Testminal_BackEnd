import { RichUtils } from '../../../core/model/rich-utils';
import { RichEditClientCommand } from '../client-command';
import { CommandBase, CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertSpaceCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo = this.selection.intervalsInfo.clone();
    }
    executeCore(_state, options) {
        return this.control.commandManager.getCommand(RichEditClientCommand.InsertText).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, RichUtils.specialCharacters.Space).setIntervalsInfo(options.intervalsInfo));
    }
}
export class InsertNonBreakingSpaceCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo = this.selection.intervalsInfo.clone();
    }
    executeCore(_state, options) {
        return this.control.commandManager.getCommand(RichEditClientCommand.InsertText).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, RichUtils.specialCharacters.NonBreakingSpace).setIntervalsInfo(options.intervalsInfo));
    }
}
