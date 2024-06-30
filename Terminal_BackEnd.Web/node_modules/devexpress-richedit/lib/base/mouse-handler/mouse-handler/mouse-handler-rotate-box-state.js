import { RotateBoxHelper } from '../rotate-box-helper';
import { MouseHandlerCancellableDragStateBase } from './mouse-handler-drag-content-states';
export class MouseHandlerRotateBoxState extends MouseHandlerCancellableDragStateBase {
    onMouseDown(evt) {
        this.rotateBoxHelper = new RotateBoxHelper(this.handler.control, this.handler.boxVisualizerManager.resizeBoxVisualizer);
        this.rotateBoxHelper.start(evt);
    }
    onMouseMove(evt) {
        this.rotateBoxHelper.move(evt);
    }
    onMouseUp(evt) {
        super.onMouseUp(evt);
        this.rotateBoxHelper.end(evt);
    }
}
