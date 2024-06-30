import { HyperlinkCommandBase } from './hyperlink-command-base';
export class RemoveHyperlinkCommand extends HyperlinkCommandBase {
    executeCore(state, _options) {
        const field = state.value;
        this.modelManipulator.field.removeHyperlink(this.selection.activeSubDocument, field);
        return true;
    }
}
