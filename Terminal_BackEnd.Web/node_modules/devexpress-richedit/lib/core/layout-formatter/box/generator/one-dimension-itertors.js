import { SearchUtils } from '@devexpress/utils/lib/utils/search';
export class OneDimensionItertor {
    constructor(objects) {
        this.objects = objects;
    }
    init(pos) {
        this.index = SearchUtils.normedInterpolationIndexOf(this.objects, (o) => this.getPosition(o), pos);
        this.updateNextObjPos();
    }
    update(newPosition) {
        if (newPosition < this.nextObjPosition)
            return false;
        while (this.getPosition(this.objects[++this.index]) < newPosition)
            ;
        this.updateNextObjPos();
        return true;
    }
    updateNextObjPos() {
        const nextObj = this.objects[this.index + 1];
        this.nextObjPosition = nextObj ? this.getPosition(nextObj) : Number.MAX_VALUE;
    }
}
export class ParagraphIterator extends OneDimensionItertor {
    getPosition(o) {
        return o.startLogPosition.value;
    }
}
export class SectionIterator extends OneDimensionItertor {
    getPosition(o) {
        return o.startLogPosition.value;
    }
}
