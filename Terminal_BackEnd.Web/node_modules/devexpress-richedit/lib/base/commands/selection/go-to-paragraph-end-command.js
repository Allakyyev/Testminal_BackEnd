import { LayoutBoxIteratorMainSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-main-sub-document';
import { LayoutBoxIteratorOtherSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-other-sub-document';
import { LayoutPositionCreatorConflictFlags } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { SelectionCommandBase } from './selection-command-base';
export class GoToParagraphEndCommandBase extends SelectionCommandBase {
    executeCore(_state, _options) {
        var selection = this.selection;
        var position = this.getPositionEndParagraph();
        if (position < 0)
            return false;
        if (this.extendSelection())
            this.selection.changeState((newState) => newState.extendLastInterval(position).setEndOfLine(false));
        else
            selection.deprecatedSetSelection(position, position, false, selection.keepX, true);
        return true;
    }
    getPositionEndParagraph() {
        var selection = this.selection;
        const subDocument = this.selection.activeSubDocument;
        var layout = this.control.layout;
        const lastPageEndPos = subDocument.isMain() ? layout.getLastValidPage().getEndPosition() : layout.pages[selection.pageIndex].otherPageAreas[subDocument.id].getEndPosition();
        var currentPos = selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
        const boxIterator = subDocument.isMain() ? new LayoutBoxIteratorMainSubDocument(subDocument, layout, currentPos, lastPageEndPos) :
            new LayoutBoxIteratorOtherSubDocument(subDocument, layout, currentPos, lastPageEndPos, this.selection.pageIndex);
        if (!boxIterator.isInitialized())
            return -1;
        while (boxIterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true))) {
            if (boxIterator.position.box.getType() == LayoutBoxType.ParagraphMark || boxIterator.position.box.getType() == LayoutBoxType.SectionMark) {
                boxIterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
                if (boxIterator.position.getLogPosition() == lastPageEndPos)
                    return boxIterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box);
                return boxIterator.position.getLogPosition();
            }
        }
        if (boxIterator.position.box.getType() == LayoutBoxType.ParagraphMark || boxIterator.position.box.getType() == LayoutBoxType.SectionMark)
            return boxIterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box);
        return boxIterator.position.getLogPosition();
    }
}
export class GoToParagraphEndCommand extends GoToParagraphEndCommandBase {
    extendSelection() {
        return false;
    }
}
export class ExtendGoToParagraphEndCommand extends GoToParagraphEndCommandBase {
    extendSelection() {
        return true;
    }
}
