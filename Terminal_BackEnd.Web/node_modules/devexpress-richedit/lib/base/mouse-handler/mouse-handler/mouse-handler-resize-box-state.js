import { ResizeBoxHelper } from '../resize-box-helper';
import { CursorPointer } from './mouse-handler';
import { MouseHandlerCancellableDragStateBase } from './mouse-handler-drag-content-states';
export class MouseHandlerResizeBoxState extends MouseHandlerCancellableDragStateBase {
    start() {
        this.resizeBoxHelper = new ResizeBoxHelper(this.handler.control, this.handler.boxVisualizerManager.resizeBoxVisualizer);
    }
    onMouseDown(evt) {
        this.resizeBoxHelper.start(evt);
        this.setCursor();
    }
    onMouseMove(evt) {
        this.resizeBoxHelper.move(evt);
    }
    onMouseUp(evt) {
        super.onMouseUp(evt);
        this.resizeBoxHelper.end(evt);
    }
    setCursor() {
        if (this.resizeBoxHelper.lockH)
            this.handler.setCursorPointer(CursorPointer.SResize);
        else if (this.resizeBoxHelper.lockV)
            this.handler.setCursorPointer(CursorPointer.WResize);
        else if (this.resizeBoxHelper.sideH && this.resizeBoxHelper.sideV)
            this.handler.setCursorPointer(CursorPointer.SEResize);
        else if (this.resizeBoxHelper.sideH && !this.resizeBoxHelper.sideV)
            this.handler.setCursorPointer(CursorPointer.NEResize);
        else if (!this.resizeBoxHelper.sideH && this.resizeBoxHelper.sideV)
            this.handler.setCursorPointer(CursorPointer.SWResize);
        else if (!this.resizeBoxHelper.sideH && !this.resizeBoxHelper.sideV)
            this.handler.setCursorPointer(CursorPointer.NWResize);
    }
    finish() {
        this.handler.setCursorPointer(CursorPointer.Auto);
    }
}
