import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
export class TopAndBottomMarginsForRow {
    constructor() {
        this.topMargin = 0;
        this.bottomMargin = 0;
    }
    addCellTopMargin(topMargin) {
        if (this.topMargin < topMargin)
            this.topMargin = topMargin;
    }
    addCellBottomMargin(bottomMargin) {
        if (this.bottomMargin < bottomMargin)
            this.bottomMargin = bottomMargin;
    }
    sumOfBoth() {
        return this.topMargin + this.bottomMargin;
    }
}
export class TableRowHeightInfo {
    constructor(cantSplit, height, horizontalAlignment) {
        this.cantSplit = cantSplit;
        this.preferredHeightValue = UnitConverter.twipsToPixelsF(height.value);
        this.preferredHeightType = height.type;
        this.contentHeight = 0;
        this.horizontalAlignment = horizontalAlignment;
    }
}
