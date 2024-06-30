import { ModelChangeType } from '../../enums';
export class AnchorObjectRemovedSubDocumentChange {
    constructor(subDocumentId, objectId, position) {
        this.subDocumentId = subDocumentId;
        this.objectId = objectId;
        this.position = position;
        this.type = ModelChangeType.AnchorObjectRemoved;
    }
}
