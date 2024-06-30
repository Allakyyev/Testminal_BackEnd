import { LayoutPositionCreatorConflictFlags } from '../../../layout-engine/layout-position-creator';
import { LayoutWordBoundsIterator } from './layout-word-bounds-iterator';
export class LayoutWordEndBoundsIterator extends LayoutWordBoundsIterator {
    constructor(layout, subDocument, selection, startPosition) {
        const endPosition = subDocument.isMain() ?
            layout.getLastValidPage().getEndPosition() :
            layout.pages[selection.pageIndex].otherPageAreas[subDocument.id].getEndPosition();
        super(layout, subDocument, selection, startPosition, endPosition);
        if (startPosition >= endPosition) {
            this.isInitOk = false;
            this.startResultPosition = endPosition;
        }
    }
    moveIterator() {
        return this.boxIterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
    }
    nextCallsSetCharOffset() {
        this.charOffset++;
        return this.charOffset < this.boxIterator.position.box.getLength();
    }
    setCharacterOffsetOnNextCalls() {
        this.charOffset = this.boxIterator.position.charOffset;
    }
    needExcessMoveBoxIterator() {
        return false;
    }
}
