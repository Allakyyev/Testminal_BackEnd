export class ToolbarSubMenuItem {
    constructor(name, menuItem) {
        this.name = name;
        this.menuItem = menuItem;
    }
    setValue(value) {
        if (typeof value !== 'boolean')
            return;
        if (this.element)
            this.setValueCore(this.element, value);
        else
            this.selected = value;
    }
    setElement(element) {
        this.element = element;
        if (this.selected !== undefined) {
            this.setValue(this.selected);
            this.selected = undefined;
        }
    }
    setEnabled(enabled) {
        this.setDataOption('disabled', !enabled);
    }
    setVisible(visible) {
        this.setDataOption('visible', visible);
    }
    setValueCore(itemElement, value) {
        if (value)
            itemElement.classList.add(ToolbarSubMenuItem.SelectedItemClassName);
        else
            itemElement.classList.remove(ToolbarSubMenuItem.SelectedItemClassName);
    }
    setDataOption(optionName, optionValue) {
        const dataOptionName = this.getDataOptionName();
        if (!dataOptionName)
            return;
        setTimeout(() => this.menuItem.getWidget().option(`${dataOptionName}.${optionName}`, optionValue), 0);
    }
    getDataOptionName() {
        if (this.dataOptionName === undefined)
            this.dataOptionName = this.getDataOptionNameCore(this.menuItem.getOptions().items, 'items[0]');
        return this.dataOptionName;
    }
    getDataOptionNameCore(items, path) {
        if (!items)
            return null;
        const item = items.filter(i => i.name == this.name)[0];
        if (item)
            return `${path}.items[${items.indexOf(item)}]`;
        for (let i = 0; i < items.length; i++) {
            const result = this.getDataOptionNameCore(items[i].items, `${path}.items[${i}]`);
            if (result)
                return result;
        }
        return null;
    }
}
ToolbarSubMenuItem.SelectedItemClassName = 'dx-menu-item-selected';
