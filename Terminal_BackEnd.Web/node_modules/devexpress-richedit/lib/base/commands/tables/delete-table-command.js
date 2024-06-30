import { ControlOptions } from '../../../core/model/options/control';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class DeleteTableCommand extends TableCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled()
            && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables)
            && this.selection.tableInfo.extendedData.isSquare;
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        const tableInfo = this.selection.tableInfo;
        this.modelManipulator.table.removeTableWithContent(options.subDocument, tableInfo.table);
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(tableInfo.table.getStartPosition()).setEndOfLine(false)));
        this.history.endTransaction();
        return true;
    }
}
