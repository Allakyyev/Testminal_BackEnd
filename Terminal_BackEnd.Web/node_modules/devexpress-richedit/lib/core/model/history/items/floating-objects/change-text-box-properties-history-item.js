import { IntervalBasedHistoryItem } from '../../base/interval-based-history-item';
export class ChangeTextBoxPropertiesHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, textBoxProperties) {
        super(modelManipulator, subDocInterval);
        this.textBoxProperties = textBoxProperties;
    }
    redo() {
        this.oldState = this.modelManipulator.floatingObject.textBoxProperties.setValue(this.boundSubDocument, this.interval, this.textBoxProperties);
    }
    undo() {
        this.modelManipulator.floatingObject.textBoxProperties.restoreValue(this.boundSubDocument, this.oldState);
    }
}
