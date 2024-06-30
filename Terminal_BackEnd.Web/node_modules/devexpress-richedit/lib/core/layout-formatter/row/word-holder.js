export class WordHolderInfo {
    constructor(rowFormatter) {
        this.rowFormatter = rowFormatter;
        this.restart();
    }
    restart() {
        this.boxes = null;
    }
    addBox() {
        if (!this.boxes)
            this.boxes = [];
        const box = this.rowFormatter.currBox;
        this.boxes.push(box);
        this.rowFormatter.setBoxInfo(true);
    }
    pushBoxes() {
        if (!this.boxes)
            return true;
        if (!this.rowFormatter.rowSizesManager.addNumberingBoxes())
            return false;
        const res = this.rowFormatter.rowSizesManager.addFullWord(this.boxes);
        if (res === null || res === void 0 ? void 0 : res.isSuccess) {
            this.boxes = null;
            return true;
        }
        if (res == null)
            return false;
        if (this.rowFormatter.row.isEmpty()) {
            if (this.rowFormatter.rowSizesManager.rowFormattingInfo.isFloatingIntersectRow) {
                this.rowFormatter.rowSizesManager.rowFormattingInfo.findNextYPosWhatHasNeededSpace(res.requiredWidth);
                return this.pushBoxes();
            }
            const offset = this.rowFormatter.rowSizesManager.addWordByChars(this.boxes);
            this.rowFormatter.setPosition(offset, false, false);
        }
        else
            this.rowFormatter.setPosition(this.boxes[0].rowOffset, false, false);
        this.rowFormatter.rowSizesManager.finishLogicalRow(this.rowFormatter.rowSizesManager.rowFormattingInfo.currIndex + 1, this.rowFormatter.rowSizesManager.rowFormattingInfo.currInterval.end);
        this.rowFormatter.finishRow();
        this.boxes = null;
        return false;
    }
}
