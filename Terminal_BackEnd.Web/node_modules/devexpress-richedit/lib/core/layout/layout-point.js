import { Point } from '@devexpress/utils/lib/geometry/point';
export class LayoutPoint extends Point {
    constructor(pageIndex, pageX, pageY) {
        super(pageX, pageY);
        this.pageIndex = pageIndex;
    }
    isEmpty() {
        return this.pageIndex == -1;
    }
    static Empty() {
        return new LayoutPoint(-1, -1, -1);
    }
    clone() {
        return new LayoutPoint(this.pageIndex, this.x, this.y);
    }
    get point() {
        return new Point(this.x, this.y);
    }
}
