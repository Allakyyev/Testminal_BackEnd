import { EvtUtils } from '@devexpress/utils/lib/utils/evt';
import { Browser } from '@devexpress/utils/lib/browser';
import { DomUtils } from '@devexpress/utils/lib/utils/dom';
import { KeyCode, KeyUtils } from '@devexpress/utils/lib/utils/key';
import { RichEditClientCommand } from '../commands/client-command';
export class QuickSearchPanel {
    constructor(owner, searchManager) {
        this.owner = owner;
        this.searchManager = searchManager;
        this.initialize();
    }
    get core() { return this.owner.core; }
    dispose() {
        if (this.isVisible())
            this.onClose(true);
        DomUtils.hideNode(this.resultLabel);
        this.owner = null;
        this.searchManager = null;
        clearTimeout(this.timerId);
        DomUtils.hideNode(this.searchField);
    }
    initialize() {
        this.createElements();
        this.timerId = null;
        this.height = DomUtils.getClearClientHeight(this.getQuickSearchPanelWrapper());
        this.attachEvents();
        this.initializeFields();
    }
    initializeFields() {
        if (this.searchManager.whatFind) {
            this.getSearchField().value = this.searchManager.whatFind;
            if (this.searchManager.foundIntervals.length)
                this.updateSearchInfo(-1);
            else
                this.findAll();
        }
    }
    createElements() { }
    attachEvents() {
        const searchField = this.getSearchField();
        const prevBtn = this.getPrevButton();
        const nextBtn = this.getNextButton();
        const collapseBtn = this.getCollapseButton();
        const closeBtn = this.getCloseButton();
        const that = this;
        closeBtn.onclick = function () { that.hide(true); };
        collapseBtn.onclick = function () { that.showFindReplaceDialog(); };
        prevBtn.onclick = function () {
            if (that.searchManager.foundIntervals.length)
                that.findPrev();
            else
                that.findAll();
        };
        nextBtn.onclick = function () {
            if (that.searchManager.foundIntervals.length)
                that.findNext();
            else
                that.findAll();
        };
        searchField.onkeydown = function (e) {
            var keyCode = KeyUtils.getEventKeyCode(e);
            if (keyCode === KeyCode.Esc) {
                that.hide(true);
            }
            else if (keyCode === KeyCode.Enter) {
                if (that.searchManager.foundIntervals.length)
                    if (e.shiftKey)
                        that.findPrev();
                    else
                        that.findNext();
                else
                    that.findAll();
                EvtUtils.preventEvent(e);
            }
            else {
                var shortcutCode = KeyUtils.getShortcutCodeByEvent(e);
                if (shortcutCode === QuickSearchPanel.shortcuts.showDialog || shortcutCode === QuickSearchPanel.shortcuts.showPanel) {
                    EvtUtils.preventEvent(e);
                    if (shortcutCode === QuickSearchPanel.shortcuts.showDialog)
                        that.showFindReplaceDialog();
                }
            }
        };
        searchField.onkeyup = function (e) {
            clearTimeout(that.timerId);
            var keyCode = KeyUtils.getEventKeyCode(e);
            if (keyCode === KeyCode.Enter)
                return;
            if (!that.getSearchField().value) {
                that.clearResult();
                that.searchManager.resetSearch();
                return;
            }
            that.timerId = setTimeout(function () {
                that.findAll();
            }, 700);
        };
    }
    findNext() {
        var index = this.searchManager.findNextIntervalIndex();
        if (index !== null) {
            this.searchManager.selectIntervalByIndex(index);
            this.searchManager.scrollToIntervalByIndex(index);
            this.updateSearchInfo(index);
        }
    }
    findPrev() {
        var index = this.searchManager.findPrevIntervalIndex();
        if (index !== null) {
            this.searchManager.selectIntervalByIndex(index);
            this.searchManager.scrollToIntervalByIndex(index);
            this.updateSearchInfo(index);
        }
    }
    findAll() {
        var whatFind = this.getSearchField().value;
        if (whatFind) {
            this.searchManager.findAll(whatFind, false);
            this.updateSearchInfo(-1);
            var index = this.searchManager.findNextIntervalIndex();
            if (index !== null)
                this.searchManager.scrollToIntervalByIndex(index);
        }
    }
    updateSearchInfo(index) {
        if (this.searchManager.foundIntervals.length) {
            var resultText = index >= 0 ?
                `${index + 1} ${this.core.stringResources.quickSearchPanel.of} ${this.searchManager.foundIntervals.length}` :
                this.core.stringResources.quickSearchPanel.items + ": " + this.searchManager.foundIntervals.length;
            this.setResult(resultText);
            return;
        }
        this.setResult(this.core.stringResources.quickSearchPanel.noMatches);
    }
    setResult(text) {
        this.getResultLabel().innerHTML = text;
    }
    clearResult() {
        this.getResultLabel().innerHTML = "";
    }
    getQuickSearchPanelWrapper() {
        return this.owner.getChildElement(QuickSearchPanel.wrapperPostfix);
    }
    getSearchField() {
        if (!this.searchField) {
            const inputElements = this.owner.getChildElement(QuickSearchPanel.wrapperPostfix).getElementsByTagName("INPUT");
            for (let i = 0, element; element = inputElements[i]; i++)
                if (element.type.toLowerCase() === "text") {
                    this.searchField = element;
                    break;
                }
        }
        return this.searchField;
    }
    getPrevButton() {
        return this.owner.getChildElement(QuickSearchPanel.prevBtnPostfix);
    }
    getNextButton() {
        return this.owner.getChildElement(QuickSearchPanel.nextBtnPostfix);
    }
    getCollapseButton() {
        return this.owner.getChildElement(QuickSearchPanel.collapseBtnPostfix);
    }
    getCloseButton() {
        return this.owner.getChildElement(QuickSearchPanel.closeBtnPostfix);
    }
    getResultLabel() {
        if (!this.resultLabel) {
            var inputElement = this.getSearchField();
            var tdContainer = inputElement.parentElement;
            const span = document.createElement("SPAN");
            span.classList.add('dxreSearchResult');
            tdContainer.appendChild(span);
            span.style.lineHeight = `${tdContainer.offsetHeight}px`;
            this.resultLabel = span;
        }
        return this.resultLabel;
    }
    NotifySearchReset() {
        this.clearResult();
    }
    showFindReplaceDialog() {
        this.core.commandManager.getCommand(RichEditClientCommand.Replace).execute(this.core.commandManager.isPublicApiCall);
    }
    show() {
        if (!this.isVisible() && !this.owner.hasActiveDialog()) {
            var panel = this.getQuickSearchPanelWrapper();
            panel.style.visibility = "visible";
            panel.style.height = this.height + "px";
            this.searchManager.onChanged.add(this);
            this.initializeFields();
        }
        DomUtils.setFocus(this.getSearchField());
        this.getSearchField().select();
    }
    hide(resetSearch) {
        if (this.isVisible()) {
            var panel = this.getQuickSearchPanelWrapper();
            panel.style.height = "0px";
            panel.style.visibility = "hidden";
            this.onClose(resetSearch);
        }
    }
    onClose(resetSearch) {
        if (resetSearch)
            this.searchManager.resetSearch();
        this.searchManager.onChanged.remove(this);
        this.getSearchField().value = "";
        this.clearResult();
        this.core.focusManager.captureFocus();
    }
    isVisible() {
        var style = DomUtils.getCurrentStyle(this.getQuickSearchPanelWrapper());
        return style.visibility !== "hidden";
    }
}
QuickSearchPanel.shortcuts = {
    showPanel: KeyUtils.parseShortcutString(Browser.MacOSPlatform ? "CMD+F" : "CTRL+F"),
    showDialog: KeyUtils.parseShortcutString(Browser.MacOSPlatform ? "CMD+H" : "CTRL+H")
};
QuickSearchPanel.containerPostfix = "_QS";
QuickSearchPanel.wrapperPostfix = "_QSPW";
QuickSearchPanel.prevBtnPostfix = "_QSPPrevBtn";
QuickSearchPanel.nextBtnPostfix = "_QSPNextBtn";
QuickSearchPanel.collapseBtnPostfix = "_QSPCollapseBtn";
QuickSearchPanel.closeBtnPostfix = "_QSPCloseBtn";
