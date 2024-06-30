import { LayoutBoxIteratorMainSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-main-sub-document';
import { LayoutBoxIteratorOtherSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-other-sub-document';
import { LayoutPositionCreatorConflictFlags } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { SelectionCommandBase } from './selection-command-base';
export class GoToParagraphStartCommandBase extends SelectionCommandBase {
    executeCore(_state, _options) {
        var position = this.getPositionStartParagraph();
        if (position < 0)
            return false;
        var selection = this.selection;
        if (this.extendSelection())
            this.selection.changeState((newState) => newState.extendLastInterval(position).setEndOfLine(false));
        else
            selection.deprecatedSetSelection(position, position, false, selection.keepX, true);
        return true;
    }
    getPositionStartParagraph() {
        const selection = this.selection;
        const layout = this.control.layout;
        const subDocument = this.selection.activeSubDocument;
        var firstPageStartPos = layout.pages[0].getPosition();
        var currentPos = selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
        let boxIterator = subDocument.isMain() ? new LayoutBoxIteratorMainSubDocument(subDocument, layout, firstPageStartPos, currentPos) : new LayoutBoxIteratorOtherSubDocument(subDocument, layout, firstPageStartPos, currentPos, this.selection.pageIndex);
        if (!boxIterator.isInitialized())
            return -1;
        boxIterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        if (boxIterator.position.getLogPosition() ==
            (this.selection.activeSubDocument.isMain() ? layout.getLastValidPage().getEndPosition() : layout.pages[selection.pageIndex].otherPageAreas[subDocument.id].getEndPosition())) {
            if (boxIterator.position.box.getType() == LayoutBoxType.ParagraphMark || boxIterator.position.box.getType() == LayoutBoxType.SectionMark)
                return boxIterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box);
            return boxIterator.position.getLogPosition();
        }
        if (boxIterator.position.charOffset == 0)
            boxIterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        while (boxIterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true))) {
            if (boxIterator.position.box.getType() == LayoutBoxType.ParagraphMark || boxIterator.position.box.getType() == LayoutBoxType.SectionMark) {
                boxIterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
                return boxIterator.position.getLogPosition();
            }
        }
        return firstPageStartPos;
    }
}
export class GoToParagraphStartCommand extends GoToParagraphStartCommandBase {
    extendSelection() {
        return false;
    }
}
export class ExtendGoToParagraphStartCommand extends GoToParagraphStartCommandBase {
    extendSelection() {
        return true;
    }
}
