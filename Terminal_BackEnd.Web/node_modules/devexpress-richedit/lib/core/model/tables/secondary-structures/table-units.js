import { MathUtils } from '@devexpress/utils/lib/utils/math';
export class TableCustomUnit {
    getHashCode() {
        return MathUtils.somePrimes[0] * this.value ^
            MathUtils.somePrimes[1] * this.type;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.value == obj.value && this.type == obj.type;
    }
    copyFrom(obj) {
        this.value = obj.value;
        this.type = obj.type;
    }
}
export class TableWidthUnit extends TableCustomUnit {
    static createDefault() {
        return new TableWidthUnit().init(0, TableWidthUnitType.Nil);
    }
    static create(value, type) {
        return new TableWidthUnit().init(value, type);
    }
    init(value, type) {
        this.value = Math.floor(value);
        this.type = type;
        return this;
    }
    clone() {
        return new TableWidthUnit().init(this.value, this.type);
    }
    asNumberNoPercentType(converter) {
        switch (this.type) {
            case TableWidthUnitType.Nil:
            case TableWidthUnitType.Auto:
                return 0;
            case TableWidthUnitType.ModelUnits:
                return converter(this.value);
            case TableWidthUnitType.FiftiethsOfPercent:
                return 0;
        }
    }
    asNumber(avaliableWidth, converter) {
        switch (this.type) {
            case TableWidthUnitType.Nil:
            case TableWidthUnitType.Auto:
                return 0;
            case TableWidthUnitType.ModelUnits:
                return converter(this.value);
            case TableWidthUnitType.FiftiethsOfPercent:
                return avaliableWidth * this.value / TableWidthUnit.MAX_PERCENT_WIDTH;
        }
    }
    divide(n) {
        if (n > 1)
            this.value = Math.floor(this.value / n);
    }
}
TableWidthUnit.MAX_PERCENT_WIDTH = 5000;
TableWidthUnit.MUTLIPLIER_FOR_PERCENTS = 50;
export class TableHeightUnit extends TableCustomUnit {
    init(value, type) {
        this.value = Math.floor(value);
        this.type = type;
        return this;
    }
    clone() {
        return new TableHeightUnit().init(this.value, this.type);
    }
    static create(value, type) {
        return new TableHeightUnit().init(value, type);
    }
    static createDefault() {
        return new TableHeightUnit().init(0, TableHeightUnitType.Auto);
    }
}
export var TableHeightUnitType;
(function (TableHeightUnitType) {
    TableHeightUnitType[TableHeightUnitType["Minimum"] = 0] = "Minimum";
    TableHeightUnitType[TableHeightUnitType["Auto"] = 1] = "Auto";
    TableHeightUnitType[TableHeightUnitType["Exact"] = 2] = "Exact";
})(TableHeightUnitType || (TableHeightUnitType = {}));
export var TableWidthUnitType;
(function (TableWidthUnitType) {
    TableWidthUnitType[TableWidthUnitType["Nil"] = 0] = "Nil";
    TableWidthUnitType[TableWidthUnitType["Auto"] = 1] = "Auto";
    TableWidthUnitType[TableWidthUnitType["FiftiethsOfPercent"] = 2] = "FiftiethsOfPercent";
    TableWidthUnitType[TableWidthUnitType["ModelUnits"] = 3] = "ModelUnits";
})(TableWidthUnitType || (TableWidthUnitType = {}));
