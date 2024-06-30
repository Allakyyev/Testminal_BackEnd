import { RotateBoxHelper } from '../rotate-box-helper';
import { TouchHandlerStateBase } from './touch-handler-state-base';
export class TouchHandlerRotateBoxState extends TouchHandlerStateBase {
    onTouchStart(evt) {
        this.rotateBoxHelper = new RotateBoxHelper(this.handler.control, this.handler.boxVisualizerManager.resizeBoxVisualizer);
        this.rotateBoxHelper.start(evt);
    }
    onTouchMove(evt) {
        this.rotateBoxHelper.move(evt);
        return false;
    }
    onTouchEnd(evt) {
        this.rotateBoxHelper.end(evt);
        this.handler.switchToDefaultState();
    }
}
