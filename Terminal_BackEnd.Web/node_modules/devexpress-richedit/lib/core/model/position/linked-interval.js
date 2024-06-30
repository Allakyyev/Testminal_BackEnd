import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ConstInterval } from '@devexpress/utils/lib/intervals/const';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class LinkedInterval extends ConstInterval {
    constructor(manager, interval) {
        super();
        this._start = manager.registerPosition(interval.start);
        this._end = manager.registerPosition(interval.end);
    }
    get start() { return this._start.value; }
    get length() { return this._end.value - this._start.value; }
    get end() { return this._end.value; }
    get center() { return (this.start + this.end) / 2; }
    destructor(manager) {
        manager.unregisterPosition(this._start);
        manager.unregisterPosition(this._end);
    }
    equals(obj) {
        return obj && this.start == obj.start && this.end == obj.end;
    }
    getFixedInterval() {
        return new FixedInterval(this.start, this.length);
    }
    getBoundaryInterval() {
        return new BoundaryInterval(this.start, this.end);
    }
}
