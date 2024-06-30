import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutWordBounds } from '../../../core/word-bounds-engine/layout-word-bounds';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ExtendGoToPrevCharacterCommand } from './go-to-prev-character-command';
export class GoToPrevWordCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    getStartPosition() {
        var selection = this.selection;
        return (selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start);
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    executeCore(_state, _options) {
        const selection = this.selection;
        const startPos = this.getStartPosition();
        const subDocument = this.selection.activeSubDocument;
        const layout = this.control.layout;
        let position = LayoutWordBounds.getLayoutWordStartBound(layout, subDocument, selection, startPos);
        if (position == startPos) {
            position = LayoutWordBounds.getLayoutWordStartBound(layout, subDocument, selection, position - 1);
        }
        else {
            const leftPosLp = (subDocument.isMain()
                ? new LayoutPositionMainSubDocumentCreator(layout, subDocument, startPos, DocumentLayoutDetailsLevel.Character)
                : new LayoutPositionOtherSubDocumentCreator(layout, subDocument, startPos, selection.pageIndex, DocumentLayoutDetailsLevel.Column))
                .create(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(true));
            const leftPos = leftPosLp.getLogPosition();
            if (position == leftPos) {
                position = LayoutWordBounds.getLayoutWordStartBound(layout, subDocument, selection, leftPos - 1);
            }
        }
        this.setSelection(position);
        return true;
    }
}
export class GoToPrevWordCommand extends GoToPrevWordCommandBase {
    setSelection(position) {
        const selection = this.selection;
        selection.deprecatedSetSelection(position, position, selection.endOfLine, selection.keepX, true);
    }
}
export class ExtendGoToPrevWordCommand extends GoToPrevWordCommandBase {
    setSelection(position) {
        if (!this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false)))
            ExtendGoToPrevCharacterCommand.jumpThroughFieldToLeft(this.selection);
    }
}
