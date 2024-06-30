import { Margins } from '@devexpress/utils/lib/geometry/margins';
export class RelativeRect extends Margins {
    constructor(top = 0, right = 0, bottom = 0, left = 0) {
        super(left, right, top, bottom);
    }
}
