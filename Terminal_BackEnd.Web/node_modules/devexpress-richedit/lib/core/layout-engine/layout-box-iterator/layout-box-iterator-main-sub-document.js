import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { DocumentLayoutDetailsLevel } from '../../layout/document-layout-details-level';
import { LayoutPositionMainSubDocumentCreator } from '../layout-position-creator';
import { LayoutBoxIteratorBase } from './layout-box-iterator-base';
import { LayoutPositionAdvanceBackwardHelper } from './layout-position-advance-helpers/backward-helper';
import { LayoutPositionAdvanceForwardHelper } from './layout-position-advance-helpers/forward-helper';
export class LayoutBoxIteratorMainSubDocument extends LayoutBoxIteratorBase {
    constructor(subDocument, layout, intervalStart, intervalEnd) {
        super(subDocument, layout, intervalStart, intervalEnd);
    }
    isInitialized() {
        if (!this.layout.isFullyFormatted) {
            const lastValidPage = this.layout.getLastValidPage();
            if (!lastValidPage || this.intervalEnd > ListUtils.last(lastValidPage.getContentIntervals()).end)
                return false;
        }
        return true;
    }
    getNewLayoutPosition(position, endRowConflictFlags, middleRowConflictFlags) {
        return new LayoutPositionMainSubDocumentCreator(this.layout, this.subDocument, position, DocumentLayoutDetailsLevel.Character)
            .create(endRowConflictFlags, middleRowConflictFlags);
    }
    advancePosition() {
        return new LayoutPositionAdvanceForwardHelper(this.position, this.layout).advance();
    }
    advancePositionBack() {
        return new LayoutPositionAdvanceBackwardHelper(this.position, this.layout).advance();
    }
}
