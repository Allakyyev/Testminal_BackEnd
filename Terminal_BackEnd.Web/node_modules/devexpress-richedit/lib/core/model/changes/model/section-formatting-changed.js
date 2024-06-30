import { ModelChangeType } from '../enums';
export class SectionsFormattingChangedModelChange {
    constructor(startSectionIndex, endSectionIndex, property, newState) {
        this.startSectionIndex = startSectionIndex;
        this.endSectionIndex = endSectionIndex;
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.SectionFormattingChanged;
    }
}
