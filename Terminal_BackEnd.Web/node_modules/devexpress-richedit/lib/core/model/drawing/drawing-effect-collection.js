import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class DrawingEffectCollection {
    constructor(list = []) {
        this.list = list;
    }
    clone() {
        return new DrawingEffectCollection(ListUtils.deepCopy(this.list));
    }
}
