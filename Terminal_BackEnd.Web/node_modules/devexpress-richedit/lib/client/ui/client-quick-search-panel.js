import dxToolbar from 'devextreme/ui/toolbar';
import { QuickSearchPanel } from '../../base/ui/quick-search-panel';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { DxtThemeCssClasses } from '../../dxt-utils/dxt-utils/dxt-theme-css-classes';
import { DxtUtils } from '../../dxt-utils/dxt-utils/dxt-utils';
export class ClientQuickSearchPanel extends QuickSearchPanel {
    initialize() {
        super.initialize();
        this.getQuickSearchPanelWrapper().parentElement.style.display = 'none';
    }
    show() {
        this.getQuickSearchPanelWrapper().parentElement.style.display = 'block';
        super.show();
    }
    hide(resetSearch) {
        super.hide(resetSearch);
        this.getQuickSearchPanelWrapper().parentElement.style.display = 'none';
    }
    dispose() {
        super.dispose();
        this.searchTextBox.dispose();
        this.searchTextBox = null;
        this.resultButton = null;
        DomUtils.hideNode(this.searchTextBoxField);
        this.searchTextBoxField = null;
    }
    createElements() {
        const quickSearchContainer = this.createQuickSearchContainer();
        const wrapper = this.createWrapper();
        quickSearchContainer.appendChild(wrapper);
        const quickSearchPanel = this.createQuickSearchPanel();
        wrapper.appendChild(quickSearchPanel);
        const toolbarElement = document.createElement('div');
        quickSearchPanel.appendChild(toolbarElement);
        new dxToolbar(toolbarElement, {
            items: this.createToolbarItems()
        });
    }
    getSearchField() {
        if (!this.searchTextBoxField) {
            const rawElement = this.searchTextBox.element();
            const element = rawElement.querySelector ? rawElement : rawElement[0];
            this.searchTextBoxField = element.querySelector('input');
        }
        return this.searchTextBoxField;
    }
    setResult(text) {
        this.resultButton.option({
            text,
            visible: true
        });
    }
    clearResult() {
        this.resultButton.option('visible', false);
    }
    createQuickSearchContainer() {
        const richElement = this.owner.getMainElement();
        const quickSearchContainer = document.createElement('DIV');
        quickSearchContainer.id = this.owner.name + QuickSearchPanel.containerPostfix;
        DomUtils.addClassName(quickSearchContainer, 'dxreQuickSearch');
        richElement.insertBefore(quickSearchContainer, richElement.childNodes[2]);
        return quickSearchContainer;
    }
    createWrapper() {
        var wrapper = document.createElement('DIV');
        wrapper.id = this.owner.name + QuickSearchPanel.wrapperPostfix;
        DomUtils.addClassName(wrapper, 'dxreQuickSearchPanelWrapper');
        return wrapper;
    }
    createQuickSearchPanel() {
        const quickSearchPanel = document.createElement('DIV');
        DomUtils.addClassName(quickSearchPanel, 'dxreQuickSearchPanel');
        DomUtils.addClassName(quickSearchPanel, DxtThemeCssClasses.BorderColor);
        DomUtils.addClassName(quickSearchPanel, DxtThemeCssClasses.BackgroundColor);
        return quickSearchPanel;
    }
    getButtonId(postfix) {
        return this.owner.name + postfix;
    }
    createToolbarItems() {
        return [
            this.createToolbarTextBoxTemplate(),
            this.createToolbarButtonTemplate(QuickSearchPanel.prevBtnPostfix, 'dxre-icon-Prev'),
            this.createToolbarButtonTemplate(QuickSearchPanel.nextBtnPostfix, 'dxre-icon-Next'),
            this.createToolbarButtonTemplate(QuickSearchPanel.collapseBtnPostfix, 'dxre-icon-ViewMergedData'),
            this.createToolbarButtonTemplate(QuickSearchPanel.closeBtnPostfix, 'dxre-icon-ClearHeaderAndFooter')
        ];
    }
    createToolbarTextBoxTemplate() {
        return {
            widget: 'dxTextBox',
            options: {
                onInitialized: e => this.searchTextBox = e.component,
                stylingMode: 'filled',
                width: '250px',
                buttons: [
                    {
                        name: 'result',
                        location: 'after',
                        options: {
                            stylingMode: 'text',
                            focusStateEnabled: false,
                            hoverStateEnabled: false,
                            activeStateEnabled: false,
                            visible: false,
                            elementAttr: {
                                class: 'dxreSearchResult'
                            },
                            onInitialized: e => {
                                this.resultButton = e.component;
                                const el = (e.element.addEventListener ? e.element : e.element[0]);
                                el.addEventListener('mousedown', e => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    this.searchTextBox.focus();
                                });
                            }
                        }
                    }
                ]
            }
        };
    }
    createToolbarButtonTemplate(postfix, icon) {
        return {
            widget: 'dxButton',
            options: {
                stylingMode: "text",
                icon: DxtUtils.correctIconName(icon),
                elementAttr: { id: this.getButtonId(postfix) }
            }
        };
    }
}
