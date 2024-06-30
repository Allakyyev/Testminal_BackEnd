import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class GoToDocumentStartCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, _options) {
        if (this.control.layout.validPageCount < 1)
            this.control.layoutFormatterManager.forceFormatPage(0);
        this.setSelection(this.control.layout.pages[0].getPosition());
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class GoToDocumentStartCommand extends GoToDocumentStartCommandBase {
    setSelection(position) {
        this.selection.deprecatedSetSelection(position, position, false, -1, true);
    }
}
export class ExtendGoToDocumentStartCommand extends GoToDocumentStartCommandBase {
    setSelection(position) {
        this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false));
    }
}
