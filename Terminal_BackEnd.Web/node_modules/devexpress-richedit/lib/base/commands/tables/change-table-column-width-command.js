import { TableCellPreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { TableCellUtils } from '../../../core/model/tables/table-utils';
import { TableUtilsEx } from '../../rich-utils/table-utils-ex';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTableColumnWidthCommand extends CommandBase {
    getState() {
        let state = new SimpleCommandState(true);
        const tableInfo = this.selection.tableInfo;
        state.enabled = this.isEnabled() && tableInfo.extendedData.numRows > 0;
        let width;
        if (state.enabled) {
            const table = tableInfo.table;
            let columnsRange = TableUtilsEx.getColumnsRangeBySelectedCells(tableInfo.extendedData);
            for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
                let cellIndices = TableCellUtils.getCellIndicesByColumnsRange(row, columnsRange);
                for (let i = cellIndices.length - 1; i >= 0; i--) {
                    let cell = table.rows[rowIndex].cells[cellIndices[i]];
                    if (width === undefined)
                        width = cell.preferredWidth.clone();
                    else if (width && width.equals(cell.preferredWidth))
                        continue;
                    else
                        width = null;
                }
            }
        }
        state.value = width;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        const tableInfo = this.selection.tableInfo;
        const table = tableInfo.table;
        let changed = false;
        const columnsRange = TableUtilsEx.getColumnsRangeBySelectedCells(tableInfo.extendedData);
        const subDocument = options.subDocument;
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            let cellIndices = TableCellUtils.getCellIndicesByColumnsRange(row, columnsRange);
            for (let i = cellIndices.length - 1; i >= 0; i--) {
                let cell = table.rows[rowIndex].cells[cellIndices[i]];
                if (!cell.preferredWidth.equals(options.param)) {
                    this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndices[i], options.param.clone()));
                    changed = true;
                }
            }
        }
        return changed;
    }
}
