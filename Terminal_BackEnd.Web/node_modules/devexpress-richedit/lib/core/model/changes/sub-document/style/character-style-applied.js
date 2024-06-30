import { ModelChangeType } from '../../enums';
export class CharacterStyleAppliedSubDocumentChange {
    constructor(subDocumentId, newState) {
        this.subDocumentId = subDocumentId;
        this.newState = newState;
        this.type = ModelChangeType.CharacterStyleApplied;
    }
}
