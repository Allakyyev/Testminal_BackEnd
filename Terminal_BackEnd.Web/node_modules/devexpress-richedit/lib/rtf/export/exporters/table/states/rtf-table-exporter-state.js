import { RtfExportSR } from '../../../../translation-table/rtf-export-sr';
import { RtfTableExporterStateBase } from './rtf-table-exporter-state-base';
export class RtfTableExporterState extends RtfTableExporterStateBase {
    constructor(rtfExporter, table) {
        super(rtfExporter, table, 1);
    }
    export() {
        super.exportBase();
    }
    writeParagraphEndMark() {
        this.rtfBuilder.writeCommand(RtfExportSR.TableEndCell);
    }
    exportRow(row, rowIndex) {
        super.exportRowCells(row, rowIndex);
        super.exportRowProperties(row, rowIndex);
        this.rtfBuilder.writeCommand(RtfExportSR.TableEndRow);
    }
}
