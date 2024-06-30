import { ModelScrollManager } from '../../scroll/model-scroll-manager';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class SelectAllDocumentCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, _options) {
        if (!this.control.layout.isFullyFormatted)
            this.control.layoutFormatterManager.formatSyncAllDocument();
        this.selection.deprecatedSetSelection(0, this.selection.activeSubDocument.getDocumentEndPosition(), true, -1, true, true, true, ModelScrollManager.DontChangeScrollPosition);
        this.control.focusManager.captureFocus();
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
