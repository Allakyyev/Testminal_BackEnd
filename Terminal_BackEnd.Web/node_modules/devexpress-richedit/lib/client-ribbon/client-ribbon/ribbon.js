import { formatMessage } from 'devextreme/localization';
import dxTabPanel from 'devextreme/ui/tab_panel';
import dxToolbar from 'devextreme/ui/toolbar';
import { currentTheme } from 'devextreme/viz/themes';
import { ToolbarButtonGroupItem } from './toolbar-items/toolbar-button-group-item';
import { ToolbarButtonItem } from './toolbar-items/toolbar-button-item';
import { ToolbarColorBoxItem } from './toolbar-items/toolbar-color-box-item';
import { ToolbarMenuItem } from './toolbar-items/toolbar-menu-item';
import { ToolbarNumberBoxItem } from './toolbar-items/toolbar-number-box-item';
import { ToolbarSelectBoxItem } from './toolbar-items/toolbar-select-box-item';
import { ToolbarSeparatorItem } from './toolbar-items/toolbar-separator-item';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
export class Ribbon {
    constructor(options) {
        this.options = options;
        this.toolbars = [];
        this.toolBarItemsByName = {};
        this.contextItemIndexesByCategoryName = {};
    }
    get element() { return this.options.element; }
    dispose() {
        this.tabPanel.dispose();
        this.toolbars.forEach(tb => tb.dispose());
        Ribbon.hideNode(this.options.element);
    }
    static hideNode(node) {
        if (node) {
            const parentNode = node.parentNode;
            if (parentNode)
                parentNode.removeChild(node);
        }
    }
    shouldApplyLocalization(text, localizationId) {
        return !text && !!localizationId;
    }
    applyLocalizationId() {
        this.options.items.forEach((ribbonItem) => {
            this.applyLocalizationIdToRibbonItem(ribbonItem);
        });
        this.options.contextItemsCategories.forEach((category) => {
            category.items.forEach((ribbonItem) => {
                this.applyLocalizationIdToRibbonItem(ribbonItem);
            });
        });
    }
    applyLocalizationIdToRibbonItem(ribbonItem) {
        if (this.shouldApplyLocalization(ribbonItem.title, ribbonItem.localizationId))
            ribbonItem.title = formatMessage(ribbonItem.localizationId);
        this.applyLocalizationIdToRibbonItems(ribbonItem.items);
    }
    applyLocalizationIdToRibbonItems(items) {
        items.forEach((item) => {
            switch (item.type) {
                case 'Button':
                    const button = item;
                    if (this.shouldApplyLocalization(button.text, button.localizationId))
                        button.text = formatMessage(button.localizationId);
                    break;
                case 'Menu':
                    const menu = item;
                    if (this.shouldApplyLocalization(menu.text, menu.localizationId))
                        menu.text = formatMessage(menu.localizationId);
                    this.applyLocalizationIdToSubMenuItemOptions(menu.items);
                    break;
                case 'ButtonGroup':
                    break;
                case 'NumberBox':
                    const numberBox = item;
                    if (this.shouldApplyLocalization(numberBox.text, numberBox.localizationId))
                        numberBox.text = formatMessage(numberBox.localizationId);
                    break;
                case 'ColorBox':
                    const colorBox = item;
                    if (this.shouldApplyLocalization(colorBox.text, colorBox.localizationId))
                        colorBox.text = formatMessage(colorBox.localizationId);
                    break;
                case 'SelectBox':
                    const selectBox = item;
                    if (selectBox._localizeDataSourceItems)
                        selectBox.dataSource.forEach(style => {
                            if (style.localizationId) {
                                const localizedText = formatMessage(style.localizationId);
                                style.text = style.text ? style.text + localizedText : localizedText;
                            }
                        });
                    break;
                default:
                    break;
            }
        });
    }
    applyLocalizationIdToSubMenuItemOptions(items) {
        items.forEach((item) => {
            if (this.shouldApplyLocalization(item.text, item.localizationId))
                item.text = formatMessage(item.localizationId);
            if (item.items)
                this.applyLocalizationIdToSubMenuItemOptions(item.items);
        });
    }
    render() {
        this.applyLocalizationId();
        this.tabPanel = new dxTabPanel(this.options.element, {
            dataSource: this.getRibbonItems().map((t, index) => ({
                title: t.title,
                visible: t.visible,
                template: () => this.createToolbar(t.items, index)
            })),
            deferRendering: false,
            elementAttr: { class: `dx-ribbon ${currentTheme()}` },
            focusStateEnabled: false,
            selectedIndex: this.options.activeTabIndex,
            loop: false,
            animationEnabled: false,
            swipeEnabled: false,
            showNavButtons: true,
            onTitleClick: this.options.onTitleClickHandler,
            onSelectionChanged: this.options.onSelectionChangedHandler
        });
    }
    getActiveTabIndex() {
        return this.tabPanel.option('selectedIndex');
    }
    setActiveTabIndex(index) {
        this.tabPanel.option('selectedIndex', index);
    }
    setItemVisible(itemIndex, visible) {
        return this.tabPanel.option(`items[${itemIndex}].visible`, visible);
    }
    getItemVisible(itemIndex) {
        return this.tabPanel.option(`items[${itemIndex}].visible`);
    }
    setContextItemsCategoryVisible(categoryName, visible) {
        var itemsIndexes = this.getContextItemsIndexes(categoryName);
        if (!itemsIndexes)
            return;
        let needResetActiveTab = false;
        const activeTabIndex = this.getActiveTabIndex();
        itemsIndexes.forEach(itemIndex => {
            if (this.getItemVisible(itemIndex) !== visible) {
                if (activeTabIndex == itemIndex && !visible)
                    needResetActiveTab = true;
                this.setItemVisible(itemIndex, visible);
            }
        });
        if (needResetActiveTab)
            this.setActiveTabIndex(this.options.activeTabIndex);
    }
    getContextItemsCategoryVisible(categoryName) {
        var itemsIndexes = this.getContextItemsIndexes(categoryName);
        if (!itemsIndexes || !itemsIndexes.length)
            return false;
        return this.getItemVisible(itemsIndexes[0]);
    }
    getContextItemsIndexes(categoryName) {
        return this.contextItemIndexesByCategoryName[categoryName];
    }
    getTabPanel() {
        return this.tabPanel;
    }
    getItems(name) {
        return name && this.toolBarItemsByName[name] ? this.toolBarItemsByName[name] : null;
    }
    adjustControl() {
        this.tabPanel._dimensionChanged();
        this.toolbars.forEach(t => t._dimensionChanged());
    }
    getRibbonItems() {
        let items = [].concat(this.options.items);
        if (this.options.contextItemsCategories) {
            this.options.contextItemsCategories.forEach(ci => {
                if (!this.contextItemIndexesByCategoryName[ci.name])
                    this.contextItemIndexesByCategoryName[ci.name] = [];
                ci.items.forEach((_cii, index) => {
                    this.contextItemIndexesByCategoryName[ci.name].push(index + items.length);
                });
                items = items.concat(ci.items.map(cii => ({
                    items: cii.items,
                    title: cii.title,
                    visible: false
                })));
            });
        }
        return items;
    }
    createToolbar(toolbarItems, tabIndex) {
        const element = document.createElement('div');
        const toolbarOptions = {
            dataSource: this.getToolbarItemTemplates(toolbarItems, tabIndex),
            onInitialized: (e) => this.toolbars.push(e.component),
            onItemRendered: (e) => {
                if (e.itemData.dxIsSeparator)
                    ToolbarSeparatorItem.prepareElement(e.itemElement);
            }
        };
        new dxToolbar(element, toolbarOptions);
        return element;
    }
    getToolbarItemTemplates(toolbarItems, tabIndex) {
        let items = [];
        toolbarItems.forEach(toolbarItem => {
            items = items.concat(this.getToolbarItems(toolbarItem, tabIndex));
        });
        const templates = [];
        let prevItem;
        items.forEach(i => {
            if (i instanceof ToolbarSeparatorItem && (!prevItem || prevItem instanceof ToolbarSeparatorItem))
                return;
            templates.push(i.createToolbarItemTemplate());
            prevItem = i;
        });
        return templates;
    }
    getToolbarItems(options, tabIndex) {
        const result = [];
        if (options.beginGroup)
            result.push(new ToolbarSeparatorItem());
        result.push(this.interactiveToolbarItemFactory(options, tabIndex));
        return result;
    }
    interactiveToolbarItemFactory(options, tabIndex) {
        let item;
        switch (options.type) {
            case 'Button':
                item = new ToolbarButtonItem(options, this.options.onCommandExecuted);
                break;
            case 'ButtonGroup':
                item = new ToolbarButtonGroupItem(options, this.options.onCommandExecuted);
                break;
            case 'Menu':
                item = new ToolbarMenuItem(options, this.options.onCommandExecuted, (i) => {
                    this.addItemToCache(i.name, i);
                    this.raiseOnOnToolbarItemCreated(options, i, tabIndex);
                });
                break;
            case 'NumberBox':
                item = new ToolbarNumberBoxItem(options, this.options.onCommandExecuted);
                break;
            case 'ColorBox':
                item = new ToolbarColorBoxItem(options, this.options.onCommandExecuted, this.options.onOpened, this.options.onClosed);
                break;
            default:
                item = new ToolbarSelectBoxItem(options, this.options.onCommandExecuted);
        }
        this.addItemToCache(options.name, item);
        this.raiseOnOnToolbarItemCreated(options, item, tabIndex);
        return item;
    }
    addItemToCache(name, item) {
        if (!name)
            return;
        if (!this.toolBarItemsByName[name])
            this.toolBarItemsByName[name] = [];
        this.toolBarItemsByName[name].push(item);
    }
    raiseOnOnToolbarItemCreated(options, item, tabIndex) {
        if (!this.options.onOnToolbarItemCreated)
            return;
        this.options.onOnToolbarItemCreated({
            options: options,
            item: item,
            tabIndex: tabIndex
        });
    }
    containsChild(element) {
        return DomUtils.isItParent(this.element, element);
    }
}
