import { ControlOptions } from '../../../core/model/options/control';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class GoToRecordCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields) &&
            this.control.modelManager.richOptions.mailMerge.isEnabled &&
            this.control.modelManager.richOptions.mailMerge.viewMergedData &&
            this.canNavigate() && this.selection.activeSubDocument.fieldsWaitingForUpdate == null;
    }
    canModify() {
        return true;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return typeof (parameter) === 'number' ? parameter : this.control.modelManager.richOptions.mailMerge.activeRecordIndex;
    }
    executeCore(_state, options) {
        var recordIndex = this.calculateNextRecordIndex(options.param);
        this.control.modelManager.richOptions.mailMerge.activeRecordIndex = recordIndex;
        this.control.commandManager.getCommand(RichEditClientCommand.UpdateAllFields).execute(this.control.commandManager.isPublicApiCall);
        return true;
    }
    canNavigate() {
        return true;
    }
    calculateNextRecordIndex(recordIndex) {
        return Math.min(recordIndex, this.control.modelManager.richOptions.mailMerge.recordCount - 1);
    }
}
export class GoToFirstDataRecordCommand extends GoToRecordCommandBase {
    canNavigate() {
        return this.control.modelManager.richOptions.mailMerge.activeRecordIndex > 0;
    }
    calculateNextRecordIndex(_recordIndex) {
        return 0;
    }
}
export class GoToPreviousDataRecordCommand extends GoToRecordCommandBase {
    canNavigate() {
        return this.control.modelManager.richOptions.mailMerge.activeRecordIndex > 0;
    }
    calculateNextRecordIndex(recordIndex) {
        return recordIndex - 1;
    }
}
export class GoToNextDataRecordCommand extends GoToRecordCommandBase {
    canNavigate() {
        return this.control.modelManager.richOptions.mailMerge.activeRecordIndex < this.control.modelManager.richOptions.mailMerge.recordCount - 1;
    }
    calculateNextRecordIndex(recordIndex) {
        return recordIndex + 1;
    }
}
export class GoToLastDataRecordCommand extends GoToRecordCommandBase {
    canNavigate() {
        return this.control.modelManager.richOptions.mailMerge.activeRecordIndex < this.control.modelManager.richOptions.mailMerge.recordCount - 1;
    }
    calculateNextRecordIndex(_recordIndex) {
        return this.control.modelManager.richOptions.mailMerge.recordCount - 1;
    }
}
