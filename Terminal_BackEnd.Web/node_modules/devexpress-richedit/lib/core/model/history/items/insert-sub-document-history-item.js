import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SubDocumentInserter } from '../../manipulators/document/sub-document-inserter';
import { HistoryItem } from '../base/history-item';
export class InsertSubDocumentHistoryItem extends HistoryItem {
    constructor(modelManipulator, options, targetSubDocPos, sourceSubDocInterval) {
        super(modelManipulator);
        this.targetSubDocPos = targetSubDocPos;
        this.sourceSubDocInterval = sourceSubDocInterval;
        this.options = options;
    }
    redo() {
        const inserter = new SubDocumentInserter(this.modelManipulator, this.options, this.targetSubDocPos, this.sourceSubDocInterval);
        inserter.insert();
        this.newTables = inserter.newTables;
        this.insertedInterval = inserter.insertedInterval;
        this.insertedSubDocuments = inserter.insertedSubDocuments;
    }
    undo() {
        for (let i = 0, table; table = this.newTables[i]; i++)
            this.modelManipulator.table.removeTable(this.targetSubDocPos.subDocument, table);
        this.modelManipulator.range.removeIntervalWithoutHistory(this.targetSubDocPos.subDocument, new FixedInterval(this.targetSubDocPos.position, this.sourceSubDocInterval.interval.length), true);
        for (const subDocument of this.insertedSubDocuments) {
            this.modelManipulator.model.subDocumentsCollection.delete(subDocument.id);
        }
    }
}
