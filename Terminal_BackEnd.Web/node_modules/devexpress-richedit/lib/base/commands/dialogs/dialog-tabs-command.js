import { DocumentDefaultTabWidthHistoryItem } from '../../../core/model/history/items/document-properties-history-items';
import { DeleteTabAtParagraphHistoryItem, InsertTabToParagraphHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { TabProperties } from '../../../core/model/paragraph/paragraph-style';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogTabsCommand extends ShowDialogCommandBase {
    createParameters(_options) {
        var parameters = new DialogTabsParameters();
        parameters.defaultTabStop = this.control.modelManager.model.defaultTabWidth;
        var paragraphIndices = this.selection.activeSubDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        if (this.paragraphsHasEqualTabProperties(paragraphIndices))
            parameters.tabProperties = this.selection.activeSubDocument.paragraphs[paragraphIndices[0]].tabs.clone();
        else
            parameters.tabProperties = new TabProperties();
        return parameters;
    }
    applyParameters(_state, newParams, initParams) {
        var modelManipulator = this.modelManipulator;
        this.history.beginTransaction();
        if (newParams.defaultTabStop && newParams.defaultTabStop !== initParams.defaultTabStop)
            this.history.addAndRedo(new DocumentDefaultTabWidthHistoryItem(modelManipulator, newParams.defaultTabStop));
        this.deleteAllTabs();
        var paragraphIndices = this.selection.activeSubDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        for (let i = 0, tabInfo; tabInfo = newParams.tabProperties.tabsInfo[i]; i++) {
            for (let j = paragraphIndices.length - 1; j >= 0; j--) {
                let paragraphIndex = paragraphIndices[j];
                let paragraph = this.selection.activeSubDocument.paragraphs[paragraphIndex];
                this.history.addAndRedo(new InsertTabToParagraphHistoryItem(modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, paragraph.interval), tabInfo));
            }
        }
        this.history.endTransaction();
        return true;
    }
    deleteAllTabs() {
        var modelManipulator = this.modelManipulator;
        var paragraphIndices = this.selection.activeSubDocument.getParagraphIndicesByIntervals(this.selection.intervals);
        for (let i = paragraphIndices.length - 1; i >= 0; i--) {
            var paragraph = this.selection.activeSubDocument.paragraphs[paragraphIndices[i]];
            var interval = paragraph.interval;
            let tabs = paragraph.getTabs();
            let tab;
            while (tab = tabs.positions.pop())
                this.history.addAndRedo(new DeleteTabAtParagraphHistoryItem(modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, interval), tab));
        }
    }
    paragraphsHasEqualTabProperties(paragraphIndices) {
        var firstParagraph = this.selection.activeSubDocument.paragraphs[paragraphIndices[0]];
        for (let i = paragraphIndices.length - 1; i > 0; i--) {
            let paragraph = this.selection.activeSubDocument.paragraphs[paragraphIndices[i]];
            if (!firstParagraph.tabs.equals(paragraph.tabs))
                return false;
        }
        return true;
    }
    getDialogName() {
        return "Tabs";
    }
}
export class DialogTabsParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.defaultTabStop = obj.defaultTabStop;
        this.tabProperties = obj.tabProperties.clone();
    }
    clone() {
        const newInstance = new DialogTabsParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(converter) {
        if (this.defaultTabStop)
            this.defaultTabStop = converter(this.defaultTabStop);
        return this;
    }
}
