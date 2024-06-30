import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPoint } from '../../../core/layout/layout-point';
import { SelectionCommandBase } from './selection-command-base';
export class GoToPrevPageCommandBase extends SelectionCommandBase {
    getPosition() {
        var selection = this.selection;
        var initPosition = selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
        var layoutPosition = new LayoutPositionMainSubDocumentCreator(this.control.layout, this.selection.activeSubDocument, initPosition, DocumentLayoutDetailsLevel.Box)
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        if (!layoutPosition)
            return -1;
        var charOffset = initPosition - layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Box);
        var x = layoutPosition.pageArea.x + layoutPosition.column.x + layoutPosition.row.x + layoutPosition.box.x + layoutPosition.box.getCharOffsetXInPixels(this.control.measurer, charOffset);
        var y = layoutPosition.pageArea.y + layoutPosition.column.y + layoutPosition.row.y + layoutPosition.box.y;
        var siblingPageIndex = layoutPosition.pageIndex - 1;
        var siblingPage = this.control.layout.pages[siblingPageIndex];
        var position = initPosition;
        if (siblingPage) {
            var point = new LayoutPoint(siblingPageIndex, x, y);
            var htr = this.control.hitTestManager.calculate(point, DocumentLayoutDetailsLevel.Character, this.selection.activeSubDocument);
            if (!this.extendSelection())
                htr.correctAsVisibleBox();
            position = htr.getPosition();
        }
        else
            position = 0;
        return position;
    }
    isEnabled() {
        return super.isEnabled() && this.selection.activeSubDocument.isMain();
    }
}
export class GoToPrevPageCommand extends GoToPrevPageCommandBase {
    executeCore(_state, _options) {
        var selection = this.selection;
        var position = this.getPosition();
        if (position < 0)
            return false;
        selection.deprecatedSetSelection(position, position, selection.endOfLine, selection.keepX, true);
        return true;
    }
    extendSelection() {
        return false;
    }
}
export class ExtendGoToPrevPageCommand extends GoToPrevPageCommandBase {
    executeCore(_state, _options) {
        const position = this.getPosition();
        if (position < 0)
            return false;
        this.selection.changeState((newState) => newState.extendLastInterval(position));
        return true;
    }
    extendSelection() {
        return true;
    }
}
