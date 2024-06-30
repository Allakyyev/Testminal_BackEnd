import { ModelChangeType } from '../../enums';
export class TableCellMergedHorizontallySubDocumentChange {
    constructor(subDocumentId, table, rowIndex, cellIndex, rightDirection) {
        this.subDocumentId = subDocumentId;
        this.table = table;
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        this.rightDirection = rightDirection;
        this.type = ModelChangeType.TableCellMergedHorizontally;
    }
}
