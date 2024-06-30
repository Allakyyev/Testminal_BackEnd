import { ControlOptions } from '../../options/control';
import { CompositionHistoryItem } from './history-item';
export class History {
    constructor(options) {
        this.historyItems = [];
        this.currentIndex = -1;
        this.transaction = null;
        this.incrementalId = -1;
        this.transactionLevel = -1;
        this.unmodifiedIndex = -1;
        this.isProcessingUndo = false;
        this.currTransactionId = 0;
        this.transactionMap = {};
        this.options = options;
    }
    isModified() {
        if (this.unmodifiedIndex == this.currentIndex)
            return false;
        var startIndex = Math.min(this.unmodifiedIndex, this.currentIndex);
        var endIndex = Math.max(this.unmodifiedIndex, this.currentIndex);
        for (var i = startIndex + 1; i <= endIndex; i++) {
            if (this.historyItems[i].changeModified())
                return true;
        }
        return false;
    }
    undo() {
        if (!this.canUndo())
            return;
        this.isProcessingUndo = true;
        this.historyItems[this.currentIndex].undo();
        this.currentIndex--;
        this.isProcessingUndo = false;
    }
    redo() {
        if (!this.canRedo())
            return;
        this.currentIndex++;
        this.historyItems[this.currentIndex].redo();
    }
    canUndo() {
        return this.currentIndex >= 0 && ControlOptions.isEnabled(this.options.undo);
    }
    canRedo() {
        return this.currentIndex < this.historyItems.length - 1 && ControlOptions.isEnabled(this.options.undo);
    }
    beginTransaction() {
        this.transactionLevel++;
        if (this.transactionLevel == 0)
            this.transaction = new CompositionHistoryItem();
        const id = this.currTransactionId++;
        this.transactionMap[id] = this.transaction;
        return id;
    }
    addTransaction(action, isUnderUndo = false) {
        this.beginTransaction();
        action(this);
        this.endTransaction(isUnderUndo);
    }
    endTransaction(isUnderUndo = false) {
        if (--this.transactionLevel >= 0)
            return;
        const transactionLength = this.transaction.historyItems.length;
        if (transactionLength > 1)
            this.addInternal(this.transaction, isUnderUndo);
        else if (transactionLength == 1)
            this.addInternal(this.transaction.historyItems.pop(), isUnderUndo);
        this.transaction = null;
    }
    addAndRedo(historyItem, isUnderUndo = false) {
        this.add(historyItem, isUnderUndo);
        historyItem.redo();
    }
    add(historyItem, isUnderUndo = false) {
        if (this.transactionLevel >= 0)
            this.transaction.add(historyItem);
        else
            this.addInternal(historyItem, isUnderUndo);
    }
    addInternal(historyItem, isUnderUndo) {
        if (this.isProcessingUndo) {
            if (isUnderUndo)
                return;
            else
                throw new Error('Add new item is not allowed while undo operation in process.');
        }
        if (this.currentIndex < this.historyItems.length - 1) {
            this.historyItems.splice(this.currentIndex + 1);
            this.unmodifiedIndex = Math.min(this.unmodifiedIndex, this.currentIndex);
        }
        this.historyItems.push(historyItem);
        this.currentIndex++;
        this.deleteOldItems();
    }
    deleteOldItems() {
        const exceedItemsCount = this.historyItems.length - History.MAX_HISTORY_ITEM_COUNT;
        if (exceedItemsCount > 0 && this.currentIndex > exceedItemsCount) {
            this.historyItems.splice(0, exceedItemsCount);
            this.currentIndex -= exceedItemsCount;
        }
    }
    getNextId() {
        this.incrementalId++;
        return this.incrementalId;
    }
    clear() {
        this.currentIndex = -1;
        this.unmodifiedIndex = -1;
        this.incrementalId = -1;
        this.historyItems = [];
    }
    resetModified() {
        this.unmodifiedIndex = this.currentIndex;
    }
    getCurrentItemId() {
        if (this.currentIndex == -1)
            return -1;
        var currentItem = this.historyItems[this.currentIndex];
        if (currentItem.uniqueId == -1)
            currentItem.uniqueId = this.getNextId();
        return currentItem.uniqueId;
    }
}
History.MAX_HISTORY_ITEM_COUNT = 100;
