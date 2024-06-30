import { ModelChangeType } from '../../enums';
export class AnchoredTextBoxSizeChangedSubDocumentChange {
    constructor(subDocumentId, objectId, position, newState) {
        this.subDocumentId = subDocumentId;
        this.objectId = objectId;
        this.position = position;
        this.newState = newState;
        this.type = ModelChangeType.AnchoredTextBoxSizeChanged;
    }
}
