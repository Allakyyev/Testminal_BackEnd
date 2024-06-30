import { Table } from '../../../../core/model/tables/main-structures/table';
import { RtfTableProperties } from './properties/rtf-table-properties';
export class RtfTable {
    constructor(parentCell = null) {
        this.indent = 0;
        this.properties = new RtfTableProperties();
        this.rows = [];
        this.parentCell = parentCell;
    }
    get nestingLevel() { return this.getNestedLevel(); }
    getNestedLevel() {
        let nestingLevel = 1;
        let parentCell = this.parentCell;
        while (parentCell != null) {
            const parentTable = parentCell.row.table;
            parentCell = parentTable.parentCell;
            nestingLevel++;
        }
        return nestingLevel;
    }
    createTable(tblIndex, parentCell, model) {
        const table = new Table(this.properties.coreProperties, model.tableStyles[this.properties.style]);
        table.index = tblIndex;
        table.nestedLevel = this.nestingLevel - 1;
        table.parentCell = parentCell;
        this.properties.apply(table);
        return table;
    }
}
