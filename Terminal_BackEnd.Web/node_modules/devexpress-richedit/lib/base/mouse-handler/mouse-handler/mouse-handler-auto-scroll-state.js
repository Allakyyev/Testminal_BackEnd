import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { AutoScrollListener } from '../../canvas/listeners/auto-scroll-listener';
import { MouseHandlerStateBase } from './mouse-handler-state-base';
class Scroller {
    constructor(control) {
        this.timerId = null;
        this.control = control;
    }
    start(offset) {
        this.stop();
        const coeff = Math.exp(IntervalAlgorithms.reflectionOfPointOnInterval(MathUtils.restrictValue(Math.abs(offset), 23, 300), FixedInterval.fromPositions(23, 301), FixedInterval.fromPositions(-2, 1.7)));
        const stepByPixel = (offset > 0 ? Math.max(offset, 23) : Math.min(offset, -23)) * coeff / Scroller.STEPS;
        let currPos = this.control.viewManager.canvasScrollManager.scrollTop;
        this.timerId = setInterval(() => {
            currPos += stepByPixel;
            this.control.viewManager.canvasScrollManager.scrollTop = currPos;
        }, 0);
    }
    stop() {
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }
}
Scroller.STEPS = 8;
export class MouseHandlerAutoScrollState extends MouseHandlerStateBase {
    constructor(handler) {
        super(handler);
        this.scroller = new Scroller(this.handler.control);
    }
    onMouseDoubleClick(_evt) {
    }
    onMouseDown(evt) {
        this.absStartPoint = evt.absolutePoint;
        this.handler.boxVisualizerManager.autoScrollVisualizer.show(Rectangle.fromCenter(evt.absolutePoint, AutoScrollListener.HALF_SIZE));
    }
    onMouseUp(_evt) {
        this.handler.switchToDefaultState();
    }
    onMouseMove(evt) {
        const offset = evt.absolutePoint.y - this.absStartPoint.y;
        if (Math.abs(offset) > AutoScrollListener.HALF_SIZE)
            this.scroller.start(offset + (offset > 0 ? -1 : 1) * AutoScrollListener.HALF_SIZE);
        else
            this.scroller.stop();
    }
    onMouseWheel(_evt) {
    }
    onShortcut(_shortcutCode) {
    }
    finish() {
        this.scroller.stop();
        this.handler.boxVisualizerManager.autoScrollVisualizer.hide();
    }
}
