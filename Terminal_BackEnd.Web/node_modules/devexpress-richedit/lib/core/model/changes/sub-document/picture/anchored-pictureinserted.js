import { ContentInsertedSubDocumentChange } from '../../change-base';
import { ModelChangeType } from '../../enums';
export class AnchoredPictureInsertedSubDocumentChange extends ContentInsertedSubDocumentChange {
    constructor(subDocumentId, objectId, position, id, size, anchorInfo, containerProperties) {
        super(subDocumentId, position, 1);
        this.objectId = objectId;
        this.id = id;
        this.size = size;
        this.anchorInfo = anchorInfo;
        this.containerProperties = containerProperties;
        this.type = ModelChangeType.AnchoredPictureInserted;
    }
}
