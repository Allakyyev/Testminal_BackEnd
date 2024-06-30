import { TableCellCollection } from '../collections/table/table-cell-collection';
import { convertToIntervalApi } from '../interval';
export class TableRowApi {
    constructor(processor, tablePosition) {
        this._tablePosition = tablePosition;
        this._processor = processor;
    }
    get index() {
        return this._tablePosition.rowIndex;
    }
    get interval() {
        return convertToIntervalApi(this._tablePosition.row.interval);
    }
    get cells() {
        return new TableCellCollection(this._processor, this._tablePosition.clone());
    }
}
