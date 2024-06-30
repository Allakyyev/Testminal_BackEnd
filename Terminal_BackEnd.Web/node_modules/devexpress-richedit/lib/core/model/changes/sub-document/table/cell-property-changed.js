import { ModelChangeType } from '../../enums';
export class TableCellPropertyChangedSubDocumentChange {
    constructor(subDocument, property, newState) {
        this.subDocument = subDocument;
        this.property = property;
        this.newState = newState;
        this.type = ModelChangeType.TableCellPropertyChanged;
    }
    get subDocumentId() { return this.subDocument.id; }
}
