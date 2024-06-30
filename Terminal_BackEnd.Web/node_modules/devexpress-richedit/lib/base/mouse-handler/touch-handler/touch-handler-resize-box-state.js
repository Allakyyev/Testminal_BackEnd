import { ResizeBoxHelper } from '../resize-box-helper';
import { TouchHandlerStateBase } from './touch-handler-state-base';
export class TouchHandlerResizeBoxState extends TouchHandlerStateBase {
    start() {
        this.resizeBoxHelper = new ResizeBoxHelper(this.handler.control, this.handler.boxVisualizerManager.resizeBoxVisualizer);
    }
    onTouchStart(evt) {
        this.resizeBoxHelper.start(evt);
    }
    onTouchMove(evt) {
        this.resizeBoxHelper.move(evt);
        return false;
    }
    onTouchEnd(evt) {
        this.resizeBoxHelper.end(evt);
        this.handler.switchToDefaultState();
    }
}
