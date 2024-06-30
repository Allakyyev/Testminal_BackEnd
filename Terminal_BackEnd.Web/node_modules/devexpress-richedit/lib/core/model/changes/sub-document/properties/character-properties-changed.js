import { ModelChangeType } from '../../enums';
export class CharacterPropertiesChangedSubDocumentChange {
    constructor(subDocumentId, newState) {
        this.subDocumentId = subDocumentId;
        this.newState = newState;
        this.type = ModelChangeType.CharacterPropertiesChanged;
    }
}
