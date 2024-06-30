export class LayoutTableBorder {
    constructor(xPos, yPos, length, borderInfo) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.length = length;
        this.borderInfo = borderInfo;
    }
    clone() {
        return new LayoutTableBorder(this.xPos, this.yPos, this.length, this.borderInfo.clone());
    }
    copyFrom(obj) {
        this.xPos = obj.xPos;
        this.yPos = obj.yPos;
        this.length = obj.length;
        this.borderInfo = obj.borderInfo.clone();
    }
    canCombineVertical(border) {
        return Math.abs(this.xPos - border.xPos) < 2 && Math.abs(this.yPos + this.length - border.yPos) < 2 && this.borderInfo.equals(border.borderInfo);
    }
}
export class LayoutCursorHorizontalTableBorder extends LayoutTableBorder {
    constructor(xPos, yPos, length, borderInfo, layoutRowIndex) {
        super(xPos, yPos, length, borderInfo);
        this.layoutRowIndex = layoutRowIndex;
    }
    clone() {
        return new LayoutCursorHorizontalTableBorder(this.xPos, this.yPos, this.length, this.borderInfo.clone(), this.layoutRowIndex);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.layoutRowIndex = obj.layoutRowIndex;
    }
    canCombine(border) {
        let limitX = Math.abs(this.xPos + this.length - border.xPos);
        let limitY = Math.abs(this.yPos - border.yPos);
        return limitX < 3 && limitY < 3 && this.layoutRowIndex == border.layoutRowIndex;
    }
}
export class LayoutCursorVerticalTableBorder extends LayoutTableBorder {
    clone() {
        return new LayoutCursorVerticalTableBorder(this.xPos, this.yPos, this.length, this.borderInfo.clone());
    }
    copyFrom(obj) {
        super.copyFrom(obj);
    }
}
