import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutChangeBase, LayoutChangeType } from './layout-change-base';
export class PageAreaChange extends LayoutChangeBase {
    constructor(index, changeType = LayoutChangeType.Updated, columnChanges = []) {
        super(index, changeType);
        this.columnChanges = columnChanges;
    }
    summarizeChanges(change) {
        this.columnChanges = this.columnChanges.concat(change.columnChanges);
    }
    reduceChanges() {
        this.columnChanges = ListUtils.reducedMap(this.columnChanges, (change) => change.reduceChanges());
        return this.changeType == LayoutChangeType.Updated && !this.columnChanges.length ? null : this;
    }
}
