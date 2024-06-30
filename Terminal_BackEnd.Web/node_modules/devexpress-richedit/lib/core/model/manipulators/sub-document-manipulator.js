import { InsertSubDocumentHistoryItem } from '../history/items/insert-sub-document-history-item';
import { BaseManipulator } from './base-manipulator';
import { SubDocumentInserterOptions } from './document/sub-document-inserter';
export class SubDocumentManipulator extends BaseManipulator {
    insertSubDocument(targetSubDocPos, sourceInfo, options = new SubDocumentInserterOptions()) {
        const historyItem = new InsertSubDocumentHistoryItem(this.modelManipulator, options, targetSubDocPos, sourceInfo);
        this.history.addAndRedo(historyItem);
        return {
            insetedInterval: historyItem.insertedInterval,
            newSubDocuments: historyItem.insertedSubDocuments
        };
    }
}
