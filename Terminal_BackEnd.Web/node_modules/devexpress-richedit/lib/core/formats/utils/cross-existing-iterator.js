import { Constants } from '@devexpress/utils/lib/constants';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
class NextPosition {
    constructor(index, nextKeyPosition) {
        this.index = index;
        this.nextKeyPosition = nextKeyPosition;
    }
}
export class ObjectStateInfo {
    constructor(object, index) {
        this.object = object;
        this.index = index;
    }
}
export class CrossExistingIterator {
    constructor(objects) {
        this.objects = objects;
    }
    init() {
        this.clearPublicLists();
        this.currObjs = [];
        this.nextPos = this.objects[0] ?
            new NextPosition(0, this.objects[0].interval.start) :
            new NextPosition(0, Constants.MAX_SAFE_INTEGER);
    }
    hasObjects(start, length) {
        return start <= this.nextPos.nextKeyPosition && this.nextPos.nextKeyPosition < (start + length);
    }
    update(newPos) {
        this.clearPublicLists();
        if (newPos < this.nextPos.nextKeyPosition)
            return false;
        this.deleteObjects(newPos);
        this.addNewObjects(newPos);
        const smthChanged = !!this.deletedObjects.length || !!this.addedObjects.length;
        if (smthChanged) {
            const obj = this.objects[this.nextPos.index];
            this.nextPos.nextKeyPosition = obj ? obj.interval.start : Constants.MAX_SAFE_INTEGER;
            for (const state of this.currObjs)
                this.nextPos.nextKeyPosition = Math.min(this.nextPos.nextKeyPosition, state.object.interval.end);
        }
        return smthChanged;
    }
    clearPublicLists() {
        this.deletedObjects = [];
        this.addedObjects = [];
    }
    deleteObjects(newPos) {
        this.currObjs = ListUtils.reducedMap(this.currObjs, (state) => {
            if (newPos >= state.object.interval.end) {
                this.deletedObjects.push(state);
                return null;
            }
            else
                return state;
        });
    }
    addNewObjects(newPos) {
        let obj = this.objects[this.nextPos.index];
        while (obj && obj.interval.start == newPos) {
            const state = new ObjectStateInfo(obj, this.nextPos.index);
            if (obj.interval.length)
                this.currObjs.push(state);
            else
                this.deletedObjects.push(state);
            this.addedObjects.push(state);
            this.nextPos.index++;
            obj = this.objects[this.nextPos.index];
        }
    }
}
