import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { LayoutAnchorObjectFinder } from '../../../core/layout-engine/layout-anchor-object-finder';
import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { LayoutChangeType } from '../../../core/layout-formatter/changes/changes/layout-change-base';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutBoxType } from '../../../core/layout/main-structures/layout-boxes/layout-box';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { FrameBaseListener } from '../../canvas/listeners/frame-base-listener';
import { ReadOnlyMode } from '../../interfaces/i-rich-edit-core';
import { MouseEventSource } from '../../mouse-handler/mouse-event-source';
import { BaseVisualizer } from './base-visualizer';
import { RendererClassNames } from '../../../core/canvas/renderer-class-names';
export class ResizeBoxVisualizer extends BaseVisualizer {
    NotifySelectionChanged(selection) {
        if (selection.specialRunInfo.isSelected())
            this.setBox();
        else if (this.initBounds)
            this.hide();
    }
    NotifyScrollPositionChanged() { }
    NotifyFullyFormatted(_pageCount) { }
    ;
    NotifyPagesReady(pageChanges) {
        const specRunInfo = this.control.selection.specialRunInfo;
        if (!specRunInfo.isSelected())
            return;
        const subDoc = specRunInfo.getParentSubDocument();
        const pos = specRunInfo.getPosition();
        if (subDoc.isMain()) {
            if (ListUtils.unsafeAnyOf(pageChanges, (pageChange) => pageChange.changeType == LayoutChangeType.Deleted ? null : new LayoutAnchorObjectFinder(this.control.layout, pos, subDoc.id, pageChange.index).obj ||
                ListUtils.unsafeAnyOf(this.control.layout.pages[pageChange.index].getContentIntervals(), (interval) => interval.contains(pos) ? pageChange : null)))
                this.setBox();
        }
        else {
            if (ListUtils.unsafeAnyOf(pageChanges, (pageChange) => pageChange.changeType == LayoutChangeType.Deleted ? null :
                NumberMapUtils.containsBy(this.control.layout.pages[pageChange.index].otherPageAreas, (pageArea) => pageArea.subDocument.id == subDoc.id)))
                this.setBox();
        }
    }
    setBox() {
        const specRunInfo = this.control.selection.specialRunInfo;
        const pos = specRunInfo.getPosition();
        if (specRunInfo.isSelectedAnchorObject) {
            const parentSubDoc = specRunInfo.getParentSubDocument();
            const finder = new LayoutAnchorObjectFinder(this.control.layout, pos, parentSubDoc.id, parentSubDoc.isHeaderFooter() ? this.control.selection.pageIndex : undefined);
            if (finder.obj)
                this.show(finder.page.index, null, null, null, finder.obj);
            return;
        }
        const subDocument = this.control.selection.activeSubDocument;
        const layoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, pos, DocumentLayoutDetailsLevel.Box)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, pos, this.control.selection.pageIndex, DocumentLayoutDetailsLevel.Box))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (layoutPosition)
            this.show(layoutPosition.pageIndex, layoutPosition.pageArea, layoutPosition.column, layoutPosition.row, layoutPosition.box);
    }
    reset() {
        this.initBounds = null;
        super.reset();
    }
    show(pageIndex, pageArea, column, row, box) {
        this.pageIndex = pageIndex;
        this.tip = box.hyperlinkTip;
        const boxType = box.getType();
        this.isTextBox = boxType == LayoutBoxType.AnchorTextBox;
        this.isAnchoredObject = boxType == LayoutBoxType.AnchorPicture || boxType == LayoutBoxType.AnchorTextBox;
        this.initBounds = new Rectangle(0, 0, 0, 0);
        if (this.isAnchoredObject) {
            this.initBounds.copyFrom(box);
            this.rotation = boxType == LayoutBoxType.AnchorTextBox && this.control.selection.activeSubDocument.isTextBox() ? 0 :
                box.rotationInRadians;
        }
        else {
            const boxY = Math.max(0, row.baseLine - box.getAscent());
            this.initBounds
                .setPosition(new Point(pageArea.x + column.x + row.x + box.x, pageArea.y + column.y + row.y + boxY))
                .setSize(box);
            this.rotation = 0;
        }
        this.recalculate(null, null, null);
    }
    showAtPos(pageIndex, position) {
        this.pageIndex = pageIndex;
        this.initBounds.x = position.x;
        this.initBounds.y = position.y;
        this.recalculate(null, null, null);
    }
    recalculate(size, positionDelta, newRotation) {
        this.bounds = size != null ?
            new Rectangle(this.initBounds.x + positionDelta.width, this.initBounds.y + positionDelta.height, size.width, size.height) :
            this.initBounds.createRectangle();
        if (newRotation != null)
            this.rotation = newRotation;
        this.raiseShow();
    }
    isResizeBoxVisible() {
        return !!this.bounds;
    }
    shouldCapture(evt) {
        return !this.control.isReadOnlyPersistent && !!ResizeBoxVisualizer.shouldCaptureEvents[evt.source];
    }
    static shouldRotate(evt, control) {
        return control.readOnly != ReadOnlyMode.Persistent &&
            ResizeBoxVisualizer.isEventSourceHasClassName(evt, FrameBaseListener.CLASSNAMES.ROTATION_BOX) &&
            control.selection.activeSubDocument.isEditable([new FixedInterval(control.selection.specialRunInfo.getPosition(), 1)]);
    }
    static shouldHandleTextBoxAreaClick(evt) {
        return ResizeBoxVisualizer.isEventSourceHasClassName(evt, FrameBaseListener.CLASSNAMES.TEXTBOX_AREA) ||
            ResizeBoxVisualizer.isEventSourceHasClassName(evt, RendererClassNames.SELECTED_TEXTBOX);
    }
    static isEventSourceHasClassName(evt, className) {
        let element = EvtUtils.getEventSource(evt.mouseEvent);
        while (element) {
            if (element.className.indexOf(className) > -1)
                return true;
            if (element.className.indexOf(RendererClassNames.PAGES) > -1)
                return false;
            element = element.parentElement;
        }
        return false;
    }
}
ResizeBoxVisualizer.shouldCaptureEvents = {
    [MouseEventSource.ResizeBox_E]: true,
    [MouseEventSource.ResizeBox_N]: true,
    [MouseEventSource.ResizeBox_NE]: true,
    [MouseEventSource.ResizeBox_NW]: true,
    [MouseEventSource.ResizeBox_S]: true,
    [MouseEventSource.ResizeBox_SE]: true,
    [MouseEventSource.ResizeBox_SW]: true,
    [MouseEventSource.ResizeBox_W]: true,
};
