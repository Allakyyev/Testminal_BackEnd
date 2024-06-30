import { ToolbarInteractiveItem } from './toolbar-interactive-item';
import { MenuToolbarItemTemplateCreator } from './toolbar-item-template-creators/menu-toolbar-item-template-creator';
import { ToolbarSubMenuItem } from './toolbar-sub-menu-item';
export class ToolbarMenuItem extends ToolbarInteractiveItem {
    constructor(options, onCommandExecuted, onSubMenuItemCreated) {
        super(options, onCommandExecuted);
        this.onSubMenuItemCreated = onSubMenuItemCreated;
        this.items = {};
        this.createSubMenuItems(options.items);
    }
    getWidget() {
        return this.widget;
    }
    getOptions() {
        return this.options;
    }
    createSubMenuItems(items) {
        if (!items)
            return;
        items.forEach(i => {
            const subMenuItem = new ToolbarSubMenuItem(i.name, this);
            this.onSubMenuItemCreated(subMenuItem);
            if (i.name)
                this.items[i.name] = subMenuItem;
            this.createSubMenuItems(i.items);
        });
        return;
    }
    getBuildTemplateStrategy() {
        return new MenuToolbarItemTemplateCreator({
            itemOptions: this.options,
            onInitialized: this.getOnInitializedHandler(),
            onItemRendered: this.getOnItemRenderedHandler(),
            onItemClick: this.getOnItemClickHandler()
        });
    }
    setValue(_value) {
    }
    getOnItemClickHandler() {
        return this.onCommandExecuted ? (e) => {
            this.closeSubMenuIfRequired(e.component, e.itemData, e.itemElement);
            const subItem = e.itemData.name ? this.items[e.itemData.name] : undefined;
            if (!subItem)
                return;
            this.onCommandExecuted({
                item: subItem,
                parameter: null
            });
        } : undefined;
    }
    closeSubMenuIfRequired(component, itemData, itemElement) {
        if (itemData.isRootElement && component._visibleSubmenu)
            window.setTimeout(() => component.unselectItem((itemElement[0] || itemElement)), 0);
    }
    getOnItemRenderedHandler() {
        return e => {
            const name = e.itemData.name;
            if (!name)
                return;
            const item = this.items[name];
            const element = e.itemElement[0] ? e.itemElement[0] : e.itemElement;
            item.setElement(element);
        };
    }
}
