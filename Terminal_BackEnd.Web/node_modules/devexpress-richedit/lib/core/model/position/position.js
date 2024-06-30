export class Position {
    constructor(value) {
        this.value = value;
        this.refCount = 0;
    }
    incRefCount() {
        ++this.refCount;
    }
    decRefCount() {
        --this.refCount;
    }
    hasReference() {
        return this.refCount > 0;
    }
}
