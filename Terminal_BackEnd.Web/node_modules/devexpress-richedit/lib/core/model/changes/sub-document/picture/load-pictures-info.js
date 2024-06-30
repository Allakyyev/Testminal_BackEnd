import { ModelChangeType } from '../../enums';
export class LoadPicturesInfoSubDocumentChange {
    constructor(subDocumentId, data) {
        this.subDocumentId = subDocumentId;
        this.data = data;
        this.type = ModelChangeType.LoadPicturesInfo;
    }
}
