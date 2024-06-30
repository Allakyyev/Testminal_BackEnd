import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutChangeBase, LayoutChangeType } from './layout-change-base';
export class ColumnChange extends LayoutChangeBase {
    constructor(index, changeType = LayoutChangeType.Updated, rowChanges = [], tableChanges = [], paragraphFrameChanges = []) {
        super(index, changeType);
        this.rowChanges = rowChanges;
        this.tableChanges = tableChanges;
        this.paragraphFrameChanges = paragraphFrameChanges;
    }
    summarizeChanges(change) {
        this.rowChanges = this.rowChanges.concat(change.rowChanges);
        this.tableChanges = this.tableChanges.concat(change.tableChanges);
        this.paragraphFrameChanges = this.paragraphFrameChanges.concat(change.paragraphFrameChanges);
    }
    reduceChanges() {
        this.rowChanges = ListUtils.reducedMap(this.rowChanges, (change) => change.reduceChanges());
        this.tableChanges = ListUtils.reducedMap(this.tableChanges, (change) => change.reduceChanges());
        this.paragraphFrameChanges = ListUtils.reducedMap(this.paragraphFrameChanges, (change) => change.reduceChanges());
        return this.changeType == LayoutChangeType.Updated &&
            !this.rowChanges.length && !this.tableChanges.length && !this.paragraphFrameChanges.length ?
            null : this;
    }
}
