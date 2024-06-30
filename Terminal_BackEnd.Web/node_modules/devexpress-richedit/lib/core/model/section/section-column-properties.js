import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class SectionColumnProperties {
    constructor(width, space) {
        this.width = 0;
        this.space = 0;
        this.width = width;
        this.space = space;
    }
    equals(obj) {
        if (!obj)
            return false;
        return this.width == obj.width &&
            this.space == obj.space;
    }
    copyFrom(obj) {
        this.width = obj.width;
        this.space = obj.space;
    }
    clone() {
        return new SectionColumnProperties(this.width, this.space);
    }
    applyConverter(converter) {
        this.width = converter(this.width);
        this.space = converter(this.space);
        return this;
    }
    static equalsColumnsInfoBinary(a, b) {
        return a && b && (a === b || a.length == b.length && ListUtils.allOf2(a, b, (valA, valB) => valA.equals(valB)));
    }
}
