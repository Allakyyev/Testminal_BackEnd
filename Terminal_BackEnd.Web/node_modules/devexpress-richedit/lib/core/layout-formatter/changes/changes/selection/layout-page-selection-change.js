import { Errors } from '@devexpress/utils/lib/errors';
import { LayoutChangeBase } from '../layout-change-base';
export class LayoutPageSelectionChange extends LayoutChangeBase {
    constructor(index, changeType, areaChanges = []) {
        super(index, changeType);
        this.areaChanges = areaChanges;
    }
    reduceChanges() {
        throw new Error(Errors.InternalException);
    }
}
