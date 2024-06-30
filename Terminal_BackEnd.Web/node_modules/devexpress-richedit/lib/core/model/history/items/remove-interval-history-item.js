import { IntervalBasedHistoryItem } from '../base/interval-based-history-item';
export class RemoveIntervalHistoryItem extends IntervalBasedHistoryItem {
    constructor(modelManipulator, subDocInterval, setPropertiesSecondParagraph) {
        super(modelManipulator, subDocInterval);
        this.setPropertiesSecondParagraph = setPropertiesSecondParagraph;
    }
    redo() {
        this.result = this.modelManipulator.range.removeIntervalInner(this.boundSubDocument, this.interval, this.setPropertiesSecondParagraph);
    }
    undo() {
        this.modelManipulator.range.restoreRemovedInterval(this.boundSubDocument, this.result);
    }
}
