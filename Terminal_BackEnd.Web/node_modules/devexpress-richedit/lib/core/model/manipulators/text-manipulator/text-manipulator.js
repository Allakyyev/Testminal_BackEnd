import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SimpleRunInsertedSubDocumentChange } from '../../changes/sub-document/text/simple-run-inserted';
import { CompositionHistoryItem } from '../../history/base/history-item';
import { InsertTextHistoryItem } from '../../history/items/insert-text-history-item';
import { RunsBaseManipulator } from '../runs-base-manipulator';
import { ChunkSizeCorrector } from './chunk-size-corrector';
export class InsertTextViaHistoryResult {
    constructor(inserted, insertedInterval) {
        this.inserted = inserted;
        this.insertedInterval = insertedInterval;
    }
}
export class TextManipulator extends RunsBaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.chunkSizeCorrector = new ChunkSizeCorrector();
    }
    insertTextViaHistory(params) {
        if (!params.correctAndCheckParams())
            return new InsertTextViaHistoryResult(false, null);
        this.history.addAndRedo(new InsertTextHistoryItem(this.modelManipulator, params));
        return new InsertTextViaHistoryResult(true, new FixedInterval(params.subDocPos.position, params.text.length));
    }
    insertTextInner(params) {
        params.subDocPos.subDocument = params.subDocPos.subDocument.getActualSubDocument();
        const insertedRun = this.insertRunInternal(params.subDocPos, params.charPropsBundle, params.runType, params.text);
        const textRun = params.subDocPos.subDocument.chunks[insertedRun.chunkIndex].textRuns[insertedRun.runIndex];
        textRun.paragraph.length += params.text.length;
        this.chunkSizeCorrector.correctChunkSizeAtInsertPosition(params.subDocPos.subDocument, params.subDocPos.position);
        this.modelManipulator.notifyModelChanged(new SimpleRunInsertedSubDocumentChange(params.subDocPos.subDocument.id, params.subDocPos.position, params.text.length, textRun.maskedCharacterProperties, textRun.characterStyle, params.runType, params.text));
    }
    getLastModifiableHistoryItem(checkType) {
        var _a;
        return (_a = this.getLastModifiableHistoryItemNode(checkType)) === null || _a === void 0 ? void 0 : _a.item;
    }
    getLastModifiableHistoryItemNode(checkType) {
        const history = this.history;
        if (!history)
            return null;
        const historyItems = history.historyItems;
        const result = history.currentIndex == historyItems.length - 1 ? this.getLastHistoryItemNode(historyItems, null, checkType) : null;
        return !result.empty ? result : null;
    }
    getLastHistoryItemNode(historyItems, parent, checkType) {
        for (let ind = historyItems.length - 1, item; item = historyItems[ind]; ind--) {
            if (!item.canBeMerged())
                return new NullHistoryItemNode();
            else if (checkType(item))
                return new HistoryItemNode(item, parent);
            else if (item instanceof CompositionHistoryItem) {
                const lowLevelResult = this.getLastHistoryItemNode(item.historyItems, new ParentHistoryItemNode(item, parent), checkType);
                if (lowLevelResult.exist)
                    return lowLevelResult;
            }
        }
        return new UndefinedHistoryItemNode();
    }
}
class HistoryItemNode {
    constructor(item, parent) {
        this.item = item;
        this.parent = parent;
    }
    get root() {
        let result = this;
        while (result.parent)
            result = result.parent;
        return result;
    }
    get exist() { return this.item !== undefined; }
    get empty() { return !this.item; }
}
class ParentHistoryItemNode extends HistoryItemNode {
    constructor(item, parent) {
        super(item, parent);
    }
}
class UndefinedHistoryItemNode extends HistoryItemNode {
    constructor() {
        super(undefined, null);
    }
}
class NullHistoryItemNode extends HistoryItemNode {
    constructor() {
        super(null, null);
    }
}
