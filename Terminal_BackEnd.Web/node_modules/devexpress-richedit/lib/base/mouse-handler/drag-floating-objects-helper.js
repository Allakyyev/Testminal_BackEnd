import { LayoutAnchorObjectFinder } from '../../core/layout-engine/layout-anchor-object-finder';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { RichEditClientCommand } from '../commands/client-command';
import { FloatingObjectDragDropChangePositionCommandParameters } from '../commands/floating-objects/floating-object-drag-drop-change-position-command';
export class DragFloatingObjectsHelper {
    constructor(control, resizeBoxVisualizer) {
        this.control = control;
        this.resizeBoxVisualizer = resizeBoxVisualizer;
    }
    start(evt) {
        const layout = this.control.layout;
        this.startPoint = Point.plus(evt.absolutePoint, evt.scroll);
        this.startLayoutPoint = evt.layoutPoint;
        this.startPageIndex = evt.layoutPoint.pageIndex;
        this.pageIndex = this.startPageIndex;
        this.box = layout.pages[this.startPageIndex].anchoredObjectHolder.getObjectByModelPosition(layout, this.control.selection.specialRunInfo.getPosition(), this.control.selection.activeSubDocument.id);
        this.boxPoint = new Point(this.box.x, this.box.y);
        this.clickBoxDistance = Point.minus(this.startLayoutPoint, this.boxPoint);
    }
    move(evt) {
        this.pageIndex = evt.layoutPoint.pageIndex;
        const newPoint = Point.minus(evt.layoutPoint, this.clickBoxDistance);
        this.resizeBoxVisualizer.showAtPos(this.pageIndex, newPoint);
    }
    end(evt) {
        const delta = this.getDelta(evt);
        if (delta.isZero() || !evt.layoutPoint)
            return;
        let endPageIndex = evt.layoutPoint.pageIndex;
        const newPosition = Point.minus(evt.layoutPoint, this.clickBoxDistance);
        const args = new FloatingObjectDragDropChangePositionCommandParameters(this.control, this.startPageIndex, endPageIndex, newPosition, evt.layoutPoint.point);
        this.control.commandManager.getCommand(RichEditClientCommand.FloatingObjectDragDropChangePosition)
            .execute(this.control.commandManager.isPublicApiCall, args);
        let finder;
        while (true) {
            finder = new LayoutAnchorObjectFinder(this.control.layout, this.control.selection.specialRunInfo.getPosition(), this.control.selection.activeSubDocument.id);
            if (finder.page)
                break;
            else
                this.control.layoutFormatterManager.forceFormatPage(this.control.layout.validPageCount);
        }
        this.resizeBoxVisualizer.show(finder.page.index, null, null, null, finder.obj);
    }
    rollback() {
        this.resizeBoxVisualizer.showAtPos(this.startPageIndex, this.boxPoint);
        this.control.modelManager.history.endTransaction();
    }
    getDelta(evt) {
        return Point.minus(Point.plus(evt.absolutePoint, evt.scroll), this.startPoint);
    }
}
