import { ContentInsertedSubDocumentChange } from '../../change-base';
import { ModelChangeType } from '../../enums';
export class InlinePictureInsertedSubDocumentChange extends ContentInsertedSubDocumentChange {
    constructor(subDocumentId, position, picInfo, containerProperties) {
        super(subDocumentId, position, length);
        this.picInfo = picInfo;
        this.containerProperties = containerProperties;
        this.type = ModelChangeType.InlinePictureInserted;
    }
}
