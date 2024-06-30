import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { HistoryItem } from '../base/history-item';
export class InsertTextHistoryItem extends HistoryItem {
    constructor(modelManipulator, params) {
        super(modelManipulator);
        this.params = params.clone();
    }
    canBeMerged() {
        return true;
    }
    redo() {
        this.modelManipulator.text.insertTextInner(this.params);
    }
    undo() {
        this.modelManipulator.range.removeIntervalWithoutHistory(this.params.subDocPos.subDocument, new FixedInterval(this.params.subDocPos.position, this.params.text.length), false);
    }
}
