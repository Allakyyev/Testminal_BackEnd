import { TableRowHeightHistoryItem } from '../../../core/model/history/items/tables/table-row-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTableRowHeightCommand extends CommandBase {
    getState() {
        const tableInfo = this.selection.tableInfo;
        const state = new SimpleCommandState(true);
        state.enabled = this.isEnabled() && tableInfo.extendedData.numRows > 0;
        if (state.enabled) {
            const templateHeight = tableInfo.table ? tableInfo.extendedData.rows[0].row.height : undefined;
            if (ListUtils.allOf(tableInfo.extendedData.rows, (rowInfo) => rowInfo.row.height.equals(templateHeight), 1))
                state.value = templateHeight;
        }
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        const tableInfo = this.selection.tableInfo;
        const table = tableInfo.table;
        let changed = false;
        this.history.beginTransaction();
        ListUtils.forEach(tableInfo.extendedData.rows, (rowInfo) => {
            if (!table.rows[rowInfo.rowIndex].height.equals(options.param)) {
                this.history.addAndRedo(new TableRowHeightHistoryItem(this.modelManipulator, options.subDocument, table.index, rowInfo.rowIndex, options.param.clone()));
                changed = true;
            }
        });
        this.history.endTransaction();
        return changed;
    }
}
