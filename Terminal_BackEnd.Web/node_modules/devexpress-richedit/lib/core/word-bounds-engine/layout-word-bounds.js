import { LayoutWordBoundsNextGroupSeparator, LayoutWordBoundsPrevGroupSeparator } from './layout-word-bounds-group-separator';
import { LayoutWordEndBoundsIterator } from './word-bounds-iterators/layout/layout-word-end-bounds-iterator';
import { LayoutWordStartBoundsIterator } from './word-bounds-iterators/layout/layout-word-start-bounds-iterator';
export var WordGroupMask;
(function (WordGroupMask) {
    WordGroupMask[WordGroupMask["NoOne"] = 0] = "NoOne";
    WordGroupMask[WordGroupMask["Space"] = 1] = "Space";
    WordGroupMask[WordGroupMask["LeftSingleQuote"] = 2] = "LeftSingleQuote";
    WordGroupMask[WordGroupMask["RightSingleQuote"] = 4] = "RightSingleQuote";
    WordGroupMask[WordGroupMask["LeftDoubleQuote"] = 8] = "LeftDoubleQuote";
    WordGroupMask[WordGroupMask["RightDoubleQuote"] = 16] = "RightDoubleQuote";
    WordGroupMask[WordGroupMask["DoubleQuote"] = 32] = "DoubleQuote";
    WordGroupMask[WordGroupMask["PunctuationMark"] = 64] = "PunctuationMark";
    WordGroupMask[WordGroupMask["DiffersFromAll"] = 128] = "DiffersFromAll";
    WordGroupMask[WordGroupMask["Others"] = 256] = "Others";
})(WordGroupMask || (WordGroupMask = {}));
export class LayoutWordBounds {
    constructor(groupSeparator) {
        this.prevSymbolStartPos = -1;
        this.groupSeparator = groupSeparator;
    }
    static getLayoutWordStartBound(layout, subDocument, selection, startPosition) {
        return new LayoutStartWordBound().getBound(new LayoutWordStartBoundsIterator(layout, subDocument, selection, startPosition));
    }
    static getLayoutWordEndBound(layout, subDocument, selection, startPosition, isJoinSpacesOnEndWord) {
        return new LayoutEndWordBound(isJoinSpacesOnEndWord).getBound(new LayoutWordEndBoundsIterator(layout, subDocument, selection, startPosition));
    }
    getBound(iterator) {
        this.iterator = iterator;
        if (!this.iterator.isSet())
            return this.iterator.startResultPosition;
        while (this.iterator.getNextSymbolGroup()) {
            if (this.groupSeparator.applyMask(this.iterator.groupMask))
                return this.getFinalPosition(true);
            this.prevSymbolStartPos = this.iterator.currSymbolStartPosition();
        }
        return this.getFinalPosition(false);
    }
}
export class LayoutEndWordBound extends LayoutWordBounds {
    constructor(isJoinSpacesOnEndWord) {
        super(new LayoutWordBoundsNextGroupSeparator(isJoinSpacesOnEndWord));
    }
    getFinalPosition(byGroupDiffers) {
        return this.prevSymbolStartPos + (byGroupDiffers ? 1 : 0);
    }
}
export class LayoutStartWordBound extends LayoutWordBounds {
    constructor() {
        super(new LayoutWordBoundsPrevGroupSeparator());
    }
    getFinalPosition(_byGroupDiffers) {
        return this.iterator.currSymbolStartPosition() + 1;
    }
}
