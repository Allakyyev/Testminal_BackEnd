import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPoint } from '../../../core/layout/layout-point';
import { SelectionCommandBase } from './selection-command-base';
export class GoToNextPageCommandBase extends SelectionCommandBase {
    getPosition() {
        var selection = this.selection;
        var initPosition = selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
        var layoutPosition = new LayoutPositionMainSubDocumentCreator(this.control.layout, this.selection.activeSubDocument, initPosition, DocumentLayoutDetailsLevel.Character)
            .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (!layoutPosition)
            return -1;
        var charOffset = initPosition - layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Box);
        var x = layoutPosition.pageArea.x + layoutPosition.column.x + layoutPosition.row.x + layoutPosition.box.x + layoutPosition.box.getCharOffsetXInPixels(this.control.measurer, charOffset);
        var y = layoutPosition.pageArea.y + layoutPosition.column.y + layoutPosition.row.y + layoutPosition.box.y;
        var siblingPageIndex = layoutPosition.pageIndex + 1;
        var siblingPage = this.control.layoutFormatterManager.forceFormatPage(siblingPageIndex);
        if (siblingPage) {
            var point = new LayoutPoint(siblingPageIndex, x, y);
            var htr = this.control.hitTestManager.calculate(point, DocumentLayoutDetailsLevel.Character, this.selection.activeSubDocument);
            if (!this.extendSelection())
                htr.correctAsVisibleBox();
            return htr.getPosition();
        }
        else
            return this.selection.activeSubDocument.getDocumentEndPosition() - 1;
    }
    isEnabled() {
        return super.isEnabled() && this.selection.activeSubDocument.isMain();
    }
}
export class GoToNextPageCommand extends GoToNextPageCommandBase {
    executeCore(_state, _parameter) {
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
export class ExtendGoToNextPageCommand extends GoToNextPageCommandBase {
    executeCore(_state, _parameter) {
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
