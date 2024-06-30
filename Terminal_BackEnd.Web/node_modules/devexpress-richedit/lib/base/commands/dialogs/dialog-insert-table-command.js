import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogInsertTableCommand extends ShowDialogCommandBase {
    createParameters(_options) {
        var parameters = new InsertTableDialogParameters();
        parameters.rowCount = 2;
        parameters.columnCount = 5;
        return parameters;
    }
    applyParameters(_state, params) {
        if (params.rowCount > 0 && params.columnCount > 0) {
            this.control.commandManager.getCommand(RichEditClientCommand.InsertTableCore).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, { rowCount: params.rowCount, cellCount: params.columnCount }));
            return true;
        }
        return false;
    }
    getDialogName() {
        return "InsertTable";
    }
}
export class InsertTableDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.rowCount = obj.rowCount;
        this.columnCount = obj.columnCount;
    }
    clone() {
        const newInstance = new InsertTableDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
