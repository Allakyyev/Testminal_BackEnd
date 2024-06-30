import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
export class TableCommandBase extends CommandBase {
    isEnabled() {
        const table = this.control.selection.tableInfo.table;
        return super.isEnabled() && table != null &&
            this.control.selection.activeSubDocument.isEditable([FixedInterval.fromPositions(table.getStartPosition(), table.getEndPosition())]);
    }
}
