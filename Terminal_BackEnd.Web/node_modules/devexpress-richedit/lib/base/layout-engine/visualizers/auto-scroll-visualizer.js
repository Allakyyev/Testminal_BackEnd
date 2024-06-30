import { BaseVisualizer } from './base-visualizer';
export class AutoScrollVisualizer extends BaseVisualizer {
    show(absBounds) {
        this.pageIndex = -1;
        this.bounds = absBounds;
        this.tip = null;
        this.isTextBox = false;
        this.rotation = 0;
        this.isAnchoredObject = false;
        this.raiseShow();
    }
}
