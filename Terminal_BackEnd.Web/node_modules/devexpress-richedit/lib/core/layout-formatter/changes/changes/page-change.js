import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutChangeBase, LayoutChangeType } from './layout-change-base';
export class PageChange extends LayoutChangeBase {
    constructor(index, changeType = LayoutChangeType.Updated, pageAreaChanges = [], otherPageAreaChanges = []) {
        super(index, changeType);
        this.mainPageAreaChanges = pageAreaChanges;
        this.otherPageAreaChanges = otherPageAreaChanges;
        this.anchoredPictureChanges = [];
    }
    summarizeChanges(change) {
        ListUtils.addListOnTail(this.mainPageAreaChanges, change.mainPageAreaChanges);
        ListUtils.addListOnTail(this.otherPageAreaChanges, change.otherPageAreaChanges);
        ListUtils.addListOnTail(this.anchoredPictureChanges, change.anchoredPictureChanges);
    }
    emptyOrInvalid() {
        if (this.changeType != LayoutChangeType.Updated || this.otherPageAreaChanges.length > 0 || this.anchoredPictureChanges.length > 0)
            return false;
        for (let pageAreaChange of this.mainPageAreaChanges) {
            if (pageAreaChange.changeType != LayoutChangeType.Updated)
                return false;
            for (let columnChange of pageAreaChange.columnChanges) {
                if (columnChange.changeType != LayoutChangeType.Updated || columnChange.rowChanges.length != 0 ||
                    columnChange.paragraphFrameChanges.length != 0 || columnChange.tableChanges.length != 0)
                    return false;
            }
        }
        return true;
    }
    reduceChanges() {
        this.mainPageAreaChanges = ListUtils.reducedMap(this.mainPageAreaChanges, (change) => change.reduceChanges());
        this.otherPageAreaChanges = ListUtils.reducedMap(this.otherPageAreaChanges, (change) => change.reduceChanges());
        this.anchoredPictureChanges = ListUtils.reducedMap(this.anchoredPictureChanges, (change) => change.reduceChanges());
        return this;
    }
}
