import { RtfNestedTableExporterState } from './states/rtf-nested-table-exporter-state';
import { RtfTableExporterState } from './states/rtf-table-exporter-state';
export class RtfTableExporter {
    static exportTable(rtfContentExporter, table) {
        new RtfTableExporterState(rtfContentExporter, table).export();
        rtfContentExporter.tableIterator.update(table.getEndPosition());
        return rtfContentExporter.subDocument.getParagraphIndexByPosition(table.getEndPosition() - 1);
    }
    static exportNestedTable(rtfContentExporter, table, nestingLevel) {
        new RtfNestedTableExporterState(rtfContentExporter, table, nestingLevel).export();
        rtfContentExporter.tableIterator.update(table.getEndPosition());
        return rtfContentExporter.subDocument.getParagraphIndexByPosition(table.getEndPosition() - 1);
    }
}
