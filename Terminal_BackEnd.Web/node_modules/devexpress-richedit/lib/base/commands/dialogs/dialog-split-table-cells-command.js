import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogSplitTableCellsCommand extends ShowDialogCommandBase {
    getState() {
        const enabled = this.selection.tableInfo.rawData.isSquare &&
            !this.selection.specialRunInfo.isPictureSelected();
        let state = new SimpleCommandState(this.isEnabled() && enabled);
        state.visible = enabled;
        return state;
    }
    createParameters(_options) {
        const tableInfo = this.selection.tableInfo;
        const parameters = new SplitTableCellsDialogParameters();
        parameters.rowCount = tableInfo.rawData.numRows;
        parameters.columnCount = tableInfo.rawData.rows[0].columnCountInSeries;
        parameters.isMergeBeforeSplit = tableInfo.rawData.numRows > 1 || tableInfo.rawData.rows[0].cells.length > 1;
        parameters.disableRowsSelector = !tableInfo.extendedData.isSquare;
        parameters.availableRowNumber = parameters.disableRowsSelector ?
            1 :
            tableInfo.rawData.numRows;
        return parameters;
    }
    applyParameters(_state, params) {
        return this.control.commandManager.getCommand(RichEditClientCommand.SplitTableCellsCommand)
            .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, params));
    }
    getDialogName() {
        return "SplitTableCells";
    }
}
export class SplitTableCellsDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.rowCount = obj.rowCount;
        this.columnCount = obj.columnCount;
        this.isMergeBeforeSplit = obj.isMergeBeforeSplit;
    }
    clone() {
        const newInstance = new SplitTableCellsDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
