import { ControlOptions } from '../../options/control';
import { CompositionHistoryItem, HistoryItem } from './history-item';
import { IHistory } from './i-history';
export declare class History implements IHistory {
    private static MAX_HISTORY_ITEM_COUNT;
    historyItems: HistoryItem[];
    currentIndex: number;
    transaction: CompositionHistoryItem;
    private incrementalId;
    private transactionLevel;
    private unmodifiedIndex;
    private options;
    private isProcessingUndo;
    private currTransactionId;
    private transactionMap;
    constructor(options: ControlOptions);
    isModified(): boolean;
    undo(): void;
    redo(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    beginTransaction(): number;
    addTransaction(action: (history: IHistory) => void, isUnderUndo?: boolean): void;
    endTransaction(isUnderUndo?: boolean): void;
    addAndRedo(historyItem: HistoryItem, isUnderUndo?: boolean): void;
    add(historyItem: HistoryItem, isUnderUndo?: boolean): void;
    private addInternal;
    private deleteOldItems;
    getNextId(): number;
    clear(): void;
    resetModified(): void;
    getCurrentItemId(): number;
}
//# sourceMappingURL=history.d.ts.map