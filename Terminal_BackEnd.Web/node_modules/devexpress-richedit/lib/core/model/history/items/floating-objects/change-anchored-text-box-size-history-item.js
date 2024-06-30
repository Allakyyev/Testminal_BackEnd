import { IntervalBasedHistoryItem } from '../../base/interval-based-history-item';
export class ChangeAnchoredTextBoxSizeHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, size) {
        super(modelManipulator, subDocInterval);
        this.size = size;
    }
    redo() {
        this.oldState = this.modelManipulator.floatingObject.textBoxSize.setValue(this.boundSubDocument, this.interval, this.size);
    }
    undo() {
        this.modelManipulator.floatingObject.textBoxSize.restoreValue(this.boundSubDocument, this.oldState);
    }
}
