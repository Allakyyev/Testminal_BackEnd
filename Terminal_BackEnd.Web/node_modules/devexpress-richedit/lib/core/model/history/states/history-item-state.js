import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
export class HistoryItemState {
    constructor(...values) {
        this.objects = [];
        for (var value, i = 0; value = values[i]; i++)
            this.register(value);
    }
    register(object) {
        if (this.lastObject && this.lastObject.canMerge(object))
            this.lastObject.merge(object);
        else {
            this.objects.push(object);
            this.lastObject = object;
        }
        return this;
    }
    toJSON(withPostData) {
        var result = [];
        for (var object, i = 0; object = this.objects[i]; i++)
            result.push(object.toJSON(withPostData));
        return result;
    }
    isEmpty() {
        return !this.lastObject;
    }
}
export class HistoryItemIntervalState extends HistoryItemState {
    get interval() {
        if (this.lastObject)
            return FixedInterval.fromPositions(this.objects[0].interval.start, this.lastObject.interval.end);
        return null;
    }
}
