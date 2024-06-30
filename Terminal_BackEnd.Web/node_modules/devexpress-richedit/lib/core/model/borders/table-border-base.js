import { MathUtils } from '@devexpress/utils/lib/utils/math';
export class TableBordersBase {
    getHashCode() {
        return MathUtils.somePrimes[10] * this.topBorder.getHashCode() ^
            MathUtils.somePrimes[11] * this.rightBorder.getHashCode() ^
            MathUtils.somePrimes[12] * this.bottomBorder.getHashCode() ^
            MathUtils.somePrimes[13] * this.leftBorder.getHashCode();
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.bottomBorder.equals(obj.bottomBorder) &&
            this.leftBorder.equals(obj.leftBorder) &&
            this.rightBorder.equals(obj.rightBorder) &&
            this.topBorder.equals(obj.topBorder);
    }
    copyFrom(obj) {
        this.bottomBorder = obj.bottomBorder.clone();
        this.leftBorder = obj.leftBorder.clone();
        this.rightBorder = obj.rightBorder.clone();
        this.topBorder = obj.topBorder.clone();
    }
}
