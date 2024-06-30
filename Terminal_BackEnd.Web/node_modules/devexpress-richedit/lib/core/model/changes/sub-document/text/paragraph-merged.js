import { ModelChangeType } from '../../enums';
export class ParagraphMergedSubDocumentChange {
    constructor(subDocumentId, removedInterval, position, getPropertiesFromNext) {
        this.subDocumentId = subDocumentId;
        this.removedInterval = removedInterval;
        this.position = position;
        this.getPropertiesFromNext = getPropertiesFromNext;
        this.type = ModelChangeType.ParagraphMerged;
    }
}
