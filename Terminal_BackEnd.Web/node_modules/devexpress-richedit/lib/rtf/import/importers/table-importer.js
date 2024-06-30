import { TableRestorer } from '../../../core/formats/model-restorer/table-restorer';
import { Table } from '../../../core/model/tables/main-structures/table';
import { RtfTableConverter } from '../table/table-converter';
import { RtfBaseImporter } from './importer-base';
export class RtfTableImporter extends RtfBaseImporter {
    get tableReader() { return this.data.positionStates.last.tableReader; }
    ;
    constructor(data) {
        super(data);
    }
    insertTables() {
        if (this.tableReader.tables.length == 0)
            return;
        new RtfTableConverter(this.tableReader).convertTables(this.tableReader.tables, false);
    }
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
        this.insertTables();
        Table.fillTableByLevels(this.subDocument);
        TableRestorer.fixTables(this.subDocument);
        TableRestorer.fixLastParagraph(this.subDocument);
        if (this.subDocument.isMain())
            TableRestorer.paragraphMarkBetween(this.subDocument.documentModel);
    }
}
