import { ModelChangeType } from '../../enums';
export class InlinePicturesUpdatedSubDocumentChange {
    constructor(subDocumentId, updatedImageInfo) {
        this.subDocumentId = subDocumentId;
        this.updatedImageInfo = updatedImageInfo;
        this.type = ModelChangeType.InlinePicturesUpdated;
    }
}
