import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class LayoutPageArea extends Rectangle {
    constructor(subDocument) {
        super(0, 0, 0, 0);
        this.columns = [];
        this.subDocument = subDocument;
    }
    getEndPosition() {
        return this.pageOffset + ListUtils.last(this.columns).getEndPosition();
    }
    getLastColumn() {
        return this.columns[this.columns.length - 1];
    }
    deepCopy() {
        const obj = new LayoutPageArea(this.subDocument);
        obj.pageOffset = this.pageOffset;
        obj.columns = ListUtils.map(this.columns, (col) => col.deepCopy());
        obj.copyFrom(this);
        return obj;
    }
}
