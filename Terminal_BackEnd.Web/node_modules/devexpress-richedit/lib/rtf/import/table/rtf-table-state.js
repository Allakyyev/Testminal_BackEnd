export class RtfTableState {
    constructor(table, reader) {
        this.table = table;
        this.tableProperties = reader.tableProperties;
        this.rowProperties = reader.rowProperties;
        this.cellPropertiesCollection = reader.cellPropertiesCollection;
    }
}
