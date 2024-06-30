import { isNumber, isString } from '@devexpress/utils/lib/utils/common';
import { RibbonItemBase, RibbonItemType } from './items/base';
export var RibbonTabType;
(function (RibbonTabType) {
    RibbonTabType[RibbonTabType["File"] = 0] = "File";
    RibbonTabType[RibbonTabType["Home"] = 1] = "Home";
    RibbonTabType[RibbonTabType["Insert"] = 2] = "Insert";
    RibbonTabType[RibbonTabType["PageLayout"] = 3] = "PageLayout";
    RibbonTabType[RibbonTabType["References"] = 4] = "References";
    RibbonTabType[RibbonTabType["MailMerge"] = 5] = "MailMerge";
    RibbonTabType[RibbonTabType["View"] = 6] = "View";
    RibbonTabType[RibbonTabType["HeadersFooters"] = 7] = "HeadersFooters";
    RibbonTabType[RibbonTabType["TableDesign"] = 8] = "TableDesign";
    RibbonTabType[RibbonTabType["TableLayout"] = 9] = "TableLayout";
    RibbonTabType[RibbonTabType["FloatingObjectsFormat"] = 10] = "FloatingObjectsFormat";
})(RibbonTabType || (RibbonTabType = {}));
export class RibbonTab {
    constructor(title, id, items = [], localizationId) {
        this.id = id;
        this.items = items;
        this.title = title;
        this.localizationId = localizationId;
    }
    get contextTab() { return false; }
    removeItem(id) {
        this.forEachItem(id instanceof RibbonItemBase ?
            (item, index, parent) => {
                if (item == id)
                    parent.items.splice(index, 1);
            } :
            (item, index, parent) => {
                if (item.id == id)
                    parent.items.splice(index, 1);
            }, true);
    }
    getItem(id) {
        let result = null;
        this.forEachItem((item) => {
            if (item.id == id)
                result = item;
        });
        return result;
    }
    insertItem(item, index = this.items.length) {
        item = item.type == RibbonItemType.SubMenu ? item.convertToButton() : item;
        this.items.splice(index, 0, item);
        return item;
    }
    insertItemBefore(item, target) {
        return insertItemBeforeOrAfter(this, item, target, true);
    }
    insertItemAfter(item, target) {
        return insertItemBeforeOrAfter(this, item, target, false);
    }
    forEachItem(callback, recursive = true) {
        const innerForEach = (parent) => {
            parent.items.forEach((item, index) => {
                callback(item, index, parent);
                if (recursive && isRibbonParentItem(item))
                    innerForEach(item);
            });
        };
        innerForEach(this);
    }
}
export class RibbonContextTab extends RibbonTab {
    constructor(title, id, category, items, localizationId) {
        super(title, id, items, localizationId);
        this.category = category;
    }
    get contextTab() { return true; }
}
class RibbonSearchItemResult {
    constructor(parent, item, itemIndex) {
        this.parent = parent;
        this.item = item;
        this.itemIndex = itemIndex;
    }
}
function findItemInfo(parent, target) {
    return isNumber(target) || isString(target) ?
        searchTreeItem(parent, item => item.id == target) :
        searchTreeItem(parent, item => item === target);
}
function searchTreeItem(parent, comparer) {
    for (let index = 0, item; item = parent.items[index]; index++) {
        if (comparer(item))
            return new RibbonSearchItemResult(parent, item, index);
        if (isRibbonParentItem(item)) {
            const res = searchTreeItem(item, comparer);
            if (res)
                return res;
        }
    }
    return null;
}
function isRibbonParentItem(item) {
    return item.type === RibbonItemType.SubMenu || item.type === RibbonItemType.Menu;
}
function insertItemBeforeOrAfter(tab, item, target, before) {
    const info = findItemInfo(tab, target);
    if (!info) {
        item = item.type == RibbonItemType.SubMenu ? item.convertToButton() : item;
        tab.items.push(item);
    }
    else {
        const insertedItem = item.type == RibbonItemType.SubMenu && info.parent instanceof RibbonTab ?
            item.convertToButton() :
            item;
        info.parent.items.splice(before ? info.itemIndex : info.itemIndex + 1, 0, insertedItem);
    }
    return item;
}
