import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
export class ChangeRectangularObjectScaleHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, scale) {
        super(modelManipulator, subDocInterval);
        this.scale = scale;
    }
    redo() {
        this.oldState = this.modelManipulator.inlineObject.scale.setValue(this.boundSubDocument, this.interval, this.scale);
    }
    undo() {
        this.modelManipulator.inlineObject.scale.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class ChangeRectangularObjectLockAspectRatioHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, lockAspectRatio) {
        super(modelManipulator, subDocInterval);
        this.lockAspectRatio = lockAspectRatio;
    }
    redo() {
        this.oldState = this.modelManipulator.inlineObject.lockAspectRatio.setValue(this.boundSubDocument, this.interval, this.lockAspectRatio);
    }
    undo() {
        this.modelManipulator.inlineObject.lockAspectRatio.restoreValue(this.boundSubDocument, this.oldState);
    }
}
