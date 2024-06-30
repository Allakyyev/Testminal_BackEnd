export class RowHeightState {
    constructor(maxBoxHeight, maxAscent, maxDescent, maxPictureBoxHeight) {
        this.maxBoxHeight = maxBoxHeight;
        this.maxAscent = maxAscent;
        this.maxDescent = maxDescent;
        this.maxPictureBoxHeight = maxPictureBoxHeight;
    }
    initFromRow(row) {
        this.height = row.height;
        this.baseLine = row.baseLine;
        this.spacingBefore = row.getSpacingBefore();
    }
    applyToRow(row) {
        row.rollbackSpacingBefore();
        row.applySpacingBefore(this.spacingBefore);
        row.height = this.height;
        row.baseLine = this.baseLine;
    }
    getFullRowHeight() {
        return this.height + this.spacingBefore;
    }
    equalHeights(obj) {
        return this.maxBoxHeight == obj.maxBoxHeight &&
            this.maxAscent == obj.maxAscent &&
            this.maxDescent == obj.maxDescent &&
            this.maxPictureBoxHeight == obj.maxPictureBoxHeight;
    }
}
