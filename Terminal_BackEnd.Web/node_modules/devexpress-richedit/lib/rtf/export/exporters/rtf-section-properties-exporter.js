import { SectionProperties } from '../../../core/model/section/section-properties';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { RtfContentExporter } from './rtf-content-exporter';
import { RtfPropertiesExporter } from './rtf-properties-exporter';
import { LineNumberDefaults } from '../../../core/model/section/line-numbering-properties';
import { LineNumberingRestartType } from '../../../core/model/section/enums';
export class RtfSectionPropertiesExporter extends RtfPropertiesExporter {
    exportSectionProperties(section) {
        this.exportSectionMargins(section.sectionProperties.margins);
        this.exportSectionOffsets(section.sectionProperties);
        this.exportSectionPage(section.sectionProperties);
        this.exportSectionGeneralSettings(section.sectionProperties);
        this.exportSectionColumns(section.sectionProperties);
        this.exportSectionPageNumbering(section.sectionProperties);
        this.exportSectionLineNumbering(section.sectionProperties.lineNumbering);
    }
    exportSectionPageNumbering(properties) {
        if (!properties.continueNumbering) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionPageNumberingStart, properties.firstPageNumber);
            this.rtfBuilder.writeCommand(RtfExportSR.SectionPageNumberingRestart);
        }
    }
    exportSectionMargins(margins) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionMarginsLeft, margins.left);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionMarginsRight, margins.right);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionMarginsTop, margins.top);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionMarginsBottom, margins.bottom);
    }
    exportSectionOffsets(properties) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionMarginsHeaderOffset, properties.headerOffset);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionMarginsFooterOffset, properties.footerOffset);
    }
    exportSectionPage(properties) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionPageWidth, properties.pageWidth);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionPageHeight, properties.pageHeight);
        if (properties.landscape)
            this.rtfBuilder.writeCommand(RtfExportSR.SectionPageLandscape);
    }
    exportSectionGeneralSettings(properties) {
        const defaultProperties = new SectionProperties();
        if (properties.startType != defaultProperties.startType)
            this.writeEnumValueCommand(RtfContentExporter.sectionStartTypes, properties.startType, RtfExportSR.SectionBreakTypeNextPage);
        if (properties.differentFirstPage != defaultProperties.differentFirstPage)
            this.rtfBuilder.writeCommand(RtfExportSR.SectionTitlePage);
    }
    exportSectionColumns(properties) {
        if (properties.equalWidthColumns) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionColumnsCount, properties.columnCount);
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionSpaceBetweenColumns, properties.space);
        }
        else
            this.exportSectionColumnsDetails(properties.columnsInfo);
    }
    exportSectionColumnsDetails(columns) {
        const count = columns.length;
        if (count > 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionColumnsCount, count);
        for (let i = 0; i < count; i++)
            this.exportSectionColumn(columns[i], i);
    }
    exportSectionColumn(column, columnIndex) {
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionColumnNumber, columnIndex + 1);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionColumnWidth, column.width);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionColumnSpace, column.space);
    }
    writeEnumValueCommand(table, value, defaultCommand) {
        let command = table[value];
        if (!command)
            command = defaultCommand;
        this.rtfBuilder.writeCommand(command);
    }
    exportSectionLineNumbering(lineNumbering) {
        if (!lineNumbering || !lineNumbering.isDefined)
            return;
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionLineNumberingCountBy, lineNumbering.countBy);
        if (lineNumbering.distance !== LineNumberDefaults.distance)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionLineNumberingDistance, lineNumbering.distance);
        if (lineNumbering.start !== LineNumberDefaults.start)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.SectionLineNumberingStart, lineNumbering.start);
        if (lineNumbering.restart !== LineNumberDefaults.restart)
            this.exportLineNumberRestartType(lineNumbering.restart);
    }
    exportLineNumberRestartType(restart) {
        switch (restart) {
            case LineNumberingRestartType.NewPage:
                this.rtfBuilder.writeCommand(RtfExportSR.SectionLineNumberingRestartNewPage);
                break;
            case LineNumberingRestartType.NewSection:
                this.rtfBuilder.writeCommand(RtfExportSR.SectionLineNumberingRestartNewSection);
                break;
            case LineNumberingRestartType.Continuous:
                this.rtfBuilder.writeCommand(RtfExportSR.SectionLineNumberingContinuous);
                break;
        }
    }
}
