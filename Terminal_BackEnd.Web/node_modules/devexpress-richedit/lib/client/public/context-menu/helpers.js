import { searchTreeItem } from '../../../base-utils/utils';
import { isNumber, isString } from '@devexpress/utils/lib/utils/common';
function findContextMenuItemInfoById(items, id) {
    return isNumber(id) || isString(id) ?
        searchTreeItem(items, item => item.id === id) :
        searchTreeItem(items, item => item === id);
}
export function removeContextMenuItem(items, id) {
    const itemInfo = findContextMenuItemInfoById(items, id);
    return itemInfo === null ? null : itemInfo.parentList.splice(itemInfo.itemIndex, 1)[0];
}
export function getContextMenuItem(items, id) {
    const result = searchTreeItem(items, item => item.id === id);
    return result === null ? null : result.item;
}
export function insertItemBefore(items, item, targetBefore) {
    const itemInfo = findContextMenuItemInfoById(items, targetBefore);
    if (itemInfo)
        itemInfo.parentList.splice(itemInfo.itemIndex, 0, item);
    else
        items.push(item);
}
export function insertItemAfter(items, item, targetAfter) {
    const itemInfo = findContextMenuItemInfoById(items, targetAfter);
    if (itemInfo)
        itemInfo.parentList.splice(itemInfo.itemIndex + 1, 0, item);
    else
        items.push(item);
}
