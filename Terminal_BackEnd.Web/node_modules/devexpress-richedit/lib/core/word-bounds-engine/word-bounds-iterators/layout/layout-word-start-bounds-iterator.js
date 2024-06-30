import { LayoutPositionCreatorConflictFlags } from '../../../layout-engine/layout-position-creator';
import { LayoutWordBoundsIterator } from './layout-word-bounds-iterator';
export class LayoutWordStartBoundsIterator extends LayoutWordBoundsIterator {
    constructor(layout, subDocument, selection, startPosition) {
        const firstPagePosition = layout.pages[0].getPosition();
        super(layout, subDocument, selection, firstPagePosition, startPosition);
        if (startPosition <= firstPagePosition) {
            this.startResultPosition = 0;
            this.isInitOk = false;
            return;
        }
        const endPosLastValigPage = subDocument.isMain() ?
            layout.getLastValidPage().getEndPosition() :
            layout.pages[selection.pageIndex].otherPageAreas[subDocument.id].getEndPosition();
        if (startPosition >= endPosLastValigPage) {
            this.startResultPosition = endPosLastValigPage;
            this.isInitOk = false;
        }
    }
    moveIterator() {
        return this.boxIterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
    }
    nextCallsSetCharOffset() {
        this.charOffset--;
        return this.charOffset >= 0;
    }
    setCharacterOffsetOnNextCalls() {
        this.charOffset = this.boxIterator.position.box.getLength() - 1;
    }
    needExcessMoveBoxIterator() {
        return this.boxIterator.position.charOffset != 0;
    }
}
