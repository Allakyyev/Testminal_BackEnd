import { ColorHelper } from '../core/model/color/color';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Point } from '@devexpress/utils/lib/geometry/point';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { PdfLayoutRowExporter } from './row-exporter';
import { PdfLayoutTableColumnInfoExporter } from './table-column-info-exporter';
export class PdfLayoutPageAreaExporter {
    constructor(doc, textFontMapCache, measurer) {
        this.doc = doc;
        this.rowExporter = new PdfLayoutRowExporter(doc, textFontMapCache, measurer);
        this.tableColumnInfoExporter = new PdfLayoutTableColumnInfoExporter(doc);
    }
    export(pageArea, pageHeight, shouldApplyCliping) {
        this.doc.save();
        const pageAreaBounds = pageArea.clone().applyConverter(UnitConverter.pixelsToPointsF);
        if (shouldApplyCliping)
            this.doc.rect(pageAreaBounds.x, pageAreaBounds.y, pageAreaBounds.width, pageAreaBounds.height).clip();
        pageArea.columns.forEach((column) => this.exportColumn(column, new Point(pageArea.x, pageArea.y), pageHeight));
        if (shouldApplyCliping)
            this.doc.restore();
    }
    exportColumn(column, pageAreaOffset, pageHeight) {
        const columnOffset = Point.plus(pageAreaOffset, column);
        column.tablesInfo.forEach((tableColumnInfo) => this.tableColumnInfoExporter.export(tableColumnInfo, columnOffset));
        this.exportParagraphFrames(columnOffset, column.paragraphFrames);
        for (let row of column.rows) {
            if (this.shouldExportRow(row, columnOffset, pageHeight))
                this.rowExporter.export(row, columnOffset);
        }
    }
    shouldExportRow(row, columnOffset, pageHeight) {
        return row.height > 0 && row.y + row.height + columnOffset.y < pageHeight;
    }
    exportParagraphFrames(columnOffset, paragraphFrames) {
        for (let frame of paragraphFrames)
            if (frame.paragraphColor != ColorHelper.AUTOMATIC_COLOR) {
                const framePos = Point.plus(columnOffset, frame).applyConverter(UnitConverter.pixelsToPointsF);
                this.doc.rect(framePos.x, framePos.y, UnitConverter.pixelsToPointsF(frame.width), UnitConverter.pixelsToPointsF(frame.height))
                    .fill(ColorUtils.colorToHash(frame.paragraphColor));
                this.doc.fillColor(ColorUtils.colorToHash(ColorHelper.AUTOMATIC_COLOR));
            }
    }
}
