import { TableCellApi } from '../../table/table-cell';
import { Collection } from '../collection';
export class TableCellCollection extends Collection {
    constructor(processor, tablePosition) {
        super(processor);
        this._tablePosition = tablePosition;
    }
    _getItem(coreItem) {
        const pos = this._tablePosition.clone();
        pos.cellIndex = pos.row.cells.indexOf(coreItem);
        pos.cell = pos.row.cells[pos.cellIndex];
        return new TableCellApi(pos);
    }
    _getCoreItems() {
        return this._tablePosition.row.cells;
    }
}
