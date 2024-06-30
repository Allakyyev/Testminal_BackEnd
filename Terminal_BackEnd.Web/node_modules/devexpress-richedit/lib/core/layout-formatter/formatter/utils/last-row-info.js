import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { LayoutRowStateFlags } from '../../../layout/main-structures/layout-row';
export class LastRowInfo {
    constructor(paragraphs) {
        this._row = null;
        this._startPosition = 0;
        this._paragraphIndex = -1;
        this.paragraphs = paragraphs;
    }
    reset(rowFormatter) {
        this._row = null;
        this._startPosition = rowFormatter.getPosition();
        this._paragraphIndex = -1;
        this.isParIndexSet = true;
    }
    recalculateParagraphIndex(now) {
        this.isParIndexSet = false;
        if (now)
            this.calculateParagraphIndex();
    }
    setRowInfo(row, columnFullOffset, isNowRecalcParIndex) {
        this._row = row;
        this._startPosition = columnFullOffset + row.columnOffset;
        this.recalculateParagraphIndex(isNowRecalcParIndex);
    }
    setFullRowInfo(row, rowStartPos, parIndex) {
        this._row = row;
        this._startPosition = rowStartPos;
        this._paragraphIndex = parIndex;
        this.isParIndexSet = true;
    }
    setFullRowInfoAndCalculateParagraph(row, rowStartPos, calcImmediately) {
        this._row = row;
        this._startPosition = rowStartPos;
        this.recalculateParagraphIndex(calcImmediately);
    }
    get row() {
        return this._row;
    }
    get startPosition() {
        return this._startPosition;
    }
    get paragraphIndex() {
        if (!this.isParIndexSet)
            this.calculateParagraphIndex();
        return this._paragraphIndex;
    }
    calculateParagraphIndex() {
        this._paragraphIndex = SearchUtils.normedInterpolationIndexOf(this.paragraphs, (p) => p.startLogPosition.value, this._startPosition);
        this.isParIndexSet = true;
    }
    isNextRowFirstInParagraph() {
        return !this._row || this._row.flags.get(LayoutRowStateFlags.ParagraphEnd);
    }
}
