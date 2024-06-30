import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Field } from '../../../core/model/fields/field';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { KeyCode, ModifierKey } from '@devexpress/utils/lib/utils/key';
import { RichEditClientCommand } from '../../commands/client-command';
import { MouseButton } from '../../event-manager';
import { CursorPointer } from './mouse-handler';
import { MouseHandlerBeginDragHelperState } from './mouse-handler-begin-drag-helper-state';
import { MouseHandlerStateBase } from './mouse-handler-state-base';
export class MouseHandlerBeginContentDragHelperState extends MouseHandlerBeginDragHelperState {
    constructor(lp, handler, dragState) {
        super(lp, handler, dragState);
        this.resetSelectionOnMouseUp = true;
    }
    onMouseUp(evt) {
        super.onMouseUp(evt);
        if (this.cancelOnRightMouseUp() && evt.button & MouseButton.Right)
            return;
        if (this.resetSelectionOnMouseUp) {
            var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
            htr.correctAsVisibleBox();
            if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None) {
                var selection = this.handler.control.selection;
                var position = htr.getPosition();
                selection.deprecatedSetSelection(position, position, false, -1, true);
            }
        }
    }
}
export class MouseHandlerCancellableDragStateBase extends MouseHandlerStateBase {
    onShortcut(shortcutCode) {
        if (shortcutCode === KeyCode.Esc)
            this.handler.switchToDefaultState();
    }
    calculateHitTest(evt) {
        const htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        htr.correctAsVisibleBox();
        return htr;
    }
    onMouseMove(evt) {
        this.continueDrag(evt);
    }
    onMouseWheel(evt) {
        this.continueDrag(evt);
    }
    onMouseUp(evt) {
        this.commitDrag(evt);
        this.handler.switchToDefaultState();
    }
    continueDrag(_evt) { }
    commitDrag(_evt) { }
}
export class MouseHandlerDragContentState extends MouseHandlerCancellableDragStateBase {
    constructor(handler) {
        super(handler);
        this.allowedToDrag = this.handler.control.commandManager.getCommand(RichEditClientCommand.DragMoveContent).getState().enabled;
    }
    start() {
        let cursorPointer = this.allowedToDrag ? CursorPointer.Default : CursorPointer.NoDrop;
        this.handler.setCursorPointer(cursorPointer);
    }
    finish() {
        this.handler.restoreCursorPointer();
        this.handler.boxVisualizerManager.dragCaretVisualizer.hide();
    }
    continueDrag(evt) {
        if (this.allowedToDrag) {
            var htr = this.calculateHitTest(evt);
            this.handler.boxVisualizerManager.dragCaretVisualizer.show(htr);
        }
    }
    commitDrag(evt) {
        if (this.allowedToDrag) {
            var htr = this.calculateHitTest(evt);
            if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None) {
                var subDocument = this.handler.control.selection.activeSubDocument;
                var interval = new FixedInterval(htr.getPosition(), 0);
                Field.correctIntervalDueToFields(subDocument, interval);
                var commandId = evt.modifiers & ModifierKey.Ctrl ? RichEditClientCommand.DragCopyContent : RichEditClientCommand.DragMoveContent;
                this.handler.control.commandManager.getCommand(commandId).execute(this.handler.control.commandManager.isPublicApiCall, interval.start);
            }
        }
    }
}
