import { TableBordersBase } from './table-border-base';
export class TableCellBorders extends TableBordersBase {
    equals(obj) {
        return super.equals(obj) &&
            this.topLeftDiagonalBorder.equals(obj.topLeftDiagonalBorder) &&
            this.topRightDiagonalBorder.equals(obj.topRightDiagonalBorder);
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.topLeftDiagonalBorder = obj.topLeftDiagonalBorder.clone();
        this.topRightDiagonalBorder = obj.topRightDiagonalBorder.clone();
    }
    clone() {
        var result = new TableCellBorders();
        result.copyFrom(this);
        return result;
    }
    static create(top, right, bottom, left, topLeftDiagonal, topRightDiagonal) {
        let result = new TableCellBorders();
        result.topBorder = top;
        result.rightBorder = right;
        result.bottomBorder = bottom;
        result.leftBorder = left;
        result.topLeftDiagonalBorder = topLeftDiagonal;
        result.topRightDiagonalBorder = topRightDiagonal;
        return result;
    }
}
