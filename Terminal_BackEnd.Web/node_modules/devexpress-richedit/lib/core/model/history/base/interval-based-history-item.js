import { HistoryItem } from './history-item';
export class IntervalBasedHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocInterval) {
        super(modelManipulator);
        this.subDocInterval = subDocInterval;
    }
    get boundSubDocument() { return this.subDocInterval.subDocument; }
    get interval() { return this.subDocInterval.interval; }
}
