import { IntervalBasedHistoryItem } from '../../base/interval-based-history-item';
export class ChangeImagePropertyHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, base64, size) {
        super(modelManipulator, subDocInterval);
        this.base64 = base64;
        this.size = size;
    }
    redo() {
        this.oldState = this.modelManipulator.floatingObject.image.setValue(this.boundSubDocument, this.interval, [this.base64, this.size]);
    }
    undo() {
        this.modelManipulator.floatingObject.image.restoreValue(this.boundSubDocument, this.oldState);
    }
}
