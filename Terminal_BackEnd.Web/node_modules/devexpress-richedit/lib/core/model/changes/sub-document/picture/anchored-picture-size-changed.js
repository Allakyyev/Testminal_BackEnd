import { ModelChangeType } from '../../enums';
export class AnchoredPictureSizeChangedSubDocumentChange {
    constructor(subDocumentId, objectId, position, newState) {
        this.subDocumentId = subDocumentId;
        this.objectId = objectId;
        this.position = position;
        this.newState = newState;
        this.type = ModelChangeType.AnchoredPictureSizeChanged;
    }
    toJSON(withPostData) {
        return this.newState.toJSON(withPostData);
    }
}
