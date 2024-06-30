import { Flag } from '@devexpress/utils/lib/class/flag';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export var LayoutRowStateFlags;
(function (LayoutRowStateFlags) {
    LayoutRowStateFlags[LayoutRowStateFlags["NormallyEnd"] = 0] = "NormallyEnd";
    LayoutRowStateFlags[LayoutRowStateFlags["ParagraphEnd"] = 1] = "ParagraphEnd";
    LayoutRowStateFlags[LayoutRowStateFlags["PageEnd"] = 2] = "PageEnd";
    LayoutRowStateFlags[LayoutRowStateFlags["ColumnEnd"] = 4] = "ColumnEnd";
    LayoutRowStateFlags[LayoutRowStateFlags["SectionEnd"] = 8] = "SectionEnd";
    LayoutRowStateFlags[LayoutRowStateFlags["DocumentEnd"] = 16] = "DocumentEnd";
    LayoutRowStateFlags[LayoutRowStateFlags["CellTableEnd"] = 64] = "CellTableEnd";
    LayoutRowStateFlags[LayoutRowStateFlags["PageBreakBefore"] = 128] = "PageBreakBefore";
})(LayoutRowStateFlags || (LayoutRowStateFlags = {}));
export class LayoutRow extends Rectangle {
    constructor(minY = Number.MAX_SAFE_INTEGER) {
        super(0, 0, 0, 0);
        this.boxes = [];
        this.bookmarkBoxes = [];
        this.numberingListBox = null;
        this.flags = new Flag(LayoutRowStateFlags.NormallyEnd);
        this.initialY = minY;
    }
    get hasEffectToPageHeight() { return this.boxes.length != 1 || !this.boxes[0].isSectionBreakBox; }
    getEndPosition() {
        return this.columnOffset + this.getLastBoxEndPositionInRow();
    }
    getLastBoxEndPositionInRow() {
        return ListUtils.last(this.boxes).getEndPosition();
    }
    getStartPosition() {
        return this.columnOffset + this.boxes[0].rowOffset;
    }
    getLastBox() {
        return ListUtils.last(this.boxes);
    }
    isEmpty() {
        return this.boxes.length == 0;
    }
    increaseRowHeightFromSpacingBeforeAndAfter(maxAscent, maxDescent) {
        const lastBox = this.getLastBox();
        if (!lastBox)
            return;
        const ascentOverflow = maxAscent - this.baseLine + this.spacingBefore;
        if (ascentOverflow > 0)
            this.spacingBefore -= Math.min(this.spacingBefore, ascentOverflow);
        const descentOverflow = maxDescent + this.baseLine - this.height;
        if (descentOverflow > 0)
            this.spacingAfter -= Math.min(this.spacingAfter, descentOverflow);
    }
    applySpacingBefore(value) {
        this.rollbackSpacingBefore();
        this.spacingBefore = value;
        this.height += this.getSpacingBefore();
        this.baseLine += this.getSpacingBefore();
    }
    rollbackSpacingBefore() {
        this.height = this.height - this.getSpacingBefore();
        this.baseLine = this.baseLine - this.getSpacingBefore();
        this.spacingBefore = 0;
    }
    applySpacingAfter(value) {
        this.rollbackSpacingAfter();
        this.spacingAfter = value;
        this.height += this.getSpacingAfter();
    }
    rollbackSpacingAfter() {
        this.height = Math.max(0, this.height - this.getSpacingAfter());
        this.spacingAfter = 0;
    }
    getSpacingBefore() {
        return this.spacingBefore || 0;
    }
    getSpacingAfter() {
        return this.spacingAfter || 0;
    }
    getLastVisibleBox() {
        var index = this.getLastVisibleBoxIndex();
        return index >= 0 ? this.boxes[index] : null;
    }
    getLastVisibleBoxIndex() {
        for (var lastBoxIndexInRow = this.boxes.length - 1, box; box = this.boxes[lastBoxIndexInRow]; lastBoxIndexInRow--)
            if (box.isVisible())
                return lastBoxIndexInRow;
        return -1;
    }
    static getParagraphSpacingBefore(paragraph, prevParagraph, isFirstRowInCell, isFirstCellInRow, isFirstRowInTable) {
        const parProps = paragraph.getParagraphMergedProperties();
        const spacingBefore = Math.abs(UnitConverter.twipsToPixelsF(parProps.spacingBefore));
        if (!spacingBefore || !prevParagraph)
            return spacingBefore;
        if (isFirstRowInCell && isFirstCellInRow && !isFirstRowInTable)
            return spacingBefore;
        if (parProps.contextualSpacing && paragraph.paragraphStyle.styleName == prevParagraph.paragraphStyle.styleName)
            return 0;
        if (isFirstRowInCell) {
            return spacingBefore;
        }
        else {
            const prevParProps = prevParagraph.getParagraphMergedProperties();
            const prevParSpacingAfter = UnitConverter.twipsToPixelsF(prevParProps.spacingAfter);
            return prevParSpacingAfter >= spacingBefore ? 0 : Math.abs(spacingBefore - prevParSpacingAfter);
        }
    }
    static getParagraphSpacingAfter(paragraph, nextParagraph) {
        const parProps = paragraph.getParagraphMergedProperties();
        const spacingAfter = Math.abs(UnitConverter.twipsToPixelsF(parProps.spacingAfter));
        if (!spacingAfter || !nextParagraph)
            return spacingAfter;
        return (parProps.contextualSpacing && paragraph.paragraphStyle.styleName == nextParagraph.paragraphStyle.styleName) ? 0 : spacingAfter;
    }
    applyXOffsetToBoxes(offset) {
        for (let box of this.boxes)
            box.x += offset;
        if (this.numberingListBox) {
            this.numberingListBox.textBox.x += offset;
            if (this.numberingListBox.separatorBox)
                this.numberingListBox.separatorBox.x += offset;
        }
    }
    getLastBoxIndexWhatCanStrikeoutAndUnderline() {
        let lastBoxIndexWhatCanStrikeoutAndUnderline = this.boxes.length - 1;
        for (let box; box = this.boxes[lastBoxIndexWhatCanStrikeoutAndUnderline]; lastBoxIndexWhatCanStrikeoutAndUnderline--)
            if (!box.renderNoStrikeoutAndNoUnderlineIfBoxInEndRow())
                break;
        return lastBoxIndexWhatCanStrikeoutAndUnderline;
    }
    containsSpacesOnly() {
        return this.boxes.length > 0 && ListUtils.allOf(this.boxes, val => val.isWhitespace());
    }
}
export class LayoutRowWithIndex extends LayoutRow {
}
