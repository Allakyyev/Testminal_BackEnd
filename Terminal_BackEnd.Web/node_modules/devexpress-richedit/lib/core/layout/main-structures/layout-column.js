import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class LayoutColumn extends Rectangle {
    constructor() {
        super(0, 0, 0, 0);
        this.rows = [];
        this.paragraphFrames = [];
        this.tablesInfo = [];
    }
    getEndPosition() {
        return this.pageAreaOffset + ListUtils.last(this.rows).getEndPosition();
    }
    getLastRow() {
        return ListUtils.last(this.rows);
    }
    static findSectionColumnWithMinimumWidth(columnBounds) {
        return ListUtils.min(columnBounds, a => a.width).width;
    }
    deepCopy() {
        const obj = new LayoutColumn();
        obj.pageAreaOffset = this.pageAreaOffset;
        obj.paragraphFrames = ListUtils.shallowCopy(this.paragraphFrames);
        obj.tablesInfo = ListUtils.shallowCopy(this.tablesInfo);
        obj.rows = ListUtils.shallowCopy(this.rows);
        obj.copyFrom(this);
        return obj;
    }
}
export class ParagraphFrame extends Rectangle {
    constructor() {
        super(0, 0, 0, 0);
        this.paragraphColor = 0;
    }
    equals(obj) {
        return super.equals(obj) &&
            this.paragraphColor == obj.paragraphColor;
    }
    clone() {
        const res = new ParagraphFrame();
        res.copyFrom(this);
        res.paragraphColor = this.paragraphColor;
        return res;
    }
}
