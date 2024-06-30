import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { HitTestDeviation } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichEditClientCommand } from '../../commands/client-command';
import { HitTestManager } from '../../layout-engine/hit-test-manager/hit-test-manager';
import { ResizeBoxVisualizer } from '../../layout-engine/visualizers/resize-box-visualizer';
import { SetSelectionParams } from '../../selection/set-selection-params';
import { MouseHandlerHelper } from '../mouse-handler/mouse-handler-default-state';
import { TouchHandlerDragFloatingObjectState } from './touch-handler-drag-floating-object-state';
import { TouchHandlerPopupMenuState } from './touch-handler-popup-menu-state';
import { TouchHandlerResizeBoxState } from './touch-handler-resize-box-state';
import { TouchHandlerRotateBoxState } from './touch-handler-rotate-box-state';
import { TouchHandlerChangeActiveSubDocument, TouchHandlerSelectWordUnderCursorState } from './touch-handler-selection-states';
import { TouchHandlerStateBase } from './touch-handler-state-base';
export class TouchHandlerDefaultState extends TouchHandlerStateBase {
    onTouchStart(evt) {
        let activeSubDocument = this.handler.control.selection.activeSubDocument;
        if (this.shouldProcessResizeBoxVisualizer(evt)) {
            if (this.resizeRotationChecker(() => {
                if (activeSubDocument.isTextBox())
                    MouseHandlerHelper.selectParentsTextBox(this.handler.control);
                this.beginResizeBoxTouchHandler(evt);
            }))
                return;
        }
        if (ResizeBoxVisualizer.shouldRotate(evt, this.handler.control)) {
            if (this.resizeRotationChecker(() => {
                if (activeSubDocument.isTextBox())
                    MouseHandlerHelper.selectParentsTextBox(this.handler.control);
                this.handler.switchState(new TouchHandlerRotateBoxState(this.handler));
                this.handler.state.onTouchStart(evt);
            }))
                return;
        }
        var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, activeSubDocument);
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None)
            return;
        if (!ResizeBoxVisualizer.shouldHandleTextBoxAreaClick(evt) && activeSubDocument.isTextBox()) {
            MouseHandlerHelper.changeActiveSubDocumentToParent(this.handler.control);
            htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        }
        if (htr.floatingObject && htr.floatingObject.belongsToSubDocId == this.handler.control.selection.activeSubDocument.id) {
            const box = htr.floatingObject;
            const pos = this.handler.control.layout.anchorObjectsPositionInfo.getPosition(box.objectId);
            const newInterval = new FixedInterval(pos, 1);
            const isObjectAlreadySelected = this.handler.control.selection.intervals.length == 1 && this.handler.control.selection.intervals[0].equals(newInterval);
            this.handler.control.selection.setSelection(new SetSelectionParams().setInterval(newInterval));
            if (box.getType() == LayoutBoxType.AnchorTextBox &&
                HitTestManager.isPointInTexBoxArea(evt.layoutPoint, box, activeSubDocument.isTextBox() ? 0 : box.rotationInRadians)) {
                this.handler.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToTextBox)
                    .execute(this.handler.control.commandManager.isPublicApiCall);
                this.handler.boxVisualizerManager.resizeBoxVisualizer.show(htr.pageIndex, null, null, null, box);
                htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
            }
            else {
                if (this.resizeRotationChecker(() => {
                    if (isObjectAlreadySelected) {
                        this.handler.switchState(new TouchHandlerDragFloatingObjectState(this.handler));
                        this.handler.state.onTouchStart(evt);
                    }
                }))
                    return;
                else {
                    const specRunInfo = this.handler.control.selection.specialRunInfo;
                    if (specRunInfo.isPictureSelected() && specRunInfo.isSelectedAnchorObject) {
                        this.handler.control.selection.setSelection(new SetSelectionParams()
                            .setInterval(new FixedInterval(specRunInfo.getPicturePosition(), 1)));
                        return;
                    }
                }
            }
        }
        if (!this.handler.control.selection.isCollapsed() && (this.isAreaToLeftOfText(htr, evt) || this.isAreaToRightOfText(htr, evt)))
            this.collapseSelection(htr);
        else {
            if (this.handler.control.modelManager.richOptions.fields.openHyperlinkOnClick) {
                const field = this.handler.getHyperlinkFieldResult(evt);
                if (field) {
                    if (!this.handler.control.clientSideEvents.raiseHyperlinkClick(evt.mouseEvent, field))
                        this.handler.control.commandManager.getCommand(RichEditClientCommand.OpenHyperlink).execute(this.handler.control.commandManager.isPublicApiCall, field);
                    return;
                }
            }
            this.handler.switchState(new TouchHandlerPopupMenuState(this.handler));
            this.handler.state.onTouchStart(evt);
        }
    }
    onTouchMove(_evt) {
        return true;
    }
    onDoubleTap(evt) {
        let htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.Box) {
            this.handler.switchState(new TouchHandlerSelectWordUnderCursorState(this.handler, evt));
            this.handler.control.popupMenuManager.rejectNextShowContextMenu();
        }
        else
            this.handler.switchState(new TouchHandlerChangeActiveSubDocument(this.handler, evt.layoutPoint));
    }
    shouldProcessResizeBoxVisualizer(evt) {
        if (this.handler.boxVisualizerManager.resizeBoxVisualizer.shouldCapture(evt) &&
            this.handler.control.selection.activeSubDocument.isEditable([new FixedInterval(this.handler.control.selection.specialRunInfo.getPosition(), 1)])) {
            this.beginResizeBoxTouchHandler(evt);
            return true;
        }
        return false;
    }
    beginResizeBoxTouchHandler(evt) {
        this.handler.switchState(new TouchHandlerResizeBoxState(this.handler));
        this.handler.state.onTouchStart(evt);
    }
    isAreaToLeftOfText(htr, evt) {
        return htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.PageArea &&
            htr.deviations[DocumentLayoutDetailsLevel.Column] & HitTestDeviation.Left &&
            evt.layoutPoint.x <= htr.pageArea.x + htr.column.x;
    }
    isAreaToRightOfText(htr, evt) {
        return htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.PageArea &&
            htr.deviations[DocumentLayoutDetailsLevel.Column] & HitTestDeviation.Right &&
            evt.layoutPoint.x >= htr.pageArea.x + htr.column.x + htr.column.width;
    }
    collapseSelection(htr) {
        var selection = this.handler.control.selection;
        var position = htr.row.getLastVisibleBox().getEndPosition();
        selection.deprecatedSetSelection(position, position, false, -1, true);
    }
}
TouchHandlerDefaultState.TOUCH_RADIUS_HANDLE = 20;
