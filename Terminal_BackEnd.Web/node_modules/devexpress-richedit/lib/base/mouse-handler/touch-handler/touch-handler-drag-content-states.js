import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Field } from '../../../core/model/fields/field';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichEditClientCommand } from '../../commands/client-command';
import { TouchHandlerStateBase } from './touch-handler-state-base';
export class TouchHandlerDragContentState extends TouchHandlerStateBase {
    constructor(handler) {
        super(handler);
    }
    finish() {
        this.handler.boxVisualizerManager.dragCaretVisualizer.hide();
    }
    onTouchMove(evt) {
        this.continueDrag(evt);
        return false;
    }
    onTouchEnd(evt) {
        this.commitDrag(evt);
        this.handler.switchToDefaultState();
    }
    continueDrag(evt) {
        var htr = this.calculateHitTest(evt);
        if (htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Character)
            this.handler.boxVisualizerManager.dragCaretVisualizer.show(htr);
    }
    commitDrag(evt) {
        var htr = this.calculateHitTest(evt);
        if (htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Character) {
            var subDocument = this.handler.control.selection.activeSubDocument;
            var interval = new FixedInterval(htr.getPosition(), 0);
            Field.correctIntervalDueToFields(subDocument, interval);
            var commandId = RichEditClientCommand.DragMoveContent;
            this.handler.control.commandManager.getCommand(commandId).execute(this.handler.control.commandManager.isPublicApiCall, interval.start);
        }
    }
    calculateHitTest(evt) {
        const htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None)
            htr.correctAsVisibleBox();
        return htr;
    }
}
