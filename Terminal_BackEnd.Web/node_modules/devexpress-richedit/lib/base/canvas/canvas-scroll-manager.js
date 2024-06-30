import { DocumentLayoutDetailsLevel } from '../../core/layout/document-layout-details-level';
import { MouseHandler } from '../mouse-handler/mouse-handler/mouse-handler';
import { RelativePosition } from '../scroll/model-states';
export class CanvasScrollManager {
    constructor(viewManager, horizontalRuler) {
        this.updateScrollTimeoutId = null;
        this.waitForDblClickTimeoutId = null;
        this.viewManager = viewManager;
        this.horizontalRuler = horizontalRuler;
    }
    get canvas() { return this.viewManager.canvas; }
    get sizes() { return this.viewManager.sizes; }
    dispose() {
        clearTimeout(this.updateScrollTimeoutId);
        clearTimeout(this.waitForDblClickTimeoutId);
    }
    get scrollTop() { return this.canvas.scrollTop; }
    set scrollTop(val) { this.canvas.scrollTop = val; }
    setScrollEnabled(enabled) {
        if (enabled)
            this.canvas.style.overflow = "";
        else
            this.canvas.style.overflow = "hidden";
        this.updateScrollVisibility();
    }
    updateScrollVisibility() {
        if (!this.scrollMeasurer) {
            this.scrollMeasurer = document.createElement("div");
            this.scrollMeasurer.style.position = "absolute";
            this.scrollMeasurer.style.top = "0";
            this.scrollMeasurer.style.bottom = "0";
            this.scrollMeasurer.style.right = "0";
            this.scrollMeasurer.style.left = "0";
        }
        this.canvas.appendChild(this.scrollMeasurer);
        const prevScrollYVisibility = this.sizes.scrollYVisible;
        this.sizes.updateScrollVisibility(this.scrollMeasurer.offsetWidth, this.scrollMeasurer.offsetHeight);
        this.canvas.removeChild(this.scrollMeasurer);
        if (prevScrollYVisibility !== this.sizes.scrollYVisible && this.horizontalRuler)
            this.horizontalRuler.adjust();
    }
    scrollToX(canvasState) {
        const position = canvasState.lp;
        const relativePosition = canvasState.relativePosition;
        let y = this.sizes.getPageOffsetY(this.viewManager.layout.pages[position.pageIndex]);
        let height = 0;
        if (position.detailsLevel >= DocumentLayoutDetailsLevel.PageArea) {
            y += position.pageArea.y;
            if (position.detailsLevel >= DocumentLayoutDetailsLevel.Column) {
                y += position.column.y;
                if (position.detailsLevel >= DocumentLayoutDetailsLevel.Row) {
                    y += position.row.y;
                    if (relativePosition === RelativePosition.Bottom)
                        y += position.row.height;
                    else if (relativePosition === RelativePosition.Inside)
                        height = position.row.height;
                }
                else if (relativePosition === RelativePosition.Bottom)
                    y += position.column.height;
                else if (relativePosition === RelativePosition.Inside)
                    height = position.column.height;
            }
            else if (relativePosition === RelativePosition.Bottom)
                y += position.pageArea.height;
            else if (relativePosition === RelativePosition.Inside)
                height = position.pageArea.height;
        }
        else if (relativePosition === RelativePosition.Bottom)
            y += position.page.height;
        else if (relativePosition === RelativePosition.Inside)
            height = position.page.height;
        if (relativePosition === RelativePosition.Bottom)
            y -= this.sizes.getVisibleAreaHeight(false);
        y += canvasState.getVerticalOffset(this.sizes);
        if (relativePosition === RelativePosition.Inside) {
            let scrollTop = this.canvas.scrollTop;
            const scrollVisibleAreaHeight = this.sizes.getVisibleAreaHeight(false);
            if (y < scrollTop)
                this.canvas.scrollTop = y;
            else if (y + height > scrollVisibleAreaHeight + scrollTop)
                this.canvas.scrollTop = y + height - scrollVisibleAreaHeight;
        }
        else
            this.canvas.scrollTop = y;
    }
    NotifyScrollPositionChanged(canvasState) {
        if (this.updateScrollTimeoutId) {
            clearTimeout(this.updateScrollTimeoutId);
            this.updateScrollTimeoutId = null;
        }
        if (this.waitForDblClickTimeoutId > 0) {
            this.updateScrollTimeoutId = setTimeout(() => {
                this.scrollToX(canvasState);
            }, MouseHandler.WAIT_FOR_DBLCLICK_INTERVAL);
        }
        else
            this.scrollToX(canvasState);
    }
    waitForDblClick() {
        if (this.waitForDblClickTimeoutId)
            clearTimeout(this.waitForDblClickTimeoutId);
        this.waitForDblClickTimeoutId = setTimeout(() => {
            this.waitForDblClickTimeoutId = null;
        }, MouseHandler.WAIT_FOR_DBLCLICK_INTERVAL);
    }
}
