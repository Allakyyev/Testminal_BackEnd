import { ModelChangeType } from '../enums';
export class SectionMergedSubDocumentChange {
    constructor(sectionIndex, removedInterval, getPropertiesFromNext) {
        this.sectionIndex = sectionIndex;
        this.removedInterval = removedInterval;
        this.getPropertiesFromNext = getPropertiesFromNext;
        this.type = ModelChangeType.SectionMerged;
    }
}
