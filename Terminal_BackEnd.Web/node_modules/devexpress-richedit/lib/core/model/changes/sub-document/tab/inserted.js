import { ModelChangeType } from '../../enums';
export class TabInsertedSubDocumentChange {
    constructor(subDocumentId, newState) {
        this.subDocumentId = subDocumentId;
        this.newState = newState;
        this.type = ModelChangeType.TabInserted;
    }
    toJSON(withPostData) {
        return this.newState.toJSON(withPostData);
    }
}
