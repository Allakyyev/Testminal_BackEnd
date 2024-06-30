import { TableRow } from '../../../../core/model/tables/main-structures/table-row';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfTableRowProperties } from './properties/table-row-properties';
export class RtfTableRow {
    constructor(table) {
        this.offset = 0;
        this.index = -1;
        this.properties = new RtfTableRowProperties();
        this.table = table;
        this.cells = [];
    }
    get right() {
        const lastCell = ListUtils.last(this.cells);
        return lastCell ? lastCell.properties.right : 0;
    }
    createTableRow(parentTable) {
        const row = new TableRow(parentTable, this.properties.coreProperties);
        this.properties.apply(row);
        return row;
    }
}
