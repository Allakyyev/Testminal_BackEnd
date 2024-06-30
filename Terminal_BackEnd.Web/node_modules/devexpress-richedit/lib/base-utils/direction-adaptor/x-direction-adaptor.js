export class XDirectionAdaptor {
    isXDirection() {
        return true;
    }
}
export class PointDirectionAdaptorX extends XDirectionAdaptor {
    init(obj) {
        this.obj = obj;
        return this;
    }
    get position() {
        return this.obj.x;
    }
    set position(x) {
        this.obj.x = x;
    }
    get anotherPosition() {
        return this.obj.y;
    }
    set anotherPosition(y) {
        this.obj.y = y;
    }
}
export class SizeDirectionAdaptorX extends XDirectionAdaptor {
    init(obj) {
        this.obj = obj;
        return this;
    }
    get length() {
        return this.obj.width;
    }
    set length(width) {
        this.obj.width = width;
    }
    get anotherLength() {
        return this.obj.height;
    }
    set anotherLength(height) {
        this.obj.height = height;
    }
}
export class RectangleDirectionAdaptorX extends PointDirectionAdaptorX {
    init(obj) {
        this.obj = obj;
        return this;
    }
    get length() {
        return this.obj.width;
    }
    set length(width) {
        this.obj.width = width;
    }
    get anotherLength() {
        return this.obj.height;
    }
    set anotherLength(height) {
        this.obj.height = height;
    }
}
