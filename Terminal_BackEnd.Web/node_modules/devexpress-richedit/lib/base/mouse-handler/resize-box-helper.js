import { LayoutAnchorObjectFinder } from '../../core/layout-engine/layout-anchor-object-finder';
import { RunType } from '../../core/model/runs/run-type';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { RichEditClientCommand } from '../commands/client-command';
import { CommandOptions } from '../commands/command-base';
import { MouseEventSource } from './mouse-event-source';
export class ResizeBoxHelper {
    constructor(control, resizeBoxVisualizer) {
        this.control = control;
        this.resizeBoxVisualizer = resizeBoxVisualizer;
    }
    start(evt) {
        const specialRunInfo = this.control.selection.specialRunInfo;
        let pos = specialRunInfo.getPosition();
        const run = this.control.selection.activeSubDocument.getRunByPosition(pos);
        if (specialRunInfo.isSelectedAnchorObject) {
            const parentSubDoc = specialRunInfo.getParentSubDocument();
            const finder = new LayoutAnchorObjectFinder(this.control.layout, pos, parentSubDoc.id, parentSubDoc.isHeaderFooter() ? this.control.selection.pageIndex : undefined);
            this.startSize = new Size(finder.obj.width, finder.obj.height);
        }
        else
            this.startSize = Size.initByCommonAction(adp => UnitConverter.twipsToPixelsF(adp(run.size.actualSize)));
        this.lockAspectRatio = run.size.lockAspectRatio;
        this.rotation = UnitConverter.twipsToDegrees(run.size.rotation) * Math.PI / 180;
        this.startX = evt.absolutePoint.x;
        this.startY = evt.absolutePoint.y;
        this.startScrollLeft = evt.scroll.x;
        this.startScrollTop = evt.scroll.y;
        this.lockH = evt.source == MouseEventSource.ResizeBox_S || evt.source == MouseEventSource.ResizeBox_N;
        this.lockV = evt.source == MouseEventSource.ResizeBox_E || evt.source == MouseEventSource.ResizeBox_W;
        this.sideH = evt.source == MouseEventSource.ResizeBox_E || evt.source == MouseEventSource.ResizeBox_NE || evt.source == MouseEventSource.ResizeBox_SE;
        this.sideV = evt.source == MouseEventSource.ResizeBox_SE || evt.source == MouseEventSource.ResizeBox_S || evt.source == MouseEventSource.ResizeBox_SW;
    }
    move(evt) {
        this.size = this.getSize(evt);
        this.positionDelta = this.getPositionDelta(this.size);
        this.resizeBoxVisualizer.recalculate(this.size, this.positionDelta, null);
    }
    end(evt) {
        let run = this.control.selection.activeSubDocument.getRunByPosition(this.control.selection.specialRunInfo.getPosition());
        if (!this.size) {
            this.size = this.getSize(evt);
            this.positionDelta = this.getPositionDelta(this.size);
        }
        if (run.getType() == RunType.InlinePictureRun) {
            let changeInlinePictureScaleCommand = this.control.commandManager.getCommand(RichEditClientCommand.ChangeInlinePictureScale);
            let originalSize = run.size.originalSize;
            let newWidth = UnitConverter.pixelsToTwips(100 * this.size.width / originalSize.width);
            let newHeight = UnitConverter.pixelsToTwips(100 * this.size.height / originalSize.height);
            changeInlinePictureScaleCommand.execute(this.control.commandManager.isPublicApiCall, [newWidth, newHeight]);
        }
        else {
            let layoutOptionsCommand = this.control.commandManager.getCommand(RichEditClientCommand.ShowLayoutOptionsForm);
            let params = layoutOptionsCommand.createParameters(new CommandOptions(this.control));
            const initParams = params.clone();
            params.useAbsoluteWidth = true;
            params.useAbsoluteHeight = true;
            params.absoluteWidth = UnitConverter.pixelsToTwips(this.size.width);
            params.absoluteHeight = UnitConverter.pixelsToTwips(this.size.height);
            params.offsetX = params.offsetX + UnitConverter.pixelsToTwips(this.positionDelta.width);
            params.offsetY = params.offsetY + UnitConverter.pixelsToTwips(this.positionDelta.height);
            layoutOptionsCommand.applyParameters(layoutOptionsCommand.getState(), params, initParams);
        }
    }
    getSize(evt) {
        var absDeltaX = evt.absolutePoint.x - (this.startScrollLeft - evt.scroll.x) - this.startX;
        var absDeltaY = evt.absolutePoint.y - (this.startScrollTop - evt.scroll.y) - this.startY;
        var deltaX = absDeltaX * Math.cos(this.rotation) - (-absDeltaY) * Math.sin(this.rotation);
        var deltaY = -(absDeltaX * Math.sin(this.rotation) + (-absDeltaY) * Math.cos(this.rotation));
        var newWidth, newHeight;
        deltaY = !this.sideV && deltaY > 0 ? Math.min(this.startSize.height + 1, deltaY) : deltaY;
        deltaX = !this.sideH && deltaX > 0 ? Math.min(this.startSize.width + 1, deltaX) : deltaX;
        if (!this.lockH && !this.lockV && this.lockAspectRatio) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                newWidth = this.sideH ? Math.max(1, this.startSize.width + deltaX) : (this.startSize.width - deltaX);
                newHeight = this.startSize.height * (newWidth / this.startSize.width);
            }
            else {
                newHeight = this.sideV ? Math.max(1, this.startSize.height + deltaY) : (this.startSize.height - deltaY);
                newWidth = this.startSize.width * (newHeight / this.startSize.height);
            }
        }
        else {
            deltaX = this.lockH ? 0 : deltaX;
            deltaY = this.lockV ? 0 : deltaY;
            newWidth = Math.max(1, this.sideH ? (this.startSize.width + deltaX) : (this.startSize.width - deltaX));
            newHeight = Math.max(1, this.sideV ? (this.startSize.height + deltaY) : (this.startSize.height - deltaY));
        }
        return new Size(newWidth, newHeight);
    }
    getPositionDelta(newSize) {
        let deltaWidth = this.startSize.width - newSize.width;
        let deltaHeight = this.startSize.height - newSize.height;
        let halfDeltaWidth = (!this.lockV && (this.sideH && !this.sideV || !this.sideH && this.sideV) ? -deltaWidth : deltaWidth) / 2;
        let halfDeltaHeight = deltaHeight / 2;
        let deltaX = halfDeltaWidth * Math.cos(this.rotation) - halfDeltaHeight * Math.sin(this.rotation);
        let deltaY = halfDeltaHeight * Math.cos(this.rotation) + halfDeltaWidth * Math.sin(this.rotation);
        if ((this.sideH || this.sideV) && !(!this.lockV && this.sideH && !this.sideV)) {
            deltaX = -deltaX;
            deltaY = -deltaY;
        }
        return new Size(deltaX + deltaWidth / 2, deltaY + deltaHeight / 2);
    }
}
