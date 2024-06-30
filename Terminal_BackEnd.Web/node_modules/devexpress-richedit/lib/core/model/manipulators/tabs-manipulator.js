import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { TabDeletedSubDocumentChange } from '../changes/sub-document/tab/deleted';
import { TabInsertedSubDocumentChange } from '../changes/sub-document/tab/inserted';
import { HistoryItemIntervalState } from '../history/states/history-item-state';
import { HistoryItemTabStateObject } from '../history/states/history-item-state-object';
import { BaseManipulator } from './base-manipulator';
export class TabsManipulator extends BaseManipulator {
    insertTabToParagraph(subDocument, interval, tabInfo) {
        const paragraphs = subDocument.getParagraphsByInterval(interval);
        const oldState = new HistoryItemIntervalState();
        const newState = new HistoryItemIntervalState();
        for (let paragraph of paragraphs) {
            if (this.addTab(paragraph.tabs, tabInfo.clone())) {
                const parInterval = paragraph.interval;
                oldState.register(new HistoryItemTabStateObject(parInterval, tabInfo.clone()));
                newState.register(new HistoryItemTabStateObject(parInterval, tabInfo.clone()));
            }
        }
        if (newState.lastObject)
            this.modelManipulator.notifyModelChanged(new TabInsertedSubDocumentChange(subDocument.id, newState));
        return oldState;
    }
    deleteTabAtParagraph(subDocument, interval, tabInfo) {
        const paragraphs = subDocument.getParagraphsByInterval(interval);
        const oldState = new HistoryItemIntervalState();
        const newState = new HistoryItemIntervalState();
        for (let paragraph of paragraphs) {
            let tabs = paragraph.getTabs();
            if (SearchUtils.binaryIndexOf(tabs.positions, (t) => t.position - tabInfo.position) > -1) {
                this.deleteTab(paragraph.tabs, tabInfo);
                const parInterval = paragraph.interval;
                oldState.register(new HistoryItemTabStateObject(parInterval, tabInfo.clone()));
                newState.register(new HistoryItemTabStateObject(parInterval, tabInfo.clone()));
                if (SearchUtils.binaryIndexOf(paragraph.paragraphStyle.tabs.tabsInfo, (t) => t.position - tabInfo.position) > -1) {
                    tabInfo.deleted = true;
                    this.addTab(paragraph.tabs, tabInfo.clone());
                }
            }
        }
        this.modelManipulator.notifyModelChanged(new TabDeletedSubDocumentChange(subDocument.id, newState));
        return oldState;
    }
    restoreInsertedTabToParagraph(subDocument, state) {
        if (state.isEmpty())
            return;
        for (let stateObject of state.objects) {
            const tabInfo = stateObject.value;
            const paragraphs = subDocument.getParagraphsByInterval(stateObject.interval);
            for (let paragraph of paragraphs)
                this.deleteTab(paragraph.tabs, tabInfo);
        }
        this.modelManipulator.notifyModelChanged(new TabDeletedSubDocumentChange(subDocument.id, state));
    }
    restoreDeletedTabAtParagraph(subDocument, state) {
        if (state.isEmpty())
            return;
        for (let stateObject of state.objects) {
            const tabInfo = stateObject.value;
            const paragraphs = subDocument.getParagraphsByInterval(stateObject.interval);
            for (let paragraph of paragraphs)
                this.addTab(paragraph.tabs, tabInfo.clone());
        }
        this.modelManipulator.notifyModelChanged(new TabInsertedSubDocumentChange(subDocument.id, state));
    }
    deleteTab(tabProps, tabInfo) {
        let index = tabProps.indexOf(tabInfo);
        if (index < 0)
            return false;
        tabProps.deleteByIndex(index);
        return true;
    }
    addTab(tabProps, tabInfo) {
        let index = tabProps.indexOf(tabInfo);
        if (index >= 0 && tabInfo.equals(tabProps.tabsInfo[index]))
            return false;
        tabProps.add(tabInfo);
        return true;
    }
}
