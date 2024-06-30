import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPosition } from '../../../core/layout/layout-position';
export class HitTestResult extends LayoutPosition {
    constructor(subDocument) {
        super(DocumentLayoutDetailsLevel.None);
        this.subDocument = null;
        this.deviations = {};
        this.subDocument = subDocument;
    }
    correctAsVisibleBox() {
        if (!this.box || this.box.isVisible())
            return;
        this.deviations[DocumentLayoutDetailsLevel.Box] = undefined;
        this.exactlyDetailLevel = Math.min(this.exactlyDetailLevel, DocumentLayoutDetailsLevel.Row);
        const boxIndex = this.row.getLastVisibleBoxIndex();
        this.boxIndex = Math.max(0, boxIndex);
        this.box = this.row.boxes[this.boxIndex];
        this.charOffset = boxIndex < 0 ? 0 : this.box.getLength();
    }
    getPosition() {
        var result = 0;
        if (this.page && this.subDocument.isMain())
            result += this.page.getPosition();
        if (this.pageArea)
            result += this.pageArea.pageOffset;
        if (this.column)
            result += this.column.pageAreaOffset;
        if (this.row)
            result += this.row.columnOffset;
        if (this.box)
            result += this.box.rowOffset;
        if (this.charOffset >= 0)
            result += this.charOffset;
        return result;
    }
}
