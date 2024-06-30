import { ModelChangeType } from '../../enums';
export class TableRowPropertyChangedSubDocumentChange {
    constructor(subDocument, property, newState) {
        this.subDocument = subDocument;
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.TableRowPropertyChanged;
    }
    get subDocumentId() { return this.subDocument.id; }
}
