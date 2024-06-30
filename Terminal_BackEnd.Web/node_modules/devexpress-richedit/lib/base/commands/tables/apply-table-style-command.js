import { ApplyTableStyleHistoryItem } from '../../../core/model/history/items/apply-style-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { StylesManager } from '../../../core/model/styles-manager';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class ApplyTableStyleCommand extends TableCommandBase {
    getState() {
        let state = new SimpleCommandState(true, false);
        let tableInfo = this.selection.tableInfo;
        state.enabled = this.isEnabled() && tableInfo.extendedData.numRows > 0;
        let items = [];
        for (let i = 0, style; style = this.control.modelManager.model.tableStyles[i]; i++) {
            if (!style.hidden && !style.semihidden && !style.deleted)
                items.push({ value: style.styleName, text: style.localizedName, data: style.base64EncodedImage });
        }
        for (let i = 0, ts; ts = StylesManager.presetTableStyles[i]; i++) {
            if (!ts.hidden && !ts.semihidden && !ts.deleted && !this.control.modelManager.model.getTableStyleByName(ts.styleName))
                items.push({ value: ts.styleName, text: ts.localizedName, data: ts.base64EncodedImage });
        }
        state.items = items;
        if (state.enabled) {
            const table = tableInfo.table;
            state.value = table.style ? table.style.styleName : null;
        }
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tableStyle);
    }
    executeCore(_state, parameter) {
        this.history.beginTransaction();
        let style = this.control.modelManager.model.getTableStyleByName(parameter.param) ||
            this.control.modelManager.model.stylesManager.addTableStyle(StylesManager.getPresetTableStyleByName(parameter.param).clone());
        const table = this.selection.tableInfo.table;
        this.history.addAndRedo(new ApplyTableStyleHistoryItem(this.modelManipulator, this.selection.activeSubDocument, table.index, style));
        this.history.endTransaction();
        return true;
    }
}
