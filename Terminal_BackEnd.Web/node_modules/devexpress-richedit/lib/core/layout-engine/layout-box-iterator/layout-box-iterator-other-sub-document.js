import { DocumentLayoutDetailsLevel } from '../../layout/document-layout-details-level';
import { LayoutPositionOtherSubDocumentCreator } from '../layout-position-creator';
import { LayoutBoxIteratorBase } from './layout-box-iterator-base';
export class LayoutBoxIteratorOtherSubDocument extends LayoutBoxIteratorBase {
    constructor(subDocument, layout, intervalStart, intervalEnd, pageIndex) {
        super(subDocument, layout, intervalStart, intervalEnd);
        this.pageIndex = pageIndex;
    }
    isInitialized() {
        const page = this.layout.pages[this.pageIndex];
        if (!page || page.otherPageAreas[this.subDocument.id].getEndPosition() < this.intervalEnd)
            return false;
        return true;
    }
    getNewLayoutPosition(position, endRowConflictFlags, middleRowConflictFlags) {
        return new LayoutPositionOtherSubDocumentCreator(this.layout, this.subDocument, position, this.pageIndex, DocumentLayoutDetailsLevel.Character)
            .create(endRowConflictFlags, middleRowConflictFlags);
    }
}
