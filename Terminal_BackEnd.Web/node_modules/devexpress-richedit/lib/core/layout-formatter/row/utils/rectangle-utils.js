import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { NumberUtils } from '../../formatter/utils/number-utils';
export class RectangleUtils {
    static getNonCollapsedIntersection(objA, objB) {
        const inters = Rectangle.getIntersection(objA, objB);
        return inters && !this.isCollapsed(inters) ? inters : null;
    }
    static isCollapsed(rect) {
        return rect.isCollapsed() || NumberUtils.areClose(rect.x, rect.right) || NumberUtils.areClose(rect.y, rect.bottom);
    }
}
