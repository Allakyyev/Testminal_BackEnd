export class HorizontalLineBordersInfo {
    constructor(isOffsetFromTop) {
        this.borders = [];
        this.maxWidth = 0;
        this.isOffsetFromTop = isOffsetFromTop;
    }
    updateWidth(width) {
        if (width > this.maxWidth)
            this.maxWidth = width;
    }
    clone() {
        const result = new HorizontalLineBordersInfo(this.isOffsetFromTop);
        result.copyFrom(this);
        return result;
    }
    copyFrom(obj) {
        this.isOffsetFromTop = obj.isOffsetFromTop;
        this.yPosition = obj.yPosition;
        this.maxWidth = obj.maxWidth;
        this.borders = [];
        for (let brd of this.borders)
            this.borders.push(brd.clone());
    }
}
