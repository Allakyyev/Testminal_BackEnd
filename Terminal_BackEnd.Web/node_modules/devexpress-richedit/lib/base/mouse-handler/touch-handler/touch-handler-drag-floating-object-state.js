import { DragFloatingObjectsHelper } from '../drag-floating-objects-helper';
import { TouchHandlerStateBase } from './touch-handler-state-base';
export class TouchHandlerDragFloatingObjectState extends TouchHandlerStateBase {
    onTouchStart(evt) {
        this.dragFloatingObjectsHelper = new DragFloatingObjectsHelper(this.handler.control, this.handler.boxVisualizerManager.resizeBoxVisualizer);
        this.dragFloatingObjectsHelper.start(evt);
    }
    onTouchMove(evt) {
        this.dragFloatingObjectsHelper.move(evt);
        return false;
    }
    onTouchEnd(evt) {
        this.dragFloatingObjectsHelper.end(evt);
        this.handler.switchToDefaultState();
    }
}
