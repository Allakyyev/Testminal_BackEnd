export class ValueInfo {
    constructor(unit = '', value) {
        this.unit = unit;
        this.isValidNumber = value !== undefined;
        if (this.isValidNumber)
            this.value = value;
    }
    get isEmpty() { return this.equals(ValueInfo.empty); }
    equals(obj) {
        return obj &&
            obj.isValidNumber == this.isValidNumber &&
            obj.value == this.value &&
            obj.unit == this.unit;
    }
}
ValueInfo.empty = new ValueInfo();
