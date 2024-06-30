export class ColumnIntervalWidthIterator {
    constructor(columnsInfo) {
        this.columnsInfo = columnsInfo;
        this.intervalIndex = 0;
        this.interval = columnsInfo[0];
    }
    endOfIntervals() {
        return !this.interval;
    }
    moveNext() {
        this.intervalIndex++;
        this.interval = this.columnsInfo[this.intervalIndex];
    }
    advance(interval) {
        if (this.interval.colSpan == interval.colSpan)
            this.moveNext();
        else
            this.interval = this.interval.substract(interval);
    }
}
