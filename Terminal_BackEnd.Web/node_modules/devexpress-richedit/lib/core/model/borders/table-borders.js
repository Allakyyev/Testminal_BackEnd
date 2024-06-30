import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { TableBordersBase } from './table-border-base';
export class TableBorders extends TableBordersBase {
    getHashCode() {
        return super.getHashCode() ^
            MathUtils.somePrimes[14] * this.insideHorizontalBorder.getHashCode() ^
            MathUtils.somePrimes[15] * this.insideVerticalBorder.getHashCode();
    }
    equals(obj) {
        return super.equals(obj) &&
            this.insideHorizontalBorder.equals(obj.insideHorizontalBorder) &&
            this.insideVerticalBorder.equals(obj.insideVerticalBorder);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.insideHorizontalBorder = obj.insideHorizontalBorder.clone();
        this.insideVerticalBorder = obj.insideVerticalBorder.clone();
    }
    clone() {
        var result = new TableBorders();
        result.copyFrom(this);
        return result;
    }
    static create(top, right, bottom, left, insideHorizontal, insideVertical) {
        let result = new TableBorders();
        result.topBorder = top;
        result.rightBorder = right;
        result.bottomBorder = bottom;
        result.leftBorder = left;
        result.insideHorizontalBorder = insideHorizontal;
        result.insideVerticalBorder = insideVertical;
        return result;
    }
}
