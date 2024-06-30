import { IntervalBasedHistoryItem } from '../../base/interval-based-history-item';
export class ChangeAnchoredPictureSizeHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, size) {
        super(modelManipulator, subDocInterval);
        this.size = size;
    }
    redo() {
        this.oldState = this.modelManipulator.floatingObject.pictureSize.setValue(this.boundSubDocument, this.interval, this.size);
    }
    undo() {
        this.modelManipulator.floatingObject.pictureSize.restoreValue(this.boundSubDocument, this.oldState);
    }
}
