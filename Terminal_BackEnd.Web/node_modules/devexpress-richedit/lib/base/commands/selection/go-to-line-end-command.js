import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { SelectionCommandBase } from './selection-command-base';
export class GoToLineEndCommandBase extends SelectionCommandBase {
    executeCore(_state, _options) {
        var endSelection = this.getEndPosition();
        if (endSelection < 0)
            return false;
        this.setSelection(endSelection, -1);
        return true;
    }
    getEndPosition() {
        var selection = this.selection;
        this.endOfLine = true;
        var position = selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
        var subDocument = this.selection.activeSubDocument;
        var layoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, position, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, position, selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (!layoutPosition)
            return -1;
        return this.getEndPositionCore(layoutPosition);
    }
}
export class GoToLineEndCommand extends GoToLineEndCommandBase {
    setSelection(pos, keepX) {
        var selection = this.selection;
        selection.deprecatedSetSelection(pos, pos, this.endOfLine, keepX, true);
    }
    getEndPositionCore(layoutPosition) {
        var lastBoxInRow = layoutPosition.row.getLastVisibleBox();
        if (!lastBoxInRow)
            this.endOfLine = false;
        return layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Row) + (lastBoxInRow ? lastBoxInRow.getEndPosition() : 0);
    }
}
export class ExtendGoToLineEndCommand extends GoToLineEndCommandBase {
    setSelection(pos, keepX) {
        this.selection.changeState((newState) => newState.extendLastInterval(pos).setKeepX(keepX).setEndOfLine(this.endOfLine));
    }
    getEndPositionCore(layoutPosition) {
        return layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Row) + layoutPosition.row.getLastBoxEndPositionInRow();
    }
}
