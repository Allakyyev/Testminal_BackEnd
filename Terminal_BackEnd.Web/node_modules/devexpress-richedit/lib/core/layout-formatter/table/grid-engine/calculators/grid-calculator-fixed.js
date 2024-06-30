import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { TableWidthUnitType } from '../../../../model/tables/secondary-structures/table-units';
import { ColumnIntervalFixed } from './column-interval';
import { GridCalculator } from './grid-calculator';
export class GridCalculatorFixed extends GridCalculator {
    makeInterval(interval) {
        return new ColumnIntervalFixed(interval);
    }
    autofitTail(totalWidth, estimatedTableWidth) {
        if (totalWidth.toFixed(this.accuracy) > estimatedTableWidth.toFixed(this.accuracy))
            this.compressTableGrid(estimatedTableWidth);
    }
    applyCellsWidth(intervals) {
        let totalPercentWidth = 0;
        let totalModelUnitWidth = 0;
        let unsetCount = 0;
        for (let i = 0; i < intervals.length; i++) {
            const interval = intervals[i];
            switch (interval.type) {
                case TableWidthUnitType.FiftiethsOfPercent:
                    totalPercentWidth += interval.width;
                    if (totalPercentWidth > this.maxPercentWidth) {
                        interval.width = Math.max(0, this.maxPercentWidth - totalPercentWidth + interval.width);
                        totalPercentWidth = this.maxPercentWidth;
                    }
                    break;
                case TableWidthUnitType.ModelUnits:
                    totalModelUnitWidth += interval.width;
                    break;
                case TableWidthUnitType.Auto:
                case TableWidthUnitType.Nil:
                    unsetCount++;
                    break;
            }
        }
        let tableWidth = this.getFixedTableWidthInTwips();
        let totalPercentWidthInModelUnit = tableWidth;
        if (totalModelUnitWidth != 0 || unsetCount != 0)
            totalPercentWidthInModelUnit = tableWidth * totalPercentWidth / this.maxPercentWidth;
        let restModelUnitWidth = tableWidth;
        if (totalPercentWidthInModelUnit > 0)
            restModelUnitWidth = Math.min(tableWidth - totalPercentWidthInModelUnit, totalModelUnitWidth);
        let restForUnsetColumns = tableWidth - totalModelUnitWidth - totalPercentWidthInModelUnit;
        for (let i = 0; i < intervals.length; i++) {
            const gridColumn = this.columns[i];
            const interval = intervals[i];
            let width = 0;
            switch (interval.type) {
                case TableWidthUnitType.FiftiethsOfPercent:
                    gridColumn.type = TableWidthUnitType.FiftiethsOfPercent;
                    gridColumn.percentValue = interval.width;
                    width = totalPercentWidthInModelUnit * interval.width / totalPercentWidth;
                    break;
                case TableWidthUnitType.ModelUnits:
                    if (interval.width > 0) {
                        width = restModelUnitWidth * interval.width / totalModelUnitWidth;
                        restModelUnitWidth -= width;
                        totalModelUnitWidth -= interval.width;
                    }
                    break;
                case TableWidthUnitType.Auto:
                case TableWidthUnitType.Nil:
                    width = restForUnsetColumns / unsetCount;
                    restForUnsetColumns -= width;
                    unsetCount--;
                    break;
            }
            width = Math.max(GridCalculator.minColumnWidth, width);
            width = UnitConverter.twipsToPixelsF(width);
            gridColumn.updateMinBound(width);
            gridColumn.updateMaxBound(width);
        }
    }
}
