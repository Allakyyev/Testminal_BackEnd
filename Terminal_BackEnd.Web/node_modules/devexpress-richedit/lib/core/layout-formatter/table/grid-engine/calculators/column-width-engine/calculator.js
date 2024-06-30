import { TableWidthUnitType } from '../../../../../model/tables/secondary-structures/table-units';
import { ColumnInterval } from './column-interval';
import { ColumnIntervalWidthIterator } from './iterator';
export class Calculator {
    static getIntervals(table) {
        const rows = table.rows;
        let currRowTableGrid = Calculator.columnsInfo(rows[0]);
        for (let nextRowIndex = 1, nextRow; nextRow = rows[nextRowIndex]; nextRowIndex++) {
            const nextRowTableGrid = Calculator.columnsInfo(nextRow);
            currRowTableGrid = Calculator.mergeRowColumnIntervals(currRowTableGrid, nextRowTableGrid);
        }
        return currRowTableGrid;
    }
    static columnsInfo(row) {
        const columns = [];
        if (row.gridBefore > 0)
            columns.push(new ColumnInterval(row.widthBefore.value, row.gridBefore, row.widthBefore.type));
        for (let cell of row.cells) {
            const cellPreferredWidth = cell.preferredWidth;
            columns.push(new ColumnInterval(cellPreferredWidth.value, cell.columnSpan, cellPreferredWidth.type));
        }
        if (row.gridAfter > 0)
            columns.push(new ColumnInterval(row.widthAfter.value, row.gridAfter, row.widthAfter.type));
        return columns;
    }
    static mergeRowColumnIntervals(currRowTableGrid, nextRowTableGrid) {
        const mergedTableGrid = [];
        const currRowIterator = new ColumnIntervalWidthIterator(currRowTableGrid);
        const nextRowIterator = new ColumnIntervalWidthIterator(nextRowTableGrid);
        while (!currRowIterator.endOfIntervals() && !nextRowIterator.endOfIntervals()) {
            const currIntervalSpan = currRowIterator.interval.colSpan;
            const nextIntervalSpan = nextRowIterator.interval.colSpan;
            if (currIntervalSpan > nextIntervalSpan)
                Calculator.processDependedIntervals(currRowIterator, nextRowIterator, mergedTableGrid);
            else if (nextIntervalSpan > currIntervalSpan)
                Calculator.processDependedIntervals(nextRowIterator, currRowIterator, mergedTableGrid);
            else {
                const newInterval = Calculator.mergeIntervalsDifferentRows(currRowIterator.interval, nextRowIterator.interval);
                mergedTableGrid.push(newInterval);
                currRowIterator.advance(newInterval);
                nextRowIterator.advance(newInterval);
            }
        }
        Calculator.copyRestIntervals(currRowIterator, mergedTableGrid);
        Calculator.copyRestIntervals(nextRowIterator, mergedTableGrid);
        return mergedTableGrid;
    }
    static mergeIntervalsDifferentRows(currRowTableColumnInterval, nextRowTableColumnInterval) {
        const colSpan = currRowTableColumnInterval.colSpan;
        if (currRowTableColumnInterval.type == nextRowTableColumnInterval.type)
            return new ColumnInterval(Math.max(currRowTableColumnInterval.width, nextRowTableColumnInterval.width), colSpan, currRowTableColumnInterval.type);
        if (currRowTableColumnInterval.type == TableWidthUnitType.FiftiethsOfPercent)
            return Calculator.mergeIntervalsDifferentRowsDifferentTypes(currRowTableColumnInterval, nextRowTableColumnInterval, colSpan);
        if (nextRowTableColumnInterval.type == TableWidthUnitType.FiftiethsOfPercent)
            return Calculator.mergeIntervalsDifferentRowsDifferentTypes(nextRowTableColumnInterval, currRowTableColumnInterval, colSpan);
        if (currRowTableColumnInterval.type == TableWidthUnitType.ModelUnits)
            return new ColumnInterval(currRowTableColumnInterval.width, colSpan, TableWidthUnitType.ModelUnits);
        return new ColumnInterval(nextRowTableColumnInterval.width, colSpan, TableWidthUnitType.ModelUnits);
    }
    static mergeIntervalsDifferentRowsDifferentTypes(percentBasedInterval, anotherBasedInterval, colSpan) {
        return anotherBasedInterval.width > 0 ?
            new ColumnInterval(anotherBasedInterval.width, colSpan, anotherBasedInterval.type) :
            new ColumnInterval(percentBasedInterval.width, colSpan, percentBasedInterval.type);
    }
    static copyRestIntervals(iterator, to) {
        while (!iterator.endOfIntervals()) {
            to.push(iterator.interval);
            iterator.advance(iterator.interval);
        }
    }
    static processDependedIntervals(masterIterator, slaveIterator, mergedRowsIntervals) {
        const deferredTableGrid = [];
        let autoSizeIntervalsCount = 0;
        let masterInterval = masterIterator.interval;
        do {
            const slaveInterval = slaveIterator.interval;
            if (slaveInterval.type == TableWidthUnitType.Auto || slaveInterval.type == TableWidthUnitType.Nil)
                autoSizeIntervalsCount++;
            deferredTableGrid.push(slaveInterval);
            slaveIterator.advance(slaveInterval);
            masterInterval = masterInterval.substract(slaveInterval);
        } while (masterInterval.colSpan > 0 && !slaveIterator.endOfIntervals() && slaveIterator.interval.colSpan <= masterInterval.colSpan);
        const calculateNotSetIntervals = masterInterval.type == TableWidthUnitType.ModelUnits && autoSizeIntervalsCount > 0;
        const newWidth = calculateNotSetIntervals ? masterInterval.width / autoSizeIntervalsCount : 0;
        for (let interval of deferredTableGrid) {
            if (calculateNotSetIntervals && (interval.type == TableWidthUnitType.Auto || interval.type == TableWidthUnitType.Nil)) {
                interval.type = TableWidthUnitType.ModelUnits;
                interval.width = newWidth;
            }
            mergedRowsIntervals.push(masterIterator.interval.colSpan > 1 ? interval : Calculator.mergeIntervalsDifferentRows(masterIterator.interval, interval));
            masterIterator.advance(interval);
        }
    }
}
