import { RichEditClientCommand } from '../../base/commands/client-command';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { RibbonTabType } from '../public/ribbon/tab';
var CategoryType;
(function (CategoryType) {
    CategoryType[CategoryType["Common"] = 0] = "Common";
    CategoryType[CategoryType["Picture"] = 1] = "Picture";
    CategoryType[CategoryType["TextBox"] = 2] = "TextBox";
    CategoryType[CategoryType["Table"] = 3] = "Table";
    CategoryType[CategoryType["HeaderFooter"] = 4] = "HeaderFooter";
    CategoryType[CategoryType["NUMBER"] = 5] = "NUMBER";
})(CategoryType || (CategoryType = {}));
class Category {
    constructor(tabId, contextTabItemId) {
        this.tabIndex = null;
        this.initialTabIndex = null;
        this.setted = false;
        this.tabId = tabId;
        this.contextTabItemId = contextTabItemId;
    }
    setInitialTabIndex(tabIndex) {
        this.initialTabIndex = tabIndex;
        this.tabIndex = tabIndex;
    }
}
export class ActiveContextTabManager {
    constructor(barHolder) {
        this.currCategoryType = CategoryType.Common;
        this.ribbonVisible = false;
        this.forbidChangeActiveTabIndex = false;
        this.barHolder = barHolder;
        this.categories = [];
        ListUtils.initByCallback(CategoryType.NUMBER, catInd => this.categories[catInd] = new Category(ActiveContextTabManager.categoryToInitialTabId[catInd], ActiveContextTabManager.categoryToContextTabItemId[catInd]));
    }
    init(apiRibbon) {
        this.ribbonVisible = apiRibbon.visible;
        if (!this.ribbonVisible)
            return;
        this.setState(apiRibbon);
    }
    NotifySelectionChanged(selection) {
        if (!this.ribbonVisible)
            return;
        let activeTabIndex = null;
        const applyCategory = (categoryType) => {
            if (this.currCategoryType !== categoryType) {
                const prevCat = this.categories[this.currCategoryType];
                prevCat.tabIndex = this.barHolder.ribbon.getActiveTabIndex();
                prevCat.tabId = this.apiTabs[prevCat.tabIndex].id;
                this.currCategoryType = categoryType;
                const currCat = this.categories[categoryType];
                activeTabIndex = currCat.tabIndex === null ? prevCat.tabIndex : currCat.tabIndex;
            }
        };
        const visibleContextTabIds = {};
        let contextCategoryChosen = false;
        for (const info of ActiveContextTabManager.selectionOrder) {
            const visible = info.check(selection);
            const contextTabItemId = this.categories[info.category].contextTabItemId;
            if (!visibleContextTabIds[contextTabItemId])
                visibleContextTabIds[contextTabItemId] = visible;
            if (!contextCategoryChosen && visible) {
                applyCategory(info.category);
                contextCategoryChosen = true;
            }
        }
        if (!contextCategoryChosen)
            applyCategory(CategoryType.Common);
        NumberMapUtils.forEach(visibleContextTabIds, (visible, cmdId) => this.barHolder.ribbon.setContextItemVisible(cmdId, visible));
        if (activeTabIndex !== null && !this.forbidChangeActiveTabIndex)
            this.setActiveTab(activeTabIndex);
    }
    setActiveTab(activeTabIndex) {
        const actTab = this.apiTabs[activeTabIndex];
        if (actTab.contextTab) {
            if (!this.barHolder.ribbon.getTabVisible(activeTabIndex)) {
                activeTabIndex = this.categories[this.currCategoryType].initialTabIndex;
                if (activeTabIndex == null)
                    activeTabIndex = this.categories[CategoryType.Common].tabIndex;
            }
        }
        this.barHolder.ribbon.setActiveTabIndex(activeTabIndex);
    }
    setState(apiRibbon) {
        this.apiTabs = apiRibbon.tabs;
        const setUnsetted = () => {
            this.apiTabs.forEach((tab, tabIndex) => {
                for (const cat of this.categories) {
                    if (!cat.setted) {
                        if (cat.tabId == tab.id) {
                            cat.setInitialTabIndex(tabIndex);
                            cat.setted = true;
                        }
                    }
                }
            });
            return ListUtils.allOf(this.categories, state => state.setted);
        };
        for (const cat of this.categories) {
            cat.setted = false;
            cat.setInitialTabIndex(null);
        }
        if (setUnsetted())
            return;
        this.categories.forEach((state, stateIndex) => {
            if (!state.setted)
                state.tabId = ActiveContextTabManager.categoryToInitialTabId[stateIndex];
        });
        if (setUnsetted())
            return;
        const commonCat = this.categories[CategoryType.Common];
        if (!commonCat.setted)
            commonCat.setInitialTabIndex(apiRibbon.activeTabIndex);
    }
}
ActiveContextTabManager.categoryToInitialTabId = {
    [CategoryType.Common]: RibbonTabType.Home,
    [CategoryType.Picture]: RibbonTabType.FloatingObjectsFormat,
    [CategoryType.TextBox]: RibbonTabType.FloatingObjectsFormat,
    [CategoryType.Table]: RibbonTabType.TableDesign,
    [CategoryType.HeaderFooter]: RibbonTabType.HeadersFooters,
};
ActiveContextTabManager.categoryToContextTabItemId = {
    [CategoryType.Common]: null,
    [CategoryType.Picture]: RichEditClientCommand.ContextItem_FloatingObjects,
    [CategoryType.TextBox]: RichEditClientCommand.ContextItem_FloatingObjects,
    [CategoryType.Table]: RichEditClientCommand.ContextItem_Tables,
    [CategoryType.HeaderFooter]: RichEditClientCommand.ContextItem_HeadersFooters,
};
ActiveContextTabManager.selectionOrder = [
    { category: CategoryType.Picture, check: (selection) => selection.specialRunInfo.isPictureSelected() },
    { category: CategoryType.Table, check: (selection) => selection.tableInfo.isSelected },
    { category: CategoryType.TextBox, check: (selection) => selection.specialRunInfo.isTextBoxSelected() },
    { category: CategoryType.HeaderFooter, check: (selection) => selection.getState().intervalsInfo.subDocument.isHeaderFooter() },
];
