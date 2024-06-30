import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { TouchHandlerDefaultState } from './touch-handler-default-state';
import { TouchHandlerContinueSelectionOnOneSideState, TouchHandlerContinueSelectionState } from './touch-handler-selection-states';
import { TouchHandlerStateBase } from './touch-handler-state-base';
import { TouchHandlerBeginTapProcessingState } from './touch-handler-waiting-states';
export class TouchHandlerPopupMenuState extends TouchHandlerStateBase {
    onTouchStart(evt) {
        let leftOrRightEdge = false;
        for (let i = 0, interval; interval = this.handler.control.selection.intervals[i]; i++) {
            if (this.isLeftOrRightEdge(evt.layoutPoint, interval)) {
                leftOrRightEdge = true;
                break;
            }
        }
        if (!leftOrRightEdge || !this.handler.control.focusManager.isInFocus)
            this.handler.switchState(this.getNextState(evt));
    }
    onTouchMove(evt) {
        this.handler.switchState(this.getNextState(evt));
        return false;
    }
    onTouchEnd(_evt) {
        this.showPopupMenu();
        this.handler.switchToDefaultState();
    }
    getNextState(evt) {
        var lpStart = this.getLayoutPosition(this.handler.control.selection.intervals[0].start);
        if (this.canExtendSelection(evt.layoutPoint, lpStart))
            return new TouchHandlerContinueSelectionState(this.handler);
        for (let i = 0, interval; interval = this.handler.control.selection.intervals[i]; i++) {
            if (this.canExtendSelectionOnOneSide(evt.layoutPoint, interval))
                return new TouchHandlerContinueSelectionOnOneSideState(this.handler, this.isHitPoints(evt.layoutPoint, lpStart.getPositionRelativePage(this.handler.control.measurer), lpStart.row.height));
        }
        return new TouchHandlerBeginTapProcessingState(this.handler, evt);
    }
    canExtendSelection(mousePoint, lpStart) {
        return this.handler.control.focusManager.isInFocus &&
            this.handler.control.selection.isCollapsed() &&
            this.isHitPoints(mousePoint, lpStart.getPositionRelativePage(this.handler.control.measurer), lpStart.row.height);
    }
    canExtendSelectionOnOneSide(mousePoint, selectionInterval) {
        return this.handler.control.focusManager.isInFocus && this.isLeftOrRightEdge(mousePoint, selectionInterval);
    }
    getLayoutPosition(logPosition) {
        var subDocument = this.handler.control.selection.activeSubDocument;
        return subDocument.isMain()
            ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.handler.control.layoutFormatterManager, subDocument, logPosition, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(this.handler.control.selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false))
            : new LayoutPositionOtherSubDocumentCreator(this.handler.control.layout, subDocument, logPosition, this.handler.control.selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(this.handler.control.selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
    }
    isLeftOrRightEdge(mousePoint, selectionInterval) {
        var lpStart = this.getLayoutPosition(selectionInterval.start);
        var lpEnd = this.getLayoutPosition(selectionInterval.end);
        return this.isHitPoints(mousePoint, lpStart.getPositionRelativePage(this.handler.control.measurer), lpStart.row.height) ||
            this.isHitPoints(mousePoint, lpEnd.getPositionRelativePage(this.handler.control.measurer), lpEnd.row.height);
    }
    isHitPoints(mousePoint, selectionPoint, height) {
        var hitX = Math.abs(mousePoint.x - selectionPoint.x) < TouchHandlerDefaultState.TOUCH_RADIUS_HANDLE;
        var hitY = false;
        if (mousePoint.y < selectionPoint.y)
            hitY = Math.abs(mousePoint.y - selectionPoint.y) < TouchHandlerDefaultState.TOUCH_RADIUS_HANDLE;
        else
            hitY = (mousePoint.y - selectionPoint.y) < (TouchHandlerDefaultState.TOUCH_RADIUS_HANDLE + height);
        return hitX && hitY;
    }
}
