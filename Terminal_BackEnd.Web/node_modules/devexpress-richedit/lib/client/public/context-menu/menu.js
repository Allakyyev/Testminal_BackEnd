import { ClientContextMenuBar } from '../../bars/context-menu';
import { getContextMenuItem, insertItemAfter, insertItemBefore, removeContextMenuItem } from './helpers';
export class ContextMenuRuntime {
    constructor(native) {
        this._native = native;
    }
    get enabled() { return this._native.contextMenuSettings.enabled; }
    set enabled(value) { this._native.contextMenuSettings.enabled = value; }
    get items() { return this._native.barHolder.contextMenu.initialItems; }
    ;
    getItem(id) {
        return getContextMenuItem(this.items, id);
    }
    removeItem(itemOrId) {
        return removeContextMenuItem(this.items, itemOrId);
    }
    insertItem(item, index = this.items.length) {
        this.items.splice(index, 0, item);
        return item;
    }
    insertItemBefore(item, target) {
        insertItemBefore(this.items, item, target);
        return item;
    }
    insertItemAfter(item, target) {
        insertItemAfter(this.items, item, target);
        return item;
    }
}
export class SimpleContextMenu {
    constructor(enabled = true, getItems = () => ClientContextMenuBar.getInitialItems()) {
        this.enabled = enabled;
        this._getItems = getItems;
    }
    get items() { return this._items ? this._items : (this._items = this._getItems()); }
    set items(value) { this._items = value; }
    getItem(id) {
        return getContextMenuItem(this.items, id);
    }
    removeItem(itemOrId) {
        return removeContextMenuItem(this.items, itemOrId);
    }
    insertItem(item, index = this.items.length) {
        this.items.splice(index, 0, item);
        return item;
    }
    insertItemBefore(item, target) {
        insertItemBefore(this.items, item, target);
        return item;
    }
    insertItemAfter(item, target) {
        insertItemAfter(this.items, item, target);
        return item;
    }
}
