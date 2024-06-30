import { ControlOptions } from '../../../core/model/options/control';
import { RichEditClientCommand } from '../client-command';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogInsertTableCellsCommand extends ShowDialogCommandBase {
    getState() {
        const visible = this.selection.tableInfo.extendedData.numRows > 0;
        let state = new SimpleCommandState(this.isEnabled() && visible);
        state.visible = visible;
        return state;
    }
    createParameters(_options) {
        var parameters = new TableCellsDialogParameters();
        parameters.tableCellOperation = TableCellOperation.ShiftToTheVertically;
        return parameters;
    }
    applyParameters(_state, params) {
        var command = RichEditClientCommand.None;
        switch (params.tableCellOperation) {
            case TableCellOperation.ShiftToTheHorizontally:
                command = RichEditClientCommand.InsertTableCellWithShiftToTheLeft;
                break;
            case TableCellOperation.ShiftToTheVertically:
                command = RichEditClientCommand.InsertTableCellsWithShiftToTheVertically;
                break;
            case TableCellOperation.RowOperation:
                command = RichEditClientCommand.InsertTableRowAbove;
                break;
            case TableCellOperation.ColumnOperation:
                command = RichEditClientCommand.InsertTableColumnToTheLeft;
                break;
        }
        return this.control.commandManager.getCommand(command).execute(this.control.commandManager.isPublicApiCall);
    }
    getDialogName() {
        return "InsertTableCells";
    }
}
export class DialogDeleteTableCellsCommand extends ShowDialogCommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        state.visible = this.selection.tableInfo.extendedData.numRows > 0 && !this.selection.specialRunInfo.isSelected();
        return state;
    }
    isEnabled() {
        return super.isEnabled() &&
            ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) &&
            (this.selection.tableInfo.extendedData.isSquare || this.selection.tableInfo.extendedData.numRows == 1);
    }
    createParameters(_options) {
        var parameters = new TableCellsDialogParameters();
        parameters.tableCellOperation = TableCellOperation.ShiftToTheHorizontally;
        return parameters;
    }
    applyParameters(_state, params) {
        var command = RichEditClientCommand.None;
        switch (params.tableCellOperation) {
            case TableCellOperation.ShiftToTheHorizontally:
                command = RichEditClientCommand.DeleteTableCellsWithShiftToTheHorizontally;
                break;
            case TableCellOperation.ShiftToTheVertically:
                command = RichEditClientCommand.DeleteTableCellsWithShiftToTheVertically;
                break;
            case TableCellOperation.RowOperation:
                command = RichEditClientCommand.DeleteTableRows;
                break;
            case TableCellOperation.ColumnOperation:
                command = RichEditClientCommand.DeleteTableColumns;
                break;
        }
        return this.control.commandManager.getCommand(command).execute(this.control.commandManager.isPublicApiCall);
    }
    getDialogName() {
        return "DeleteTableCells";
    }
}
export class TableCellsDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.tableCellOperation = obj.tableCellOperation;
    }
    clone() {
        const newInstance = new TableCellsDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
export var TableCellOperation;
(function (TableCellOperation) {
    TableCellOperation[TableCellOperation["ShiftToTheHorizontally"] = 0] = "ShiftToTheHorizontally";
    TableCellOperation[TableCellOperation["ShiftToTheVertically"] = 1] = "ShiftToTheVertically";
    TableCellOperation[TableCellOperation["RowOperation"] = 2] = "RowOperation";
    TableCellOperation[TableCellOperation["ColumnOperation"] = 3] = "ColumnOperation";
})(TableCellOperation || (TableCellOperation = {}));
