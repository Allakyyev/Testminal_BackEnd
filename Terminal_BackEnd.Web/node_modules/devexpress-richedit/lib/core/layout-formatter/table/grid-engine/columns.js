import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class Columns {
    constructor(intervalsInfo) {
        this.width = ListUtils.map(intervalsInfo, (curr) => curr.width);
        this.numColumns = this.width.length;
        let pos = 0;
        this.positions = ListUtils.map(intervalsInfo, (curr) => pos += curr.width);
        this.positions.unshift(0);
        if (ListUtils.unsafeAnyOf(this.positions, (p) => isNaN(p) || p < 0))
            throw new Error(Errors.InternalException);
    }
}
