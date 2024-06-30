import { SearchUtils } from '@devexpress/utils/lib/utils/search';
export class RtfTableGrid {
    constructor() {
        this.collection = [];
    }
    get first() { return this.collection.length > 0 ? this[0] : -1; }
    get last() { return this.collection.length > 0 ? this[this.collection.length - 1] : -1; }
    binarySearchRight(right) {
        let index = SearchUtils.normedInterpolationIndexOf(this.collection, v => v, right);
        if (index <= 0)
            return index;
        let nextIndex = index + 1;
        while (nextIndex < this.collection.length && this.collection[nextIndex] == this.collection[index]) {
            index = nextIndex;
            nextIndex++;
        }
        return index;
    }
    binarySearchLeft(right) {
        let index = SearchUtils.normedInterpolationIndexOf(this.collection, v => v, right);
        if (index <= 0)
            return index;
        let prevIndex = index - 1;
        while (prevIndex >= 0 && this.collection[prevIndex] == this.collection[index]) {
            index = prevIndex;
            prevIndex--;
        }
        return index;
    }
}
