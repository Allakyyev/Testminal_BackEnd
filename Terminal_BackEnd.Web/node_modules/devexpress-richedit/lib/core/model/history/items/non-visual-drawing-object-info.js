import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
export class NonVisualDrawingObjectInfoPropertyHistoryItem extends IntervalBasedHistoryItem {
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
