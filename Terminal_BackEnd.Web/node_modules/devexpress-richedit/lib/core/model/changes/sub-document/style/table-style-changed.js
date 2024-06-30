import { ModelChangeType } from '../../enums';
export class TableStyleChangedSubDocumentChange {
    constructor(subDocumentId, table, newStyle) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.newStyle = newStyle;
        this.type = ModelChangeType.TableStyleChanged;
    }
}
