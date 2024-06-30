import { ModelChangeType } from '../../enums';
export class IntervalRemovedSubDocumentChange {
    constructor(subDocumentId, interval, removedText) {
        this.subDocumentId = subDocumentId;
        this.interval = interval;
        this.removedText = removedText;
        this.type = ModelChangeType.IntervalRemoved;
    }
}
