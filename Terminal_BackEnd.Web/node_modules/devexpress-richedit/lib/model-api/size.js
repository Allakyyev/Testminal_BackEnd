export class SizeApi {
    constructor(width, height) {
        this.width = Math.max(0, width);
        this.height = Math.max(0, height);
    }
}
export class MarginsApi {
    constructor(left, right, top, bottom) {
        this.left = Math.max(0, left);
        this.right = Math.max(0, right);
        this.top = Math.max(0, top);
        this.bottom = Math.max(0, bottom);
    }
}
