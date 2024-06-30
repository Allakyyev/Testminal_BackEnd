import { ContentInsertedSubDocumentChange } from '../../change-base';
import { ModelChangeType } from '../../enums';
export class AnchoredTextBoxInsertedSubDocumentChange extends ContentInsertedSubDocumentChange {
    constructor(subDocumentId, objectId, innerSubDocId, position, anchorInfo, containerProperties) {
        super(subDocumentId, position, 1);
        this.objectId = objectId;
        this.innerSubDocId = innerSubDocId;
        this.anchorInfo = anchorInfo;
        this.containerProperties = containerProperties;
        this.type = ModelChangeType.AnchoredTextBoxInserted;
    }
}
