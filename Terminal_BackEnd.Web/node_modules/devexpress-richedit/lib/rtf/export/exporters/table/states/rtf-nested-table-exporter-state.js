import { RtfExportSR } from '../../../../translation-table/rtf-export-sr';
import { RtfTableExporterStateBase } from './rtf-table-exporter-state-base';
export class RtfNestedTableExporterState extends RtfTableExporterStateBase {
    constructor(rtfExporter, table, nestingLevel) {
        super(rtfExporter, table, nestingLevel);
    }
    export() {
        super.exportBase();
    }
    writeParagraphEndMark() {
        this.rtfBuilder.writeCommand(RtfExportSR.NestedTableEndCell);
        this.writeNoNestedTableGroup();
    }
    exportRow(row, rowIndex) {
        super.exportRowCells(row, rowIndex);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.NestedTableProperties);
        super.exportRowProperties(row, rowIndex);
        this.rtfBuilder.writeCommand(RtfExportSR.NestedTableEndRow);
        this.rtfBuilder.closeGroup();
    }
    writeNoNestedTableGroup() {
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeCommand(RtfExportSR.NoNestedTable);
        this.rtfBuilder.writeCommand(RtfExportSR.EndOfParagraph);
        this.rtfBuilder.closeGroup();
    }
}
