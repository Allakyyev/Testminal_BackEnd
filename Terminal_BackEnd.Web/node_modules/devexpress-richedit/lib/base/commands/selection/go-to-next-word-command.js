import { LayoutWordBounds } from '../../../core/word-bounds-engine/layout-word-bounds';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ExtendGoToNextCharacterCommand } from './go-to-next-character-command';
export class GoToNextWordCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    getStartPosition() {
        var selection = this.selection;
        return selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class GoToNextWordCommand extends GoToNextWordCommandBase {
    executeCore(_state, _options) {
        const selection = this.selection;
        const subDocument = this.selection.activeSubDocument;
        let position = LayoutWordBounds.getLayoutWordEndBound(this.control.layout, subDocument, selection, this.getStartPosition(), true);
        if (position == subDocument.getDocumentEndPosition())
            position--;
        selection.deprecatedSetSelection(position, position, false, selection.keepX, true);
        return true;
    }
}
export class ExtendGoToNextWordCommand extends GoToNextWordCommandBase {
    executeCore(_state, _options) {
        const position = LayoutWordBounds.getLayoutWordEndBound(this.control.layout, this.selection.activeSubDocument, this.selection, this.getStartPosition(), true);
        if (!this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false)))
            ExtendGoToNextCharacterCommand.jumpThroughFieldToRight(this.selection);
        return true;
    }
}
