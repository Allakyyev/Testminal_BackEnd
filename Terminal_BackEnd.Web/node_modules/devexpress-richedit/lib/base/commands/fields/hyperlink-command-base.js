import { FieldContextMenuHelper } from '../../../core/model/fields/field-context-menu-helper';
import { ControlOptions } from '../../../core/model/options/control';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class HyperlinkCommandBase extends CommandBase {
    getState() {
        var subDocument = this.selection.activeSubDocument;
        var state = new SimpleCommandState(this.isEnabled());
        state.value = FieldContextMenuHelper.showHyperlinkItems(subDocument.fields, this.selection.lastSelectedInterval);
        state.visible = state.value !== null;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.hyperlinks);
    }
}
