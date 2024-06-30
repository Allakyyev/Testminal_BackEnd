import { TableCellProperties } from '../../../core/model/tables/properties/table-cell-properties';
import { TableProperties } from '../../../core/model/tables/properties/table-properties';
import { TableRowProperties } from '../../../core/model/tables/properties/table-row-properties';
export class TableImporter {
    constructor(data) {
        this.data = data;
    }
    get isInsideTable() { return this.data.subDocumentInfo.tableStack.count > 0; }
    cancelTable(table) {
        const tables = this.data.subDocument.tables;
        tables.splice(tables.indexOf(table), 1);
        this.data.subDocumentInfo.tableStack.pop();
    }
    createDefaultTableProperties() {
        return new TableProperties();
    }
    createDefaultRowProperties() {
        return new TableRowProperties();
    }
    createDefaultCellProperties() {
        return new TableCellProperties();
    }
}
