import { ModelChangeType } from '../../enums';
export class InlineObjectRunPropertyChangedSubDocumentChange {
    constructor(subDocumentId, property, position, newState) {
        this.subDocumentId = subDocumentId;
        this.property = property;
        this.position = position;
        this.newState = newState;
        this.type = ModelChangeType.InlineObjectRunPropertyChanged;
    }
}
