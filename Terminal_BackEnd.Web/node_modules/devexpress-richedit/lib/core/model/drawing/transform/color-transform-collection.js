import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class ColorTransformCollection {
    constructor(transforms = []) {
        this.transforms = transforms;
    }
    applyTransform(color) {
        for (let transform of this.transforms)
            transform.applyTransform(color);
        return color;
    }
    add(transf) {
        this.transforms.push(transf);
    }
    equals(obj) {
        return obj &&
            ListUtils.allOf2(this.transforms, obj.transforms, (a, b) => a.equals(b));
    }
    clear() {
        this.transforms = [];
    }
    clone() {
        return new ColorTransformCollection(ListUtils.deepCopy(this.transforms));
    }
}
