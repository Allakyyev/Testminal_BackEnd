import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CharacterStyle } from '../../character/character-style';
import { RangeCopy } from '../../manipulators/range/create-range-copy-operation';
import { SubDocumentInterval, SubDocumentIntervals, SubDocumentPosition } from '../../sub-document';
import { HistoryItem } from '../base/history-item';
import { ApplyCharacterStyleHistoryItem } from './apply-style-history-items';
export class RemoveHyperlinkHistoryItem extends HistoryItem {
    constructor(modelManipulator, subDocument, field) {
        super(modelManipulator);
        this.subDocument = subDocument;
        this.fieldIndex = field.index;
        this.startPos = field.getFieldStartPosition();
        this.separatorPos = field.getSeparatorPosition();
        this.endPos = field.getFieldEndPosition();
        this.hyperlinkInfo = field.getHyperlinkInfo().clone();
    }
    redo() {
        const resultInterval = FixedInterval.fromPositions(this.separatorPos + 1, this.endPos - 1);
        if (!this.styleHistory) {
            const charDefaultStyle = this.modelManipulator.model.getCharacterStyleByName(CharacterStyle.defaultParagraphCharacterStyleName);
            this.styleHistory = new ApplyCharacterStyleHistoryItem(this.modelManipulator, new SubDocumentInterval(this.subDocument, resultInterval), charDefaultStyle, false);
        }
        this.styleHistory.redo();
        const rangeCopy = resultInterval.length ?
            RangeCopy.create(new SubDocumentIntervals(this.subDocument, [resultInterval])) :
            null;
        const fieldInterval = FixedInterval.fromPositions(this.startPos, this.endPos);
        this.removeOperationResult = this.modelManipulator.range.removeIntervalInner(this.subDocument, fieldInterval, false);
        if (rangeCopy)
            rangeCopy.insertTo(this.modelManipulator, new SubDocumentPosition(this.subDocument, this.startPos));
    }
    undo() {
        this.modelManipulator.range.restoreRemovedInterval(this.subDocument, this.removeOperationResult);
        this.styleHistory.undo();
    }
}
