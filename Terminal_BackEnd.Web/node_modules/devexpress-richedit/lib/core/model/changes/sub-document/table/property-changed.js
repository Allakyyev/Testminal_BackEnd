import { ModelChangeType } from '../../enums';
export class TablePropertyChangedSubDocumentChange {
    constructor(subDocument, property, newState) {
        this.subDocument = subDocument;
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.TablePropertyChanged;
    }
    get subDocumentId() { return this.subDocument.id; }
}
