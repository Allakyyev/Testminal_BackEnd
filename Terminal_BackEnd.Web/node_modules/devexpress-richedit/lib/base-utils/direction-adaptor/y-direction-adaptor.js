export class YDirectionAdaptor {
    isXDirection() {
        return false;
    }
}
export class PointDirectionAdaptorY extends YDirectionAdaptor {
    init(obj) {
        this.obj = obj;
        return this;
    }
    get position() {
        return this.obj.y;
    }
    set position(y) {
        this.obj.y = y;
    }
    get anotherPosition() {
        return this.obj.x;
    }
    set anotherPosition(x) {
        this.obj.x = x;
    }
}
export class SizeDirectionAdaptorY extends YDirectionAdaptor {
    init(obj) {
        this.obj = obj;
        return this;
    }
    get length() {
        return this.obj.height;
    }
    set length(height) {
        this.obj.height = height;
    }
    get anotherLength() {
        return this.obj.width;
    }
    set anotherLength(width) {
        this.obj.width = width;
    }
}
export class RectangleDirectionAdaptorY extends PointDirectionAdaptorY {
    init(obj) {
        this.obj = obj;
        return this;
    }
    get length() {
        return this.obj.height;
    }
    set length(height) {
        this.obj.height = height;
    }
    get anotherLength() {
        return this.obj.width;
    }
    set anotherLength(width) {
        this.obj.width = width;
    }
}
