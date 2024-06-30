import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPictureBox } from '../../../core/layout/main-structures/layout-boxes/layout-picture-box';
import { HitTestDeviation } from '@devexpress/utils/lib/geometry/rectangle';
import { TouchHandlerDragContentState } from './touch-handler-drag-content-states';
import { TouchHandlerSelectWordUnderCursorState } from './touch-handler-selection-states';
import { TouchHandlerBeginDragHelperState, TouchHandlerStateBase } from './touch-handler-state-base';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class TouchHandlerWaitingStateBase extends TouchHandlerStateBase {
    constructor(handler, interval, action) {
        super(handler);
        this.action = action;
        this.timerID = setTimeout(() => {
            this.timerID = -1;
            this.action();
        }, interval);
    }
    dispose() {
        super.dispose();
        clearTimeout(this.timerID);
    }
    onTouchEnd(_evt) {
        this.finish();
    }
    onTouchMove(_evt) {
        this.finish();
        this.handler.switchToDefaultState();
        return true;
    }
    finish() {
        if (this.timerID != -1)
            clearTimeout(this.timerID);
    }
    handleTap(evt) {
        var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None && this.shouldSelectPicture(htr))
            this.selectImage(htr);
        else if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None) {
            this.setLastLayoutPosition();
            var position = this.getLayoutPosition(htr);
            if (this.shouldChangeSelection(position)) {
                var endOfLine = position === (htr.pageArea.subDocument.isMain() ? htr.page.getPosition() : 0)
                    + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.getEndPosition();
                this.handler.control.selection.deprecatedSetSelection(position, position, endOfLine, -1, true);
            }
            this.setEditableDocumentContent();
            this.captureInputFocus(evt);
            this.handler.control.viewManager.selection.touchSelectionCircleElementsManager.setVisibilityTouchBars(true);
        }
    }
    getLayoutPosition(htr) {
        var position = (htr.pageArea.subDocument.isMain() ? htr.page.getPosition() : 0) + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.columnOffset;
        if (htr.deviations[DocumentLayoutDetailsLevel.Row] & HitTestDeviation.Right) {
            var lastVisibleBoxInRow = htr.row.getLastVisibleBox();
            if (lastVisibleBoxInRow)
                position += lastVisibleBoxInRow.getEndPosition();
        }
        else {
            position += htr.box.rowOffset + htr.charOffset;
            if (htr.boxIndex == htr.row.boxes.length - 1 && htr.charOffset == htr.box.getLength() && !htr.box.isVisible())
                position -= 1;
        }
        return position;
    }
    shouldChangeSelection(_position) {
        return true;
    }
    shouldSelectPicture(htr) {
        if (htr.exactlyDetailLevel < DocumentLayoutDetailsLevel.Box)
            return false;
        return htr.box instanceof LayoutPictureBox;
    }
    selectImage(htr) {
        var position = htr.getPosition() - htr.charOffset;
        var selection = this.handler.control.selection;
        selection.deprecatedSetSelection(position, position + 1, false, -1, true);
        this.handler.control.viewManager.selection.touchSelectionCircleElementsManager.setVisibilityTouchBars(false);
    }
    beginDragExistingSelection() {
        var dragState = new TouchHandlerDragContentState(this.handler);
        var state = new TouchHandlerBeginDragHelperState(this.handler, dragState);
        this.handler.switchState(state);
    }
}
export class TouchHandlerBeginTapProcessingState extends TouchHandlerWaitingStateBase {
    constructor(handler, evt) {
        super(handler, 500, () => {
            if (this.handler.boxVisualizerManager.resizeBoxVisualizer.isResizeBoxVisible())
                this.beginDragExistingSelection();
            else
                handler.switchState(new TouchHandlerBeginWaitForLongTapState(handler, evt));
        });
    }
    onTouchStart(evt) {
        this.finish();
        this.handler.switchState(new TouchHandlerSelectWordUnderCursorState(this.handler, evt));
    }
    onTouchEnd(evt) {
        this.handleTap(evt);
        this.finish();
        this.handler.switchToDefaultState();
    }
}
export class TouchHandlerBeginWaitForLongTapState extends TouchHandlerWaitingStateBase {
    constructor(handler, evt) {
        super(handler, 100, () => {
            this.handleTap(evt);
            this.showPopupMenu();
            this.finish();
            this.handler.switchToDefaultState();
        });
    }
    shouldChangeSelection(position) {
        return !ListUtils.anyOf(this.handler.control.selection.intervals, (currVal, _index) => {
            return currVal.contains(position);
        });
    }
}
