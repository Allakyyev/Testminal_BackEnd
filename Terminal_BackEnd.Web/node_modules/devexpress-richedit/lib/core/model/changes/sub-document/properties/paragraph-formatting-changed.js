import { ModelChangeType } from '../../enums';
export class ParagraphFormattingChangedSubDocumentChange {
    constructor(subDocumentId, property, newState) {
        this.subDocumentId = subDocumentId;
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.ParagraphFormattingChanged;
    }
}
