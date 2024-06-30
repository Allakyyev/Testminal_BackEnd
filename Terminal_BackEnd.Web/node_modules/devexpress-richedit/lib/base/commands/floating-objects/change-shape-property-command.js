import { ColorHelper } from '../../../core/model/color/color';
import { ShapeHistoryItem } from '../../../core/model/history/items/floating-objects/shape-property-history-item';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeFloatingObjectShapeCommand extends CommandBase {
    getState() {
        let isEnabled = this.isEnabled();
        let value;
        if (isEnabled) {
            value = this.getValue();
        }
        return new SimpleCommandState(this.isEnabled(), value);
    }
    canModify() {
        return true;
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isSelected() && specialRunInfo.isSelectedAnchorObject &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPosition(), 1)]);
    }
    executeCore(_state, options) {
        let modelManipulator = this.modelManipulator;
        let specialRunInfo = this.selection.specialRunInfo;
        this.history.addAndRedo(new ShapeHistoryItem(modelManipulator, new SubDocumentInterval(specialRunInfo.getParentSubDocument(), new FixedInterval(specialRunInfo.getPosition(), 1)), options.param));
        return true;
    }
    getValue() {
        let specialRunInfo = this.selection.specialRunInfo;
        let run = specialRunInfo.getParentSubDocument().getRunByPosition(specialRunInfo.getPosition());
        let anchoredRun = run;
        return anchoredRun.shape.clone();
    }
}
export class ChangeShapePropertyCommandBase extends CommandBase {
    getState() {
        let isEnabled = this.isEnabled();
        let value;
        if (isEnabled) {
            let specialRunInfo = this.selection.specialRunInfo;
            let run = specialRunInfo.getParentSubDocument().getRunByPosition(specialRunInfo.getPosition());
            var anchoredRun = run;
            value = this.getValue(anchoredRun.shape);
        }
        return new SimpleCommandState(this.isEnabled(), value);
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isSelected() && specialRunInfo.isSelectedAnchorObject;
    }
}
export class ChangeShapeFillColorCommand extends ChangeShapePropertyCommandBase {
    getState() {
        const state = super.getState();
        state.denyUpdateValue = true;
        return state;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ColorHelper.anyToColor(parameter, ColorHelper.NO_COLOR);
    }
    executeCore(_state, options) {
        const specialRunInfo = this.selection.specialRunInfo;
        this.modelManipulator.picture.changeShapeFillColor(specialRunInfo.getParentSubDocument(), specialRunInfo.getPosition(), options.param);
        return true;
    }
    getValue(shape) {
        return shape.fillColor;
    }
}
export class ChangeShapeOutlineColorCommand extends ChangeShapePropertyCommandBase {
    getState() {
        const state = super.getState();
        state.denyUpdateValue = true;
        return state;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ColorHelper.anyToColor(parameter, ColorHelper.NO_COLOR);
    }
    executeCore(_state, options) {
        const specialRunInfo = this.selection.specialRunInfo;
        this.modelManipulator.picture.changeShapeOutlineColor(specialRunInfo.getParentSubDocument(), specialRunInfo.getPosition(), options.param);
        return true;
    }
    getValue(shape) {
        return shape.outlineColor;
    }
}
export class ChangeShapeOutlineWidthCommand extends ChangeShapePropertyCommandBase {
    executeCore(_state, options) {
        const specialRunInfo = this.selection.specialRunInfo;
        this.modelManipulator.picture.changeShapeOutlineWidth(specialRunInfo.getParentSubDocument(), specialRunInfo.getPosition(), options.param);
        return true;
    }
    getValue(shape) {
        return shape.outlineWidth;
    }
}
