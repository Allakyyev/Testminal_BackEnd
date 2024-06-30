import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class SubDocumentChangesStorer {
    constructor() {
        this.map = {};
    }
    addChange(subDocumentId, interval) {
        this.getSubDocumentIntervals(subDocumentId).push(interval);
    }
    addChanges(subDocumentId, intervals) {
        const sdChanges = this.getSubDocumentIntervals(subDocumentId);
        for (const interval of intervals)
            sdChanges.push(interval);
    }
    finalizeChanges(subDocumentId, intervals) {
        const sdChanges = this.getSubDocumentIntervals(subDocumentId);
        this.map = {};
        return IntervalAlgorithms.getIntersectionsTwoArraysOfIntervalTemplate(intervals, IntervalAlgorithms.getMergedIntervalsTemplate(sdChanges, true, SubDocumentChangesStorer.intervalTemplate), SubDocumentChangesStorer.intervalTemplate);
    }
    getSubDocumentIntervals(subDocumentId) {
        let sdChanges = this.map[subDocumentId];
        if (sdChanges === undefined)
            sdChanges = this.map[subDocumentId] = [];
        return sdChanges;
    }
}
SubDocumentChangesStorer.intervalTemplate = new FixedInterval(0, 0);
