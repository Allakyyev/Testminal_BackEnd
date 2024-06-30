import { ModelChangeType } from '../../enums';
export class TextBufferChangedSubDocumentChange {
    constructor(subDocumentId, newState) {
        this.subDocumentId = subDocumentId;
        this.newState = newState;
        this.type = ModelChangeType.TextBufferChanged;
    }
}
