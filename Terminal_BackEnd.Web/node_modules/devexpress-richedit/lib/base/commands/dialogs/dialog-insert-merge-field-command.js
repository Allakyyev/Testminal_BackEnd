import { ControlOptions } from '../../../core/model/options/control';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogInsertMergeFieldCommand extends ShowDialogCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields) &&
            this.control.modelManager.richOptions.mailMerge.allowInsertFields;
    }
    createParameters(_options) {
        return new InsertMergeFieldDialogParameters();
    }
    applyParameters(_state, params) {
        if (params.fieldName != null) {
            this.control.commandManager.getCommand(RichEditClientCommand.CreateMergeField).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, params.fieldName));
            return true;
        }
        return false;
    }
    getDialogName() {
        return "InsertMergeField";
    }
    isModal() {
        return false;
    }
}
export class InsertMergeFieldDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.fieldName = obj.fieldName;
    }
    clone() {
        const newInstance = new InsertMergeFieldDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
