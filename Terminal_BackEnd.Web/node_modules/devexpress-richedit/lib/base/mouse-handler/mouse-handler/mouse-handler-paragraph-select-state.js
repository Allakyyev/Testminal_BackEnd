import { SetSelectionParams } from '../../selection/set-selection-params';
import { MouseHandlerStateBase } from './mouse-handler-state-base';
export class MouseHandlerParagraphSelectState extends MouseHandlerStateBase {
    constructor(handler, evt, startSelectedWordInterval) {
        super(handler);
        this.layoutPoint = evt.layoutPoint;
        this.startSelectedWordInterval = startSelectedWordInterval;
        this.timerId = setTimeout(() => {
            this.handler.switchToDefaultState();
            this.timerId = null;
        }, MouseHandlerParagraphSelectState.TIMEOUT);
    }
    dispose() {
        super.dispose();
        clearTimeout(this.timerId);
    }
    onMouseDoubleClick(evt) {
        this.handler.switchToDefaultState();
        this.handler.state.onMouseDoubleClick(evt);
    }
    onMouseDown(evt) {
        if (evt.layoutPoint.equals(this.layoutPoint)) {
            this.handler.control.selection.setSelection(new SetSelectionParams()
                .setInterval(this.handler.control.selection.activeSubDocument.getParagraphByPosition(this.startSelectedWordInterval).interval));
            this.handler.switchToDefaultState();
        }
        else {
            this.handler.switchToDefaultState();
            this.handler.state.onMouseDown(evt);
        }
    }
    onMouseUp(evt) {
        this.handler.switchToDefaultState();
        this.handler.state.onMouseUp(evt);
    }
    onMouseMove(evt) {
        this.handler.switchToDefaultState();
        this.handler.state.onMouseMove(evt);
    }
    onMouseWheel(evt) {
        this.handler.switchToDefaultState();
        this.handler.state.onMouseWheel(evt);
    }
    onShortcut(shortcutCode) {
        this.handler.switchToDefaultState();
        this.handler.state.onShortcut(shortcutCode);
    }
    finish() {
        if (this.timerId !== null)
            clearTimeout(this.timerId);
    }
}
MouseHandlerParagraphSelectState.TIMEOUT = 450;
