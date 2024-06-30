import { Flag } from '@devexpress/utils/lib/class/flag';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { DocumentLayoutDetailsLevel } from '../../layout/document-layout-details-level';
import { BookmarkBox, LayoutBookmarkBoxType } from '../../layout/main-structures/layout-boxes/bookmark-box';
import { AnchoredObjectLevelType } from '../../layout/main-structures/layout-boxes/layout-anchored-object-box';
import { LayoutBoxType } from '../../layout/main-structures/layout-boxes/layout-box';
import { LayoutRow, LayoutRowStateFlags } from '../../layout/main-structures/layout-row';
import { BoxAligner } from './utils/box-aligner';
export var RowFormatterResultFlag;
(function (RowFormatterResultFlag) {
    RowFormatterResultFlag[RowFormatterResultFlag["None"] = 0] = "None";
    RowFormatterResultFlag[RowFormatterResultFlag["NotEnoughChunks"] = 1] = "NotEnoughChunks";
})(RowFormatterResultFlag || (RowFormatterResultFlag = {}));
export var BoxBracketsType;
(function (BoxBracketsType) {
    BoxBracketsType[BoxBracketsType["None"] = 0] = "None";
    BoxBracketsType[BoxBracketsType["Open"] = 1] = "Open";
    BoxBracketsType[BoxBracketsType["Close"] = 2] = "Close";
})(BoxBracketsType || (BoxBracketsType = {}));
export class RowFormatterResult {
    constructor(rowFormatter, minY) {
        this.rowFormatter = rowFormatter;
        this.newAnchoredObjects = [];
        this.row = new LayoutRow(minY);
        this.startRowFormatting(true);
    }
    get rowStartPos() {
        return this.rowFormatter.rowSizesManager.rowStartPos;
    }
    startRowFormatting(deleteAnchoredObjects) {
        this.flags = new Flag(RowFormatterResultFlag.None);
        this.row.boxes = [];
        this.rowBoxIndexStart = 0;
        if (deleteAnchoredObjects)
            this.newAnchoredObjects = [];
    }
    finishLogicalRow(currLogicRowEndPos) {
        if (this.rowBoxIndexStart == this.row.boxes.length)
            return;
        this.rowFormatter.tabInfo.shiftBoxesAfterLastTab();
        const dontJustifyLinesEndingInSoftLineBreak = this.rowFormatter.manager.model.compatibilitySettings.dontJustifyLinesEndingInSoftLineBreak;
        BoxAligner.align(this.row, this.rowFormatter.paragraphProps.alignment, currLogicRowEndPos, this.rowBoxIndexStart, dontJustifyLinesEndingInSoftLineBreak);
        this.rowBoxIndexStart = this.row.boxes.length;
    }
    deleteSomeAnchorObjects(index, posToRestart) {
        this.newAnchoredObjects.splice(index);
        this.rowFormatter.iterator.setPosition(posToRestart, false, false);
    }
    finishRow() {
        this.finishLogicalRow(this.rowFormatter.rowSizesManager.rowFormattingInfo.lastNonEmptyInterval.end);
        const lastBoxOffset = ListUtils.last(this.row.boxes).rowOffset;
        for (let ind = 0, anc; anc = this.newAnchoredObjects[ind]; ind++) {
            if (anc.rowOffset > lastBoxOffset) {
                this.deleteSomeAnchorObjects(ind, anc.rowOffset);
                break;
            }
            if (anc.levelType == AnchoredObjectLevelType.InText) {
                this.deleteSomeAnchorObjects(ind + 1, anc.rowOffset + 1);
                break;
            }
        }
        const paragraphs = this.rowFormatter.subDocument.paragraphs;
        this.row.applySpacingAfter(this.row.flags.get(LayoutRowStateFlags.ParagraphEnd) ?
            LayoutRow.getParagraphSpacingAfter(paragraphs[this.paragraphIndex], paragraphs[this.paragraphIndex + 1]) :
            0);
        const rowStartPos = this.rowFormatter.rowSizesManager.rowStartPos;
        for (let box of this.row.boxes) {
            box.x -= this.row.x;
            box.rowOffset -= rowStartPos;
        }
        const rowLength = this.row.boxes.length ? ListUtils.last(this.row.boxes).getEndPosition() : 0;
        this.addBrackets(rowStartPos, rowLength);
        if (this.row.numberingListBox) {
            this.row.numberingListBox.textBox.x -= this.row.x;
            if (this.row.numberingListBox.separatorBox)
                this.row.numberingListBox.separatorBox.x -= this.row.x;
        }
        this.row.columnOffset = rowStartPos -
            this.rowFormatter.manager.activeFormatter.layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Column);
        const pictBox = this.onlyInlinePictureBox();
        if (pictBox && pictBox.width > this.row.width)
            this.row.width = pictBox.width;
        const currState = this.rowFormatter.rowSizesManager.heightCalculator.currState;
        this.row.increaseRowHeightFromSpacingBeforeAndAfter(currState.maxAscent, currState.maxDescent);
    }
    onlyInlinePictureBox() {
        let pictBox;
        for (let ind = this.row.boxes.length - 1; ind >= 0; ind--) {
            const box = this.row.boxes[ind];
            if (box.getType() == LayoutBoxType.Picture) {
                pictBox = box;
            }
            else if (!EnumUtils.isAnyOf(box.getType(), LayoutBoxType.ParagraphMark, LayoutBoxType.SectionMark, LayoutBoxType.LineBreak, LayoutBoxType.PageBreak)) {
                return null;
            }
        }
        return pictBox;
    }
    addBracketBox(boxType, color, x, layoutBox) {
        const box = new BookmarkBox(boxType);
        box.x = x - (boxType == LayoutBookmarkBoxType.EndBox ? BookmarkBox.DEFAULT_BORDER_WIDTH : 0);
        box.y = this.row.baseLine - layoutBox.getAscent() - this.row.getSpacingBefore();
        box.width = BookmarkBox.DEFAULT_WIDTH;
        box.height = layoutBox.height;
        box.color = color;
        this.row.bookmarkBoxes.push(box);
    }
    addBrackets(rowStartPos, rowLength) {
        if (!this.row.boxes[0])
            return;
        const rowEndPos = rowStartPos + rowLength;
        ListUtils.forEach(this.rowFormatter.iterator.getBracketInfo(rowStartPos, rowLength), (info) => {
            const posOfCharInRow = info.absPos - rowStartPos;
            const box = this.getBracketBox(posOfCharInRow);
            const xPos = this.getBracketXPosition(posOfCharInRow, box);
            if (info.flags.get(BoxBracketsType.Open) && info.absPos < rowEndPos)
                this.addBracketBox(LayoutBookmarkBoxType.StartBox, info.color, xPos, box);
            if (info.flags.get(BoxBracketsType.Close) &&
                (info.length != 0 && info.absPos > rowStartPos || info.length == 0 && info.absPos <= rowStartPos))
                this.addBracketBox(LayoutBookmarkBoxType.EndBox, info.color, xPos + (info.length == 0 ? BookmarkBox.DEFAULT_BORDER_WIDTH : 0), box);
        });
    }
    getBracketBox(posOfCharInRow) {
        const boxes = this.row.boxes;
        const boxIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(boxes, (b) => b.rowOffset, posOfCharInRow));
        return boxes[boxIndex];
    }
    getBracketXPosition(posOfCharInRow, box) {
        const charOffset = MathUtils.restrictValue(posOfCharInRow - box.rowOffset, 0, box.getLength());
        return box.x + box.getCharOffsetXInPixels(this.rowFormatter.manager.measurer, charOffset);
    }
}
