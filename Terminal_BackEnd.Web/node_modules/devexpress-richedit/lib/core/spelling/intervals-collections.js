import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { UncheckedInterval } from './intervals';
import { SpellingErrorType } from './spell-checker';
export class SpellCheckerIntervalCollection {
    constructor() {
        this.intervals = [];
    }
    getIntervals() {
        return this.intervals;
    }
    add(newInterval) {
        let index = this.intervals.length;
        while (index > 0) {
            if (this.intervals[index - 1].start < newInterval.start)
                break;
            index--;
        }
        this.intervals.splice(index, 0, newInterval);
    }
    remove(index) {
        this.intervals.splice(index, 1);
    }
    onModelIntervalChanged(start, length, isSeparator) {
        if (length > 0)
            this.onModelIntervalInserted(start, length, isSeparator);
        else
            this.onModelIntervalRemoved(start, -length);
    }
    onModelIntervalInserted(start, length, _isSeparator) {
        this.forEach(interval => {
            if (interval.start > start)
                interval.setStart(interval.start + length);
            else if (interval.end >= start)
                interval.setLength(interval.length + length);
        });
    }
    onModelIntervalRemoved(start, length) {
        let removedInterval = new FixedInterval(start, length);
        this.forEach((interval, index) => {
            if (removedInterval.containsInterval(interval))
                this.remove(index);
            else if (removedInterval.start < interval.start) {
                interval.setLength(interval.length - Math.max(0, removedInterval.end - interval.start));
                interval.setStart(interval.start - Math.min(removedInterval.length, interval.start - removedInterval.start));
            }
            else if (interval.end > removedInterval.start)
                interval.setLength(interval.length - Math.min(removedInterval.length, interval.end - removedInterval.start));
        });
    }
    forEach(callback) {
        let index = this.intervals.length;
        while (--index >= 0)
            callback(this.intervals[index], index);
    }
    deleteIntervalsByPositions(start, end, strictMatch = false) {
        const defInterval = FixedInterval.fromPositions(start, end);
        if (strictMatch) {
            ListUtils.anyOf(this.intervals, (value, index) => {
                const isIntervalsEqual = defInterval.equals(value);
                if (isIntervalsEqual)
                    this.remove(index);
                return isIntervalsEqual;
            });
        }
        else
            this.forEach((interval, index) => {
                const intersection = IntervalAlgorithms.getIntersection(interval, defInterval);
                if (intersection && intersection.length > 0)
                    this.remove(index);
            });
    }
    findIntervalIndexByPositions(start, end) {
        return ListUtils.indexBy(this.intervals, (interval) => interval.start == start && interval.end == end);
    }
    clear() {
        this.intervals = [];
    }
}
export class UncheckedIntervalCollection extends SpellCheckerIntervalCollection {
    findCheckingIntervalByPositions(start, end) {
        const index = this.findIntervalIndexByPositions(start, end);
        return index >= 0 && this.intervals[index].info.isChecking ? this.intervals[index] : null;
    }
    onModelIntervalInserted(start, length, isSeparator) {
        let hasIntersection = false;
        let separatorWasAdded = false;
        this.forEach(interval => {
            if (interval.containsWithIntervalEnd(start)) {
                hasIntersection = true;
                if (isSeparator && interval.end == start)
                    separatorWasAdded = true;
                else
                    interval.info.isSplitted = false;
            }
        });
        if (!separatorWasAdded)
            super.onModelIntervalInserted(start, length, isSeparator);
        if (!hasIntersection)
            this.add(new UncheckedInterval(start, length, false));
    }
    onModelIntervalRemoved(start, length) {
        let removedInterval = new FixedInterval(start, length);
        let hasIntersection = false;
        this.forEach((interval) => {
            if (IntervalAlgorithms.getIntersection(interval, removedInterval))
                hasIntersection = true;
        });
        super.onModelIntervalRemoved(start, length);
        if (!hasIntersection)
            this.add(new UncheckedInterval(start, 1));
    }
}
export class MisspelledIntervalCollection extends SpellCheckerIntervalCollection {
    addIfNotExists(newInterval) {
        if (this.findIntervalIndexByPositions(newInterval.start, newInterval.end) < 0)
            this.add(newInterval);
    }
    findNext(position) {
        for (let i = 0, interval; interval = this.intervals[i]; i++)
            if (interval.end >= position)
                return interval;
        return this.intervals[0] ? this.intervals[0] : null;
    }
    deleteOldIntervals(defInterval, isIntervalStartWithParagraph) {
        this.forEach((interval, index) => {
            const intersection = IntervalAlgorithms.getIntersection(interval, defInterval);
            if (intersection && intersection.length > 0)
                if (isIntervalStartWithParagraph || interval.start !== defInterval.start || interval.errorInfo.errorType !== SpellingErrorType.Repeating)
                    this.remove(index);
        });
    }
}
export class IgnoredIntervalCollection extends SpellCheckerIntervalCollection {
    contains(start, length, word) {
        const index = this.findIntervalIndexByPositions(start, start + length);
        return index >= 0 && this.intervals[index].word == word;
    }
}
export class IgnoredWordsCollection {
    constructor() {
        this.ignoredWords = [];
    }
    add(word) {
        if (!this.contains(word))
            this.ignoredWords.push(word);
    }
    contains(word) {
        return this.ignoredWords.indexOf(word) !== -1;
    }
    clear() {
        this.ignoredWords = [];
    }
}
