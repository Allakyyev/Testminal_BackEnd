import { IntervalBasedHistoryItem } from '../../base/interval-based-history-item';
export class ShapePropertyHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, newValue, propertyManipulator) {
        super(modelManipulator, subDocInterval);
        this.newValue = newValue;
        this.propertyManipulator = propertyManipulator;
    }
    redo() {
        this.oldState = this.propertyManipulator.setValue(this.boundSubDocument, this.interval, this.newValue);
    }
    undo() {
        this.propertyManipulator.restoreValue(this.boundSubDocument, this.oldState);
    }
}
export class ShapeHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, newValue) {
        super(modelManipulator, subDocInterval);
        this.newValue = newValue;
    }
    redo() {
        this.oldState = this.modelManipulator.floatingObject.shape.setValue(this.boundSubDocument, this.interval, this.newValue);
    }
    undo() {
        this.modelManipulator.floatingObject.shape.restoreValue(this.boundSubDocument, this.oldState);
    }
}
