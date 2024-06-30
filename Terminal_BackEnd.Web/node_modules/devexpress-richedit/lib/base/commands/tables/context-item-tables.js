import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ContextItemTables extends CommandBase {
    getState() {
        let state = new SimpleCommandState(true, false);
        state.visible = this.selection.tableInfo.extendedData.numRows > 0 &&
            (this.selection.activeSubDocument.isTextBox() || !this.selection.specialRunInfo.isSelected());
        return state;
    }
    executeCore(_state, _options) {
        return false;
    }
}
