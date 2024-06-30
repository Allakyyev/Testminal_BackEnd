import { LinkedInterval } from '../../core/model/position/linked-interval';
import { SelectionIntervalsInfo } from '../../core/selection/selection-intervals-info';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class SelectionState {
    constructor(intervalsInfo, forwardDirection, endOfLine, pageIndex) {
        this.forwardDirection = true;
        this.endOfLine = false;
        this.keepX = -1;
        this.pageIndex = -1;
        this.intervalsInfo = intervalsInfo.clone();
        this.forwardDirection = forwardDirection;
        this.endOfLine = endOfLine;
        this.pageIndex = pageIndex;
    }
    get interval() { return this.intervalsInfo.interval; }
    ;
    get anchorPostion() { return this.forwardDirection ? this.interval.start : this.interval.end; }
    get activePostion() { return this.forwardDirection ? this.interval.end : this.interval.start; }
    get reversedAnchorPostion() { return this.forwardDirection ? this.interval.end : this.interval.start; }
    setEndOfLine(endOfLine) {
        this.endOfLine = endOfLine;
        return this;
    }
    resetKeepX() {
        this.keepX = -1;
        return this;
    }
    setKeepX(keepX) {
        this.keepX = keepX;
        return this;
    }
    setForwardDirection(fd) {
        this.forwardDirection = fd;
        return this;
    }
    setInterval(interval) {
        this.intervalsInfo.intervals = [this.getNormalizedLastInterval(interval)];
        return this;
    }
    setIntervals(intervals) {
        this.intervalsInfo.intervals = intervals;
        return this;
    }
    setPosition(pos) {
        this.intervalsInfo.position = pos;
        return this;
    }
    addInterval(interval) {
        if (this.intervalsInfo.isCollapsed)
            this.intervalsInfo.interval = interval;
        else
            this.intervalsInfo.lastIntervalIndex = this.intervalsInfo.intervals.push(this.getNormalizedLastInterval(interval)) - 1;
        return this;
    }
    extendLastInterval(end) {
        const oldAnchor = this.anchorPostion;
        this.interval.start = Math.min(oldAnchor, end);
        this.interval.length = Math.abs(oldAnchor - end);
        this.forwardDirection = end >= oldAnchor;
        return this;
    }
    setPageIndex(pageIndex) {
        this.pageIndex = pageIndex;
        return this;
    }
    setSubDocument(subDocument) {
        this.intervalsInfo.subDocument = subDocument;
        return this;
    }
    getNormalizedLastInterval(interval) {
        this.forwardDirection = interval.length >= 0;
        return this.forwardDirection ? interval : new FixedInterval(interval.end, interval.start);
    }
    static getDefault(activeSubDocument) {
        return new SelectionState(SelectionIntervalsInfo.fromPosition(activeSubDocument, 0), true, false, -1);
    }
    clone() {
        return new SelectionState(this.intervalsInfo.clone(), this.forwardDirection, this.endOfLine, this.pageIndex);
    }
    equals(obj) {
        return this.partiallyEquals(obj) &&
            ListUtils.equals(this.intervalsInfo.intervals, obj.intervalsInfo.intervals);
    }
    partiallyEquals(obj) {
        return obj &&
            this.keepX == obj.keepX &&
            this.forwardDirection == obj.forwardDirection &&
            this.endOfLine == obj.endOfLine &&
            this.intervalsInfo.lastIntervalIndex == obj.intervalsInfo.lastIntervalIndex &&
            this.pageIndex == obj.pageIndex;
    }
}
export class SelectionFloatingState {
    constructor(state) {
        this.state = state;
        this.linkedIntervals = ListUtils.map(state.intervalsInfo.intervals, (curr) => new LinkedInterval(state.intervalsInfo.subDocument.positionManager, curr));
    }
    finalize() {
        const intervals = [];
        for (let interval of this.linkedIntervals) {
            intervals.push(interval.getFixedInterval());
            interval.destructor(this.state.intervalsInfo.subDocument.positionManager);
        }
        this.linkedIntervals = [];
        this.state.intervalsInfo.intervals = intervals;
        return this.state;
    }
}
