import { QuickSearchPanel } from '../../base/ui/quick-search-panel';
export declare class ClientQuickSearchPanel extends QuickSearchPanel {
    private searchTextBox;
    private resultButton;
    private searchTextBoxField;
    initialize(): void;
    show(): void;
    hide(resetSearch: boolean): void;
    dispose(): void;
    createElements(): void;
    getSearchField(): HTMLInputElement;
    setResult(text: string): void;
    clearResult(): void;
    private createQuickSearchContainer;
    private createWrapper;
    private createQuickSearchPanel;
    private getButtonId;
    private createToolbarItems;
    private createToolbarTextBoxTemplate;
    private createToolbarButtonTemplate;
}
//# sourceMappingURL=client-quick-search-panel.d.ts.map