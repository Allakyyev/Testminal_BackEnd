import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { PositionBasedHistoryItem } from '../base/position-based-history-item';
export class InsertInlinePictureHistoryItem extends PositionBasedHistoryItem {
    constructor(modelManipulator, subDocPos, charPropsBundle, picInfo, options) {
        super(modelManipulator, subDocPos);
        this.charPropsBundle = charPropsBundle;
        this.picInfo = picInfo;
        this.options = options;
    }
    redo() {
        this.picInfo.publicAPIID = this.modelManipulator.picture.insertInlinePictureInner(this.subDocPos, this.charPropsBundle, this.picInfo, this.options);
        this.options = undefined;
    }
    undo() {
        this.modelManipulator.range.removeIntervalWithoutHistory(this.subDocPos.subDocument, new FixedInterval(this.subDocPos.position, 1), false);
    }
}
