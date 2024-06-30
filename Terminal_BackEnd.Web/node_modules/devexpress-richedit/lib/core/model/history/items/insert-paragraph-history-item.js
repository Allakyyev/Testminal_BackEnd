import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichUtils } from '../../rich-utils';
import { HistoryItem } from '../base/history-item';
export class InsertParagraphHistoryItem extends HistoryItem {
    constructor(modelManipulator, params) {
        super(modelManipulator);
        this.params = params;
    }
    redo() {
        this.modelManipulator.paragraph.insertParagraphInner(this.params);
    }
    undo() {
        this.modelManipulator.range.removeIntervalWithoutHistory(this.params.subDocPos.subDocument, new FixedInterval(this.params.subDocPos.position, RichUtils.specialCharacters.ParagraphMark.length), true);
    }
}
