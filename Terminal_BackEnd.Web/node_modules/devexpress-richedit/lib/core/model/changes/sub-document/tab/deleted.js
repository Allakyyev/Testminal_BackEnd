import { ModelChangeType } from '../../enums';
export class TabDeletedSubDocumentChange {
    constructor(subDocumentId, newState) {
        this.subDocumentId = subDocumentId;
        this.newState = newState;
        this.type = ModelChangeType.TabDeleted;
    }
    toJSON(withPostData) {
        return this.newState.toJSON(withPostData);
    }
}
