import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { RichEditClientCommand } from '../commands/client-command';
import { CommandOptions } from '../commands/command-base';
export class RotateBoxHelper {
    constructor(control, resizeBoxVisualizer) {
        this.control = control;
        this.resizeBoxVisualizer = resizeBoxVisualizer;
    }
    start(evt) {
        let page = this.control.layout.pages[evt.layoutPoint.pageIndex];
        let subDocId = this.control.selection.activeSubDocument.id;
        let box = page.anchoredObjectHolder.getObjectByModelPosition(this.control.layout, this.control.selection.specialRunInfo.getPosition(), subDocId);
        this.centerPoint = box.center;
    }
    move(evt) {
        this.resizeBoxVisualizer.recalculate(null, null, this.getRotation(this.centerPoint, evt.layoutPoint));
    }
    end(evt) {
        let newRotation = this.getRotation(this.centerPoint, evt.layoutPoint);
        let layoutOptionsCommand = this.control.commandManager.getCommand(RichEditClientCommand.ShowLayoutOptionsForm);
        let params = layoutOptionsCommand.createParameters(new CommandOptions(this.control));
        const initParams = params.clone();
        params.rotation = UnitConverter.radiansToDegrees(newRotation);
        layoutOptionsCommand.applyParameters(layoutOptionsCommand.getState(), params, initParams);
        this.resizeBoxVisualizer.recalculate(null, null, newRotation);
    }
    getRotation(center, point) {
        let rotation = Math.atan2(center.y - point.y, center.x - point.x);
        rotation -= Math.PI / 2;
        rotation = (rotation < 0) ? rotation + 2 * Math.PI : rotation;
        const delta = 0.05;
        const correctingValues = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, 2 * Math.PI];
        for (let i = 0; i < correctingValues.length; i++)
            if (Math.abs(rotation - correctingValues[i]) < delta)
                rotation = correctingValues[i];
        if (rotation == 2 * Math.PI)
            rotation = 0;
        return rotation;
    }
}
