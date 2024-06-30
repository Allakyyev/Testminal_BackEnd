import { ModelChangeType } from '../../enums';
export class ParagraphStyleAppliedSubDocumentChange {
    constructor(subDocumentId, newState) {
        this.subDocumentId = subDocumentId;
        this.newState = newState;
        this.type = ModelChangeType.ParagraphStyleApplied;
    }
}
