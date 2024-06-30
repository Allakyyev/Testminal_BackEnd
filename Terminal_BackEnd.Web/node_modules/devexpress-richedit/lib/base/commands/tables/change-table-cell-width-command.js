import { TableCellPreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTableCellWidthCommand extends CommandBase {
    getState() {
        let state = new SimpleCommandState(true);
        const tableInfo = this.selection.tableInfo;
        state.enabled = this.isEnabled() && tableInfo.extendedData.numRows > 0;
        if (state.enabled) {
            const template = tableInfo.table ? tableInfo.extendedData.firstCell.preferredWidth : null;
            if (tableInfo.extendedData.allOfCells((cellInfo) => cellInfo.cell.preferredWidth.equals(template)))
                state.value = template;
        }
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        const tableInfo = this.selection.tableInfo;
        let changed = false;
        tableInfo.extendedData.foreach(() => { }, (cellInfo, rowInfo) => {
            if (!cellInfo.cell.preferredWidth.equals(options.param)) {
                this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, options.subDocument, tableInfo.table.index, rowInfo.rowIndex, cellInfo.cellIndex, options.param.clone()));
                changed = true;
            }
        });
        return changed;
    }
}
