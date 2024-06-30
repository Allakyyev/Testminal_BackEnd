import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { TableWidthUnitType } from '../../../../model/tables/secondary-structures/table-units';
export class GridColumnBase {
    constructor(interval) {
        this.width = interval.type == TableWidthUnitType.ModelUnits ? UnitConverter.twipsToPixelsF(interval.width) : interval.width;
        this.type = interval.type;
        this.percentValue = 0;
        this.preferredWidth = 0;
        this.bounds = new MinMaxNumber(0, 0);
    }
    get isPercentBased() {
        return this.type == TableWidthUnitType.FiftiethsOfPercent;
    }
    updateMinBound(val) {
        if (val > this.bounds.minElement)
            this.bounds.minElement = val;
    }
    updateMaxBound(val) {
        if (val > this.bounds.maxElement)
            this.bounds.maxElement = val;
    }
    static totalMinWidth(columns, startColumnIndex = 0, endColumnIndex = columns.length) {
        let result = 0;
        for (let columnIndex = startColumnIndex; columnIndex < endColumnIndex; columnIndex++)
            result += columns[columnIndex].bounds.minElement;
        return result;
    }
    static totalMaxWidth(columns, startColumnIndex = 0, endColumnIndex = columns.length) {
        let result = 0;
        for (let columnIndex = startColumnIndex; columnIndex < endColumnIndex; columnIndex++)
            result += columns[columnIndex].bounds.maxElement;
        return result;
    }
    static totalWidth(columns, startColumnIndex = 0, endColumnIndex = columns.length) {
        let result = 0;
        for (let columnIndex = startColumnIndex; columnIndex < endColumnIndex; columnIndex++)
            result += columns[columnIndex].width;
        return result;
    }
    static totalPercentWidth(columns, startColumnIndex = 0, endColumnIndex = columns.length) {
        let result = 0;
        for (let columnIndex = startColumnIndex; columnIndex < endColumnIndex; columnIndex++)
            result += columns[columnIndex].percentValue;
        return result;
    }
    static totalPreferredWidth(columns, startColumnIndex = 0, endColumnIndex = columns.length) {
        let result = 0;
        for (let columnIndex = startColumnIndex; columnIndex < endColumnIndex; columnIndex++)
            result += columns[columnIndex].preferredWidth;
        return result;
    }
    static getLastDXAColumnIndex(columns, startColumnIndex = 0, endColumnIndex = columns.length) {
        for (let columnIndex = endColumnIndex - 1; columnIndex >= startColumnIndex; columnIndex--)
            if (columns[columnIndex].preferredWidth)
                return columnIndex;
        return -1;
    }
}
export class ColumnIntervalFixed extends GridColumnBase {
}
export class ColumnIntervalAuto extends GridColumnBase {
    constructor(interval) {
        super(interval);
        this.totalHorizontalMargins = 0;
    }
    static totalHorizontalMargins(columns, startColumnIndex, endColumnIndex) {
        let result = 0;
        for (let columnIndex = startColumnIndex; columnIndex < endColumnIndex; columnIndex++)
            result += columns[columnIndex].totalHorizontalMargins;
        return result;
    }
    static hasColumnsWithoutPreferredWidth(columns, startColumnIndex = 0, endColumnIndex = columns.length) {
        for (let columnIndex = startColumnIndex; columnIndex < endColumnIndex; columnIndex++)
            if (!columns[columnIndex].preferredWidth)
                return true;
        return false;
    }
}
