import { ModelChangeType } from '../../enums';
export class CharacterFormattingChangedSubDocumentChange {
    constructor(subDocumentId, property, newState) {
        this.subDocumentId = subDocumentId;
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.CharacterFormattingChanged;
    }
}
