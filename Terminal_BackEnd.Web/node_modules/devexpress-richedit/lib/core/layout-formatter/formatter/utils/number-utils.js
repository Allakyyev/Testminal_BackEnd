export class NumberUtils {
    static areClose(num1, num2) {
        const delta = num1 - num2;
        return delta == 0 || Math.abs(delta) < this.epsilon;
    }
    static lessThan(num1, num2) {
        return (num1 < num2) && !this.areClose(num1, num2);
    }
    static greaterThan(num1, num2) {
        return (num1 > num2) && !this.areClose(num1, num2);
    }
}
NumberUtils.epsilon = 0.00000153;
