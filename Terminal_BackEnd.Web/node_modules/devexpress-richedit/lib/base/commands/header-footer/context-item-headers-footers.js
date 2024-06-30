import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ContextItemHeadersFooters extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.control.innerClientProperties.viewsSettings.isPrintLayoutView, false);
        state.visible = this.selection.activeSubDocument.isHeaderFooter();
        return state;
    }
}
