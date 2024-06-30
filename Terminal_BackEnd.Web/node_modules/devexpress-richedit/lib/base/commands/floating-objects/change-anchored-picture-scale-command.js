import { ChangeAnchoredPictureSizeHistoryItem } from '../../../core/model/history/items/floating-objects/change-anchored-picture-size-history-item';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeAnchoredPictureSizeCommand extends CommandBase {
    getState() {
        let isEnabled = this.isEnabled();
        let value;
        if (isEnabled) {
            let run = this.selection.activeSubDocument.getRunByPosition(this.selection.specialRunInfo.getPicturePosition());
            value = run.size;
        }
        return new SimpleCommandState(this.isEnabled(), value);
    }
    canModify() {
        return true;
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isPictureSelected() && specialRunInfo.isSelectedAnchorObject &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPicturePosition(), 1)]);
    }
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.interval = new FixedInterval(this.selection.lastSelectedInterval.start, 1);
    }
    executeCore(_state, options) {
        this.history.addAndRedo(new ChangeAnchoredPictureSizeHistoryItem(this.modelManipulator, options.intervalsInfo.subDocInterval, options.param));
        return true;
    }
}
