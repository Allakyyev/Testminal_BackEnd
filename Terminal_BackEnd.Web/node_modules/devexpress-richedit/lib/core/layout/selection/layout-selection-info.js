import { LayoutChangeType } from '../../layout-formatter/changes/changes/layout-change-base';
import { LayoutAreaSelectionChange } from '../../layout-formatter/changes/changes/selection/layout-area-selection-change';
import { LayoutPageSelectionChange } from '../../layout-formatter/changes/changes/selection/layout-page-selection-change';
import { LayoutPageFlags } from '../main-structures/layout-page';
import { LayoutSelectionPageInfo } from './layout-selection-page-info';
export class LayoutSelectionInfo {
    constructor(layoutPageFlag, innerClientProperties) {
        this.pageInfos = [];
        this.changes = [];
        this.layoutPageFlag = layoutPageFlag;
        this.innerClientProperties = innerClientProperties;
    }
    changesApplied() {
        this.changes = [];
    }
    reset() {
        this.pageInfos.splice(0);
        this.changes.splice(0);
    }
    needAtLeastPageIndex(pageIndex) {
        while (this.pageInfos.length <= pageIndex)
            this.pageInfos.push(new LayoutSelectionPageInfo());
    }
    registerItem(pageIndex, item) {
        this.needAtLeastPageIndex(pageIndex);
        const pageInfo = this.pageInfos[pageIndex];
        pageInfo.newItems.push(item);
        pageInfo.isChanged = true;
    }
    collectPageChanges(layout) {
        const pages = layout.pages;
        this.pageInfos.splice(pages.length);
        if (this.innerClientProperties.viewsSettings.isSimpleView) {
            if (this.pageInfos[0])
                this.pageInfos[0].changesCollected();
        }
        else {
            for (let pageIndex = 0, pageInfo; pageInfo = this.pageInfos[pageIndex]; pageIndex++) {
                const pageFlags = pages[pageIndex].flags;
                if (pageFlags.get(LayoutPageFlags.MustBeRendered) && pageInfo.isChanged) {
                    const maxCount = Math.max(pageInfo.oldItems.length, pageInfo.newItems.length);
                    const pageChanges = [];
                    if (!pageFlags.get(this.layoutPageFlag))
                        pageInfo.oldItems = [];
                    for (let itemIndex = 0; itemIndex < maxCount; itemIndex++) {
                        const oldItem = pageInfo.oldItems[itemIndex];
                        const newItem = pageInfo.newItems[itemIndex];
                        if (oldItem) {
                            if (newItem) {
                                if (!oldItem.equals(newItem))
                                    pageChanges.push(new LayoutAreaSelectionChange(itemIndex, LayoutChangeType.Replaced, newItem));
                            }
                            else {
                                for (let ind = pageInfo.oldItems.length - 1; ind >= itemIndex; ind--)
                                    pageChanges.push(new LayoutAreaSelectionChange(ind, LayoutChangeType.Deleted, oldItem));
                                break;
                            }
                        }
                        else {
                            for (; itemIndex < pageInfo.newItems.length; itemIndex++)
                                pageChanges.push(new LayoutAreaSelectionChange(itemIndex, LayoutChangeType.Inserted, pageInfo.newItems[itemIndex]));
                            break;
                        }
                    }
                    if (pageChanges.length)
                        this.changes.push(new LayoutPageSelectionChange(pageIndex, LayoutChangeType.Updated, pageChanges));
                }
                pageInfo.changesCollected();
            }
        }
    }
}
