import { Point } from '@devexpress/utils/lib/geometry/point';
import { PdfBoxExporter } from './box-exporter';
export class PdfLayoutRowExporter {
    constructor(doc, textFontMapCache, measurer) {
        this.doc = doc;
        this.boxExporter = new PdfBoxExporter(doc, textFontMapCache, measurer);
    }
    export(row, columnOffset) {
        const rowOffset = Point.plus(columnOffset, row);
        rowOffset.y += row.getSpacingBefore();
        const baseLine = (row.baseLine - row.getSpacingBefore()) / (row.height - row.getSpacingBefore() - row.getSpacingAfter());
        let lastBoxIndexWhatCanStrikeoutAndUnderline = row.boxes.length - 1;
        for (let box; box = row.boxes[lastBoxIndexWhatCanStrikeoutAndUnderline]; lastBoxIndexWhatCanStrikeoutAndUnderline--)
            if (!box.renderNoStrikeoutAndNoUnderlineIfBoxInEndRow())
                break;
        if (row.numberingListBox) {
            this.doc.save();
            this.boxExporter.export(row, row.numberingListBox.textBox, 0, rowOffset, baseLine, lastBoxIndexWhatCanStrikeoutAndUnderline);
            if (row.numberingListBox.separatorBox)
                this.boxExporter.export(row, row.numberingListBox.separatorBox, 0, rowOffset, baseLine, lastBoxIndexWhatCanStrikeoutAndUnderline);
            this.doc.restore();
        }
        const lastVisibleBoxIndex = row.getLastVisibleBoxIndex();
        for (let boxIndex = 0; boxIndex <= lastVisibleBoxIndex; boxIndex++) {
            this.doc.save();
            this.boxExporter.export(row, row.boxes[boxIndex], boxIndex, rowOffset, baseLine, lastBoxIndexWhatCanStrikeoutAndUnderline);
            this.doc.restore();
        }
    }
}
