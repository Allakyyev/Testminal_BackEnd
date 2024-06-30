import { ModelChangeType } from '../../enums';
export class ParagraphNumberingListChangedSubDocumentChange {
    constructor(subDocument, newState, oldAbstractNumberingListIndex) {
        this.subDocument = subDocument;
        this.newState = newState;
        this.oldAbstractNumberingListIndex = oldAbstractNumberingListIndex;
        this.type = ModelChangeType.ParagraphNumberingListChanged;
    }
    get subDocumentId() { return this.subDocument.id; }
}
