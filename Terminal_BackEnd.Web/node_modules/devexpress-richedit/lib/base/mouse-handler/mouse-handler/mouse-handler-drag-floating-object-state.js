import { KeyCode } from '@devexpress/utils/lib/utils/key';
import { DragFloatingObjectsHelper } from '../drag-floating-objects-helper';
import { MouseHandlerCancellableDragStateBase } from './mouse-handler-drag-content-states';
export class MouseHandlerDragFloatingObjectState extends MouseHandlerCancellableDragStateBase {
    constructor(handler, evt) {
        super(handler);
        this.dragFloatingObjectsHelper = new DragFloatingObjectsHelper(this.handler.control, this.handler.boxVisualizerManager.resizeBoxVisualizer);
        this.dragFloatingObjectsHelper.start(evt);
    }
    onMouseMove(evt) {
        this.dragFloatingObjectsHelper.move(evt);
    }
    commitDrag(evt) {
        this.dragFloatingObjectsHelper.end(evt);
    }
    onShortcut(shortcutCode) {
        if (shortcutCode === KeyCode.Esc)
            this.dragFloatingObjectsHelper.rollback();
        super.onShortcut(shortcutCode);
    }
}
