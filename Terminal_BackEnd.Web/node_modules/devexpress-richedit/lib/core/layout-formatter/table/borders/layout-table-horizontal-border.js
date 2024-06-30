import { LayoutTableBorder } from './layout-table-border';
export class LayoutTableHorizontalBorder {
    clone() {
        const result = new LayoutTableHorizontalBorder();
        result.copyFrom(this);
        return result;
    }
    copyFrom(obj) {
        this.length = obj.length;
        this.xPosition = obj.xPosition;
        this.borderInfo = obj.borderInfo.clone();
    }
    getLayoutTableBorder(line) {
        return new LayoutTableBorder(this.xPosition, line.yPosition - (line.isOffsetFromTop ? 0 : this.borderInfo.width), this.length, this.borderInfo);
    }
}
