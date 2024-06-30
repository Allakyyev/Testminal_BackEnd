import { MouseButton } from '../../event-manager';
import { MouseHandlerStateBase } from './mouse-handler-state-base';
export class MouseHandlerBeginDragHelperState extends MouseHandlerStateBase {
    constructor(lp, handler, dragState) {
        super(handler);
        this.dragState = dragState;
        this.startPoint = lp.clone();
    }
    start() {
        var _a;
        this.handler.control.inputPositionModelChangesListener.beginUpdate();
        (_a = this.handler.control.barHolder.ribbon) === null || _a === void 0 ? void 0 : _a.beginUpdate();
        this.handler.control.barHolder.publicUiChangesListener.beginUpdate();
        this.handler.control.horizontalRulerControl.beginUpdate();
    }
    finish() {
        var _a;
        this.handler.control.inputPositionModelChangesListener.endUpdate();
        (_a = this.handler.control.barHolder.ribbon) === null || _a === void 0 ? void 0 : _a.endUpdate();
        this.handler.control.barHolder.publicUiChangesListener.endUpdate();
        this.handler.control.horizontalRulerControl.endUpdate();
        this.handler.control.barHolder.updateItemsState();
        this.handler.control.horizontalRulerControl.update();
    }
    cancelOnRightMouseUp() { return true; }
    onMouseWheel(evt) {
        this.handler.switchState(this.dragState);
        this.dragState.onMouseWheel(evt);
    }
    onMouseMove(evt) {
        if (!evt.layoutPoint.equals(this.startPoint)) {
            this.handler.switchState(this.dragState);
            this.dragState.onMouseMove(evt);
        }
    }
    onMouseUp(evt) {
        if (evt.button == MouseButton.Left || (this.cancelOnRightMouseUp() && evt.button & MouseButton.Right)) {
            this.handler.switchToDefaultState();
            this.handler.onMouseUp(evt);
        }
    }
}
