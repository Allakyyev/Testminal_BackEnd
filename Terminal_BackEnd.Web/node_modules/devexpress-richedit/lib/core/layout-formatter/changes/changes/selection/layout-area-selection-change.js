import { Errors } from '@devexpress/utils/lib/errors';
import { LayoutChangeBase } from '../layout-change-base';
export class LayoutAreaSelectionChange extends LayoutChangeBase {
    constructor(index, changeType, selection) {
        super(index, changeType);
        this.selection = selection;
    }
    reduceChanges() {
        throw new Error(Errors.InternalException);
    }
}
