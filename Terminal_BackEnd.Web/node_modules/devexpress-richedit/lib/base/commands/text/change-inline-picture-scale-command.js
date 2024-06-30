import { ChangeRectangularObjectScaleHistoryItem } from '../../../core/model/history/items/change-rectangular-object-history-item';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeInlinePictureScaleCommand extends CommandBase {
    getState() {
        let isEnabled = this.isEnabled();
        let value;
        if (isEnabled) {
            let run = this.selection.activeSubDocument.getRunByPosition(this.selection.specialRunInfo.getPicturePosition());
            value = [run.size.scale.width, run.size.scale.height];
        }
        return new SimpleCommandState(this.isEnabled(), value);
    }
    isEnabled() {
        return super.isEnabled() &&
            this.selection.specialRunInfo.isPictureSelected() &&
            !this.selection.specialRunInfo.isSelectedAnchorObject;
    }
    executeCore(_state, options) {
        this.history.addAndRedo(new ChangeRectangularObjectScaleHistoryItem(this.modelManipulator, new SubDocumentInterval(options.subDocument, new FixedInterval(this.selection.specialRunInfo.getPicturePosition(), 1)), new Size(options.param[0], options.param[1])));
        return true;
    }
}
