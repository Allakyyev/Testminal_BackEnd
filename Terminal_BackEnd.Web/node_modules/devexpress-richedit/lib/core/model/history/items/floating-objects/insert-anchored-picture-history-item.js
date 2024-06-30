import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { PositionBasedHistoryItem } from '../../base/position-based-history-item';
export class InsertAnchoredPictureHistoryItem extends PositionBasedHistoryItem {
    constructor(modelManipulator, subDocPos, charPropsBundle, picInfo, options) {
        super(modelManipulator, subDocPos);
        this.charPropsBundle = charPropsBundle;
        this.picInfo = picInfo;
        this.options = options;
    }
    redo() {
        this.modelManipulator.picture.insertAnchoredPictureInner(this.subDocPos, this.charPropsBundle, this.picInfo, this.options);
        this.options = undefined;
    }
    undo() {
        this.modelManipulator.range.removeIntervalWithoutHistory(this.boundSubDocument, new FixedInterval(this.position, 1), false);
    }
}
export class InsertAnchoredTextBoxHistoryItem extends PositionBasedHistoryItem {
    constructor(modelManipulator, subDocPos, charPropsBundle, textBoxInfo) {
        super(modelManipulator, subDocPos);
        this.charPropsBundle = charPropsBundle;
        this.textBoxInfo = textBoxInfo;
    }
    redo() {
        this.modelManipulator.textBox.insertAnchoredTextBox(this.subDocPos, this.charPropsBundle, this.textBoxInfo);
    }
    undo() {
        this.modelManipulator.range.removeIntervalWithoutHistory(this.boundSubDocument, new FixedInterval(this.position, 1), false);
    }
}
