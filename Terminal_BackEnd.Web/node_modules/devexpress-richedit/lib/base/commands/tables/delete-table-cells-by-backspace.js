import { ControlOptions } from '../../../core/model/options/control';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class DeleteTableCellsByBackspaceCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled()
            && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables)
            && (this.selection.tableInfo.extendedData.isSquare || this.selection.tableInfo.extendedData.numRows == 1);
    }
    executeCore(_state, _options) {
        const tableInfo = this.selection.tableInfo;
        if (this.selection.tableInfo.extendedData.isSelectedEntireTable)
            return this.control.commandManager.getCommand(RichEditClientCommand.DeleteTable).execute(this.control.commandManager.isPublicApiCall);
        if (tableInfo.extendedData.numRows == tableInfo.table.rows.length && this.selection.tableInfo.extendedData.isSquare)
            return this.control.commandManager.getCommand(RichEditClientCommand.DeleteTableColumns).execute(this.control.commandManager.isPublicApiCall);
        return this.control.commandManager.getCommand(RichEditClientCommand.ShowDeleteTableCellsForm).execute(this.control.commandManager.isPublicApiCall);
    }
}
