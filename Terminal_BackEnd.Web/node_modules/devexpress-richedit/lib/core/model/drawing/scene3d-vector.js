export class Scene3DVector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    get isDefault() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }
    clone() {
        return new Scene3DVector(this.x, this.y, this.z);
    }
    equals(obj) {
        return obj &&
            this.x == obj.x &&
            this.y == obj.y &&
            this.z == obj.z;
    }
}
