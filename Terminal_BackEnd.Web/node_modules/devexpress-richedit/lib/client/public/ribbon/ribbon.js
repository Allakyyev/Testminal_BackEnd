import { isNumber, isString } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RibbonTab } from './tab';
export class Ribbon {
    constructor() {
        this.visible = true;
        this.activeTabIndex = 1;
        this.tabs = [];
    }
    clearTabs() {
        this.tabs = [];
    }
    removeTab(id) {
        const index = id instanceof RibbonTab ?
            ListUtils.indexBy(this.tabs, tab => tab == id) :
            ListUtils.indexBy(this.tabs, tab => tab.id == id);
        return index >= 0 ? this.tabs.splice(index, 1)[0] : null;
    }
    insertTab(tab, index = this.tabs.length) {
        this.tabs.splice(index, 0, tab);
        return tab;
    }
    insertTabBefore(tab, target) {
        insertTabBeforeOrAfter(this.tabs, tab, target, true);
        return tab;
    }
    insertTabAfter(tab, target) {
        insertTabBeforeOrAfter(this.tabs, tab, target, false);
        return tab;
    }
    getTab(id) {
        return ListUtils.elementBy(this.tabs, tab => tab.id == id);
    }
}
function insertTabBeforeOrAfter(tabs, tab, target, before) {
    const index = findTabIndex(tabs, target);
    tabs.splice(index < 0 ? tabs.length : (before ? index : index + 1), 0, tab);
}
function findTabIndex(tabs, target) {
    return isNumber(target) || isString(target) ?
        ListUtils.indexBy(tabs, tab => tab.id == target) :
        ListUtils.indexBy(tabs, tab => tab === target);
}
