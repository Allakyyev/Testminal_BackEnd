import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutWordBounds } from '../../../core/word-bounds-engine/layout-word-bounds';
import { HitTestDeviation } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichEditClientCommand } from '../../commands/client-command';
import { TouchHandlerDefaultState } from './touch-handler-default-state';
import { TouchHandlerStateBase } from './touch-handler-state-base';
export class TouchHandlerSelectionStateBase extends TouchHandlerStateBase {
    onTouchEnd(evt) {
        this.handler.switchToDefaultState();
        this.setLastLayoutPosition();
        this.captureInputFocus(evt);
        this.showPopupMenu();
    }
}
export class TouchHandlerChangeActiveSubDocument extends TouchHandlerStateBase {
    constructor(handler, point) {
        super(handler);
        let htr = this.handler.control.hitTestManager.calculate(point, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        let activeSubDocument = this.handler.control.selection.activeSubDocument;
        if (activeSubDocument.isMain()) {
            if (htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Top) {
                this.handler.control.commandManager.getCommand(RichEditClientCommand.InsertHeader).execute(this.handler.control.commandManager.isPublicApiCall, htr.pageIndex);
                return;
            }
            else if (htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Bottom) {
                this.handler.control.commandManager.getCommand(RichEditClientCommand.InsertFooter).execute(this.handler.control.commandManager.isPublicApiCall, htr.pageIndex);
                return;
            }
        }
        else if (this.shouldActivateMainArea(activeSubDocument, htr)) {
            this.handler.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain).execute(this.handler.control.commandManager.isPublicApiCall);
        }
        this.handler.switchToDefaultState();
    }
    shouldActivateMainArea(activeSubDocument, htr) {
        return (activeSubDocument.isHeader() && !!(htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Bottom)) ||
            (activeSubDocument.isFooter() && !!(htr.deviations[DocumentLayoutDetailsLevel.PageArea] & HitTestDeviation.Top));
    }
    onTouchStart(evt) {
        this.handler.switchToDefaultState();
        this.handler.state.onTouchStart(evt);
    }
    onDoubleTap(evt) {
        let htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        let activeSubDocument = this.handler.control.selection.activeSubDocument;
        if (this.shouldActivateMainArea(activeSubDocument, htr)) {
            this.handler.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain).execute(this.handler.control.commandManager.isPublicApiCall);
        }
        this.handler.switchToDefaultState();
    }
}
export class TouchHandlerSelectWordUnderCursorState extends TouchHandlerSelectionStateBase {
    constructor(handler, evt) {
        super(handler);
        this.selectWordUnderCursor(evt);
    }
    onTouchStart(evt) {
        this.selectWordUnderCursor(evt);
    }
    onTouchMove(evt) {
        this.selectWordUnderCursor(evt);
        return false;
    }
    selectWordUnderCursor(evt) {
        const activeSubDocument = this.handler.control.selection.activeSubDocument;
        var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None) {
            var position = htr.getRelatedSubDocumentPagePosition() + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.columnOffset + htr.box.rowOffset + htr.charOffset;
            const startInterval = LayoutWordBounds.getLayoutWordStartBound(this.handler.control.layout, activeSubDocument, this.handler.control.selection, position);
            const endInterval = LayoutWordBounds.getLayoutWordEndBound(this.handler.control.layout, activeSubDocument, this.handler.control.selection, position, false);
            if (endInterval > startInterval)
                this.handler.control.selection.deprecatedSetSelection(startInterval, endInterval, false, -1, true);
        }
    }
}
export class TouchHandlerContinueSelectionStateBase extends TouchHandlerSelectionStateBase {
    constructor(handler) {
        super(handler);
    }
    onTouchMove(evt) {
        this.setTouchBarsVisibility(false);
        evt.layoutPoint.y -= TouchHandlerDefaultState.TOUCH_RADIUS_HANDLE;
        var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None)
            this.extendSelection(htr);
        return false;
    }
    setTouchBarsVisibility(visible) {
        this.handler.control.viewManager.selection.touchSelectionCircleElementsManager.setVisibilityTouchBars(visible);
    }
    onTouchEnd(evt) {
        this.handler.control.popupMenuManager.rejectNextShowContextMenu();
        super.onTouchEnd(evt);
        this.setTouchBarsVisibility(true);
        this.setEditableDocumentContent();
    }
    extendSelection(_htr) {
    }
}
export class TouchHandlerContinueSelectionState extends TouchHandlerContinueSelectionStateBase {
    onTouchMove(evt) {
        this.handler.control.viewManager.selection.touchSelectionCircleElementsManager.setVisibilityTouchBars(false);
        evt.layoutPoint.y -= TouchHandlerDefaultState.TOUCH_RADIUS_HANDLE;
        var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None) {
            if (!this.startPosition) {
                this.setLastLayoutPosition();
                this.startPosition = this.lastLayoutPosition;
            }
            this.extendSelection(htr);
        }
        return false;
    }
    onTouchEnd(evt) {
        this.captureInputFocus(evt);
        this.setLastLayoutPosition();
        if (!this.startPosition)
            this.startPosition = this.lastLayoutPosition;
        if (this.startPosition.equals(this.lastLayoutPosition))
            this.showPopupMenu();
        this.handler.switchToDefaultState();
        this.handler.control.viewManager.selection.touchSelectionCircleElementsManager.setVisibilityTouchBars(true);
        this.setEditableDocumentContent();
    }
    extendSelection(htr) {
        let position = this.getLayoutPosition(htr);
        let endOfLine = position === (htr.pageArea.subDocument.isMain() ? htr.page.getPosition() : 0)
            + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.getEndPosition();
        this.handler.control.selection.deprecatedSetSelection(position, position, endOfLine, -1, false);
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
}
export class TouchHandlerContinueSelectionOnOneSideState extends TouchHandlerContinueSelectionStateBase {
    constructor(handler, isDragLeftEdge = true) {
        super(handler);
        this.isDragLeftEdge = false;
        this.isDragLeftEdge = isDragLeftEdge;
    }
    extendSelection(htr) {
        this.extendLastSelectionOnOneSide(Math.min(htr.getPosition(), htr.subDocument.getDocumentEndPosition() - 1), this.isDragLeftEdge);
    }
    extendLastSelectionOnOneSide(end, isDragLeftEdge) {
        const selection = this.handler.control.selection;
        const lastInterval = selection.intervalsInfo.interval;
        let newInterval = null;
        const forwardDirection = end >= selection.anchorPosition;
        if (isDragLeftEdge) {
            if (end < lastInterval.end)
                newInterval = new FixedInterval(end, lastInterval.length - (end - lastInterval.start));
        }
        else {
            if ((end - lastInterval.start) >= 1)
                newInterval = new FixedInterval(lastInterval.start, end - lastInterval.start);
        }
        if (newInterval && (selection.endOfLine != false || !lastInterval.equals(newInterval)))
            selection.changeState((newState) => newState.setInterval(newInterval).setForwardDirection(forwardDirection).setEndOfLine(false));
    }
    setTouchBarsVisibility(visible) {
        if (this.isDragLeftEdge)
            this.handler.control.viewManager.selection.touchSelectionCircleElementsManager.setFirstTouchBarVisibility(visible);
        else
            this.handler.control.viewManager.selection.touchSelectionCircleElementsManager.setSecondTouchBarVisibility(visible);
    }
}
