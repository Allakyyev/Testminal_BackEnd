import { ModelChangeType } from '../../enums';
export class ShapeChangedSubDocumentChange {
    constructor(subDocumentId, objectId, newState) {
        this.subDocumentId = subDocumentId;
        this.objectId = objectId;
        this.newState = newState;
        this.type = ModelChangeType.ShapeChanged;
    }
}
