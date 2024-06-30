import { Errors } from '@devexpress/utils/lib/errors';
export class HistoryItem {
    constructor(modelManipulator) {
        this.uniqueId = -1;
        this.modelManipulator = modelManipulator;
    }
    canBeMerged() {
        return false;
    }
    changeModified() {
        return true;
    }
}
export class CompositionHistoryItem extends HistoryItem {
    constructor() {
        super(null);
        this.historyItems = [];
    }
    canBeMerged() {
        return true;
    }
    changeModified() {
        var item;
        for (var i = 0; item = this.historyItems[i]; i++) {
            if (item.changeModified())
                return true;
        }
        return false;
    }
    redo() {
        var item;
        for (var i = 0; item = this.historyItems[i]; i++)
            item.redo();
    }
    undo() {
        var item;
        for (var i = this.historyItems.length - 1; item = this.historyItems[i]; i--)
            item.undo();
    }
    add(historyItem) {
        if (historyItem == null)
            throw new Error(Errors.ValueCannotBeNull);
        this.historyItems.push(historyItem);
    }
}
