import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { TableWidthUnitType } from '../../../../model/tables/secondary-structures/table-units';
import { Columns } from '../columns';
import { GridColumnBase } from './column-interval';
import { Calculator } from './column-width-engine/calculator';
export class GridCalculator {
    constructor(grid, cache, boxIterator, avaliableSpacing) {
        this.accuracy = 8;
        this.maxPercentWidth = 5000;
        this.grid = grid;
        this.cache = cache;
        this.boxIterator = boxIterator;
        this.maxTableWidth = avaliableSpacing;
        this.percentBaseWidth = Math.max(0, avaliableSpacing - this.currCache.indent.asNumberNoPercentType(UnitConverter.twipsToPixelsF));
        const intervals = Calculator.getIntervals(this.table);
        if (ListUtils.unsafeAnyOf(intervals, (c) => c.colSpan != 1))
            throw new Error(Errors.InternalException);
        this.columns = ListUtils.map(intervals, this.makeInterval);
        this.applyCellsWidth(intervals);
        this.autofitTable();
    }
    get table() { return this.grid.table; }
    get currCache() { return this.cache[this.table.index]; }
    get subDocument() { return this.boxIterator.subDocument; }
    convertTableWidthUnitToTwips(value) {
        if (value.type == TableWidthUnitType.ModelUnits)
            return value.value;
        if (value.type == TableWidthUnitType.FiftiethsOfPercent)
            return value.value * UnitConverter.pixelsToTwipsF(this.percentBaseWidth) / this.maxPercentWidth;
        return 0;
    }
    getFixedTableWidthInTwips() {
        if (this.currCache.preferredWidth.type == TableWidthUnitType.FiftiethsOfPercent)
            return this.convertTableWidthUnitToTwips(this.currCache.indent) + this.convertTableWidthUnitToTwips(this.currCache.preferredWidth);
        return this.convertTableWidthUnitToTwips(this.currCache.preferredWidth);
    }
    calculateEstimatedTableWidth() {
        let count = this.columns.length;
        let result = 0;
        let totalPercentWidth = 0;
        let totalNoPercentWidth = 0;
        for (let i = 0; i < count; i++) {
            const column = this.columns[i];
            const contentWidth = Math.max(column.bounds.maxElement, column.bounds.minElement);
            if (column.isPercentBased && column.percentValue > 0) {
                result = Math.max(contentWidth * this.maxPercentWidth / column.percentValue, result);
                totalPercentWidth += column.percentValue;
            }
            else {
                totalNoPercentWidth += contentWidth;
            }
        }
        if (totalNoPercentWidth == 0 && totalPercentWidth > 0)
            return result;
        const restTotalPercent = this.maxPercentWidth - totalPercentWidth;
        if (restTotalPercent <= 0)
            return this.maxTableWidth;
        result = Math.max(totalNoPercentWidth * this.maxPercentWidth / restTotalPercent, result);
        return Math.min(result, this.maxTableWidth);
    }
    getColumns() {
        return new Columns(this.columns);
    }
    autofitTable() {
        const estimatedTableWidth = this.currCache.isFixedTableWidth
            ? UnitConverter.twipsToPixelsF(this.getFixedTableWidthInTwips()) : this.calculateEstimatedTableWidth();
        let count = this.columns.length;
        let restEstimatedWidth = estimatedTableWidth;
        let totalMaxWidthNoSet = 0;
        let totalMinWidthNoSet = 0;
        let totalModelUnit = 0;
        let totalMinWidthModelUnit = 0;
        let totalPercent = 0;
        for (let i = 0; i < count; i++) {
            const column = this.columns[i];
            if (column.isPercentBased && column.percentValue > 0) {
                totalPercent += column.percentValue;
            }
            else if (!column.isPercentBased && column.preferredWidth > 0) {
                totalModelUnit += column.preferredWidth;
                totalMinWidthModelUnit += column.bounds.minElement;
            }
            else {
                totalMaxWidthNoSet += column.bounds.maxElement;
                totalMinWidthNoSet += column.bounds.minElement;
            }
        }
        restEstimatedWidth = this.autofitPercentWidthColumns(estimatedTableWidth, totalPercent, totalModelUnit != 0 || totalMinWidthNoSet != 0);
        restEstimatedWidth = this.autofitModelUnitWidthColumns(restEstimatedWidth, totalModelUnit, totalMinWidthModelUnit, totalMinWidthNoSet);
        this.autofitNoSetWidthColumns(restEstimatedWidth, totalMinWidthNoSet, totalMaxWidthNoSet);
        for (let i = 0; i < count; i++) {
            const column = this.columns[i];
            column.width = Math.max(column.width, column.bounds.minElement);
        }
        this.autofitTail(GridColumnBase.totalWidth(this.columns), estimatedTableWidth);
    }
    autofitNoSetWidthColumns(restEstimatedWidth, totalMinWidthNoSet, totalMaxWidthNoSet) {
        if (restEstimatedWidth > 0) {
            const overflow = totalMaxWidthNoSet - restEstimatedWidth;
            const restWidthForCompress = totalMaxWidthNoSet - totalMinWidthNoSet;
            if (overflow > 0 && restWidthForCompress > overflow)
                this.compressWidthProportionallyOfDifferenceMaxAndMinWidth(overflow, restWidthForCompress, (column) => column.isPercentBased || column.preferredWidth > 0);
            else
                this.enlargeWidthProportionallyMaxWidth(totalMaxWidthNoSet, restEstimatedWidth, (column) => !column.isPercentBased && column.preferredWidth == 0);
        }
    }
    compressWidthProportionallyOfDifferenceMaxAndMinWidth(totalDelta, rest, condition) {
        for (let i = this.columns.length - 1; i >= 0 && totalDelta > 0 && rest > 0; i--) {
            const column = this.columns[i];
            if (condition(column))
                continue;
            const delta = (column.bounds.maxElement - column.bounds.minElement) * totalDelta / rest;
            column.width = column.bounds.maxElement - delta;
            rest -= column.bounds.maxElement - column.bounds.minElement;
            totalDelta -= delta;
        }
    }
    autofitPercentWidthColumns(estimatedTableWidth, totalPercent, hasOtherTypeColumns) {
        if (totalPercent <= 0)
            return estimatedTableWidth;
        let restTotalPercent = Math.min(this.maxPercentWidth, totalPercent);
        let restEstimatedWidth = estimatedTableWidth;
        if (hasOtherTypeColumns)
            restTotalPercent = this.maxPercentWidth;
        ListUtils.forEach(this.columns, (column) => {
            const columnPercentValue = Math.min(restTotalPercent, column.percentValue);
            if (column.percentValue && column.percentValue > 0 && restTotalPercent > 0) {
                column.width = Math.max(restEstimatedWidth * columnPercentValue / restTotalPercent, column.bounds.minElement);
                restEstimatedWidth -= column.width;
                restTotalPercent -= columnPercentValue;
            }
        });
        return restEstimatedWidth;
    }
    autofitModelUnitWidthColumns(restEstimatedWidth, totalModelUnit, totalMinWidthModelUnit, totalMinWidthNoSet) {
        if (totalModelUnit <= 0)
            return restEstimatedWidth;
        if (restEstimatedWidth > 0) {
            const overflow = totalModelUnit - restEstimatedWidth + totalMinWidthNoSet;
            const restWidthForCompress = totalModelUnit - totalMinWidthModelUnit;
            if (overflow > 0 && restWidthForCompress > overflow)
                this.compressWidthProportionallyOfDifferencePreferredWidthAndMinWidth(overflow, restWidthForCompress, true);
            else if (totalMinWidthNoSet != 0)
                this.applyPrefferedWidth();
            else
                this.enlargeWidthProportionallyMaxWidth(totalModelUnit, restEstimatedWidth, (column) => !column.isPercentBased && column.preferredWidth > 0);
        }
        return restEstimatedWidth - totalModelUnit;
    }
    applyPrefferedWidth() {
        ListUtils.forEach(this.columns, (column) => {
            if (!column.isPercentBased && column.preferredWidth > 0)
                column.width = column.preferredWidth;
        });
    }
    compressWidthProportionallyOfDifferencePreferredWidthAndMinWidth(totalDelta, rest, ignorePercent = false) {
        for (let i = this.columns.length - 1; i >= 0 && totalDelta > 0 && rest > 0; i--) {
            const column = this.columns[i];
            if (column.preferredWidth > 0 && (!ignorePercent || !column.isPercentBased)) {
                const delta = (column.preferredWidth - column.bounds.minElement) * totalDelta / rest;
                column.width = Math.max(column.preferredWidth - delta, GridCalculator.minColumnWidth);
                rest -= column.preferredWidth - column.bounds.minElement;
                totalDelta -= delta;
            }
        }
    }
    enlargeWidthProportionallyMaxWidth(totalMaxWidth, rest, condition) {
        ListUtils.forEach(this.columns, (column) => {
            if (condition(column) && totalMaxWidth > 0) {
                column.width = rest * column.bounds.maxElement / totalMaxWidth;
                rest -= column.width;
                totalMaxWidth -= column.bounds.maxElement;
            }
        });
    }
    compressTableGrid(newTableWidth) {
        const startIndex = 0;
        const endIndex = this.columns.length - 1;
        const deltas = [];
        let deltasTotalWidth = 0;
        let initialTableWidth = 0;
        for (let i = startIndex; i <= endIndex; i++) {
            initialTableWidth += this.columns[i].width;
            const delta = Math.max(this.columns[i].width - this.columns[i].bounds.minElement, 0);
            deltas.push(delta);
            deltasTotalWidth += delta;
        }
        const deltaTableWidth = initialTableWidth - newTableWidth;
        if (deltasTotalWidth > deltaTableWidth)
            this.compressProportionallyWidthCore(deltas, deltasTotalWidth, deltaTableWidth);
        else {
            for (let i = startIndex; i <= endIndex; i++)
                this.columns[i].width -= deltas[i];
            this.changeColumnsProportionally(startIndex, endIndex, initialTableWidth - deltasTotalWidth, newTableWidth);
        }
    }
    compressProportionallyWidthCore(items, totalItemsWidth, deltaTableWidth) {
        const colCount = this.columns.length;
        if (totalItemsWidth == 0) {
            let rest = deltaTableWidth;
            totalItemsWidth = colCount;
            for (let i = 0; i < colCount; i++) {
                const delta = (i != colCount - 1) ? deltaTableWidth / totalItemsWidth : rest;
                this.columns[i].width = Math.max(this.columns[i].width - delta, 0);
                rest -= delta;
            }
            return;
        }
        for (let i = 0; i < colCount; i++) {
            const delta = deltaTableWidth * items[i] / totalItemsWidth;
            this.columns[i].width -= delta;
            deltaTableWidth -= delta;
            totalItemsWidth -= items[i];
            if (totalItemsWidth == 0) {
                break;
            }
        }
    }
    changeColumnsProportionally(startIndex, endIndex, initialWidth, newWidth) {
        const deltaTableWidth = Math.abs(newWidth - initialWidth);
        let rest = deltaTableWidth;
        for (let i = startIndex; i <= endIndex; i++) {
            const delta = (i != endIndex) ? this.columns[i].width * deltaTableWidth / initialWidth : rest;
            if (initialWidth > newWidth)
                this.columns[i].width = Math.max(GridCalculator.minColumnWidth, this.columns[i].width - delta);
            else
                this.columns[i].width += delta;
            rest -= delta;
        }
    }
}
GridCalculator.minColumnWidth = UnitConverter.twipsToPixelsF(1);
