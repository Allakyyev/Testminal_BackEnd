import { TablePosition } from '../../../core/model/tables/main-structures/table';
import { TableRowApi } from '../../table/table-row';
import { Collection } from '../collection';
export class TableRowCollection extends Collection {
    constructor(processor, table) {
        super(processor);
        this._table = table;
    }
    _getItem(coreItem) {
        const pos = new TablePosition(this._table, this._table.rows.indexOf(coreItem), -1);
        pos.row = pos.table.rows[pos.rowIndex];
        return new TableRowApi(this._processor, pos);
    }
    _getCoreItems() {
        return this._table.rows;
    }
}
