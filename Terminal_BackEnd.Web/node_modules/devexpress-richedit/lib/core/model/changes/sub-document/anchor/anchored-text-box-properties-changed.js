import { ModelChangeType } from '../../enums';
export class AnchoredTextBoxPropertiesChangedSubDocumentChange {
    constructor(subDocumentId, objectId, position, newState) {
        this.subDocumentId = subDocumentId;
        this.objectId = objectId;
        this.position = position;
        this.newState = newState;
        this.type = ModelChangeType.AnchoredTextBoxPropertiesChanged;
    }
}
