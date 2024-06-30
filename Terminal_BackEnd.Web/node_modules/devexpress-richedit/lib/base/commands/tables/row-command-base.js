import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CommandBase } from '../command-base';
export class RowCommandBase extends CommandBase {
    canModify() {
        const tableInfo = this.control.selection.tableInfo;
        const table = tableInfo.table;
        return table != null && (this.control.isClientMode() ?
            ListUtils.allOf(tableInfo.rawData.rows, rowInfo => {
                const row = tableInfo.table.rows[rowInfo.rowIndex];
                return this.control.selection.activeSubDocument.isEditable([FixedInterval.fromPositions(row.getStartPosition(), row.getEndPosition())]);
            }) : this.control.selection.activeSubDocument.isEditable([FixedInterval.fromPositions(table.getStartPosition(), table.getEndPosition())]));
    }
}
