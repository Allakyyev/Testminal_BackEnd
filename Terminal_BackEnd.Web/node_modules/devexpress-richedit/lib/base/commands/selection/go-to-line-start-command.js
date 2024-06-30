import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { SelectionCommandBase } from './selection-command-base';
export class GoToLineStartCommandBase extends SelectionCommandBase {
    getStartPosition() {
        var selection = this.selection;
        var position = selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
        var subDocument = this.selection.activeSubDocument;
        var layoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, position, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, position, selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(true));
        if (!layoutPosition)
            return -1;
        return layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Row);
    }
}
export class GoToLineStartCommand extends GoToLineStartCommandBase {
    executeCore(_state, _options) {
        var pos = this.getStartPosition();
        if (pos < 0)
            return false;
        this.selection.deprecatedSetSelection(pos, pos, false, -1, true);
        return true;
    }
}
export class ExtendGoToLineStartCommand extends GoToLineStartCommandBase {
    executeCore(_state, _options) {
        const pos = this.getStartPosition();
        if (pos < 0)
            return false;
        this.selection.changeState((newState) => newState.extendLastInterval(pos).resetKeepX().setEndOfLine(false));
        return true;
    }
}
