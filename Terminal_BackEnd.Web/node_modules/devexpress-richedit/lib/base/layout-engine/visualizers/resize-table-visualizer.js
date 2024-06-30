import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { BaseVisualizer } from './base-visualizer';
export class ResizeTableVisualizer extends BaseVisualizer {
    init(pageIndex, size) {
        this.pageIndex = pageIndex;
        this.bounds = new Rectangle(0, 0, size.width, size.height);
    }
    show(newPosition) {
        this.bounds.x = newPosition.x;
        this.bounds.y = newPosition.y;
        this.raiseShow();
    }
}
