import { LayoutRow, LayoutRowStateFlags } from '../../../layout/main-structures/layout-row';
import { LayoutBoxType } from '../../../layout/main-structures/layout-boxes/layout-box';
export class TableRowSpacingBeforeApplier {
    constructor(lastRow, paragraphs, isFirstRowInCell, isFirstCellInRow, isFirstRowInTable) {
        this.lastRow = lastRow;
        this.paragraphs = paragraphs;
        this.isFirstRowInCell = isFirstRowInCell;
        this.isFirstCellInRow = isFirstCellInRow;
        this.isFirstRowInTable = isFirstRowInTable;
    }
    apply(row, rowParagraphIndex) {
        row.applySpacingBefore(this.lastRow && !this.lastRow.flags.get(LayoutRowStateFlags.ParagraphEnd) ? 0 :
            LayoutRow.getParagraphSpacingBefore(this.paragraphs[rowParagraphIndex], this.paragraphs[rowParagraphIndex - 1], this.isFirstRowInCell, this.isFirstCellInRow, this.isFirstRowInTable));
    }
}
export class RowSpacingBeforeApplier {
    constructor(settings, lastRowInfo, paragraphs, isFirstRowOnColumn) {
        this.settings = settings;
        this.lastRowInfo = lastRowInfo;
        this.paragraphs = paragraphs;
        this.isFirstRowOnColumn = isFirstRowOnColumn;
    }
    apply(row, rowParagraphIndex) {
        row.applySpacingBefore(this.calculateSpacingBefore(row, rowParagraphIndex));
    }
    calculateSpacingBefore(row, rowParagraphIndex) {
        const lastRow = this.lastRowInfo.row;
        if (this.firstRowOfSection() || (lastRow.tableCellInfo && !this.isFirstRowOnColumn)) {
            return LayoutRow.getParagraphSpacingBefore(this.paragraphs[rowParagraphIndex], null, false, false, false);
        }
        else if (rowParagraphIndex == this.lastRowInfo.paragraphIndex) {
            if (this.firstRowOfParagraphStartingWithPageBreak() && this.settings.allowParagraphSpacingAfterPageBreak)
                return LayoutRow.getParagraphSpacingBefore(this.paragraphs[rowParagraphIndex], null, false, false, false);
        }
        else if (!this.isFirstRowOnColumn && !this.rowConsistsOfPageBreakOnly(row)) {
            return LayoutRow.getParagraphSpacingBefore(this.paragraphs[rowParagraphIndex], this.paragraphs[rowParagraphIndex - 1], false, false, false);
        }
        return 0;
    }
    firstRowOfSection() {
        return !this.lastRowInfo.row || this.lastRowInfo.row.flags.get(LayoutRowStateFlags.SectionEnd);
    }
    rowConsistsOfPageBreakOnly(row) {
        return row.boxes.length == 1 && row.boxes[0].getType() == LayoutBoxType.PageBreak;
    }
    firstRowOfParagraphStartingWithPageBreak() {
        return this.lastRowInfo.row && this.rowConsistsOfPageBreakOnly(this.lastRowInfo.row) &&
            this.lastRowInfo.startPosition == this.paragraphs[this.lastRowInfo.paragraphIndex].startLogPosition.value;
    }
}
