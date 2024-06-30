import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class IntervalApi {
    constructor(start, length) {
        this.start = start;
        this.length = Math.max(0, length);
    }
    get end() { return this.start + this.length; }
}
export function convertToIntervalApi(curr) {
    return new IntervalApi(curr.start, curr.length);
}
export function convertFromIntervalApi(curr) {
    return new FixedInterval(curr.start, curr.length);
}
