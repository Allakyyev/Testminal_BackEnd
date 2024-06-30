import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../core/layout/document-layout-details-level';
import { LayoutPoint } from '../core/layout/layout-point';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export class PopupMenuManager {
    constructor(controlOwner, viewManager, measurer, selection) {
        this.rejectNextShowContextMenuId = null;
        this.controlOwner = controlOwner;
        this.viewManager = viewManager;
        this.measurer = measurer;
        this.selection = selection;
    }
    setSelection(selection) {
        this.selection = selection;
    }
    rejectNextShowContextMenu() {
        this.rejectNextShowContextMenuId = setTimeout(() => {
            this.rejectNextShowContextMenuId = null;
        }, 300);
    }
    showByKey() {
        this.controlOwner.showPopupMenu((_contextMenuBar) => {
            const point = this.getContextMenuAbsPoint(this.selection.lastSelectedInterval.start);
            return point ? point : this.undefinedPoint();
        });
    }
    showByMouseClick(point) {
        this.controlOwner.showPopupMenu((contextMenuBar) => {
            if (contextMenuBar.isSpellingMenu) {
                const layoutPoint = this.getContextMenuAbsPoint(this.selection.lastSelectedInterval.start);
                if (layoutPoint)
                    return layoutPoint;
            }
            return point;
        });
    }
    showByTouchClick() {
        if (this.rejectNextShowContextMenuId !== null)
            return;
        this.controlOwner.showPopupMenu((_contextMenuBar) => {
            const point = this.getContextMenuAbsPoint(this.selection.lastSelectedInterval.start);
            return point ? point : this.undefinedPoint();
        });
    }
    undefinedPoint() {
        return new Point(DomUtils.getAbsolutePositionX(this.viewManager.canvas), DomUtils.getAbsolutePositionY(this.viewManager.canvas));
    }
    getContextMenuAbsPoint(lastSelectedIntervalStartPosition) {
        const subDocument = this.selection.activeSubDocument;
        const layoutPosition = subDocument.isMain() ?
            new LayoutPositionMainSubDocumentCreator(this.selection.layout, subDocument, lastSelectedIntervalStartPosition, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true)) :
            new LayoutPositionOtherSubDocumentCreator(this.selection.layout, subDocument, lastSelectedIntervalStartPosition, this.selection.pageIndex, DocumentLayoutDetailsLevel.Box)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        if (!layoutPosition)
            return null;
        const layoutPoint = new LayoutPoint(layoutPosition.pageIndex, layoutPosition.getLayoutX(this.measurer), layoutPosition.getLayoutY(DocumentLayoutDetailsLevel.Row) + layoutPosition.row.height);
        if (this.viewManager.canvasManager.isVisiblePosition(layoutPoint)) {
            const pageElement = this.viewManager.cache[layoutPoint.pageIndex].page;
            return layoutPoint.offset(DomUtils.getAbsolutePositionX(pageElement), DomUtils.getAbsolutePositionY(pageElement));
        }
        return null;
    }
}
