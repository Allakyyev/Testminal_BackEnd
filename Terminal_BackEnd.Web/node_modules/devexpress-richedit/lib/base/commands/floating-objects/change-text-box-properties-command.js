import { ChangeTextBoxPropertiesHistoryItem } from '../../../core/model/history/items/floating-objects/change-text-box-properties-history-item';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTextBoxPropertiesCommand extends CommandBase {
    getState() {
        let isEnabled = this.isEnabled();
        let value;
        if (isEnabled)
            value = this.getValue();
        return new SimpleCommandState(this.isEnabled(), value);
    }
    canModify() {
        return true;
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isTextBoxSelected() &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPosition(), 1)]);
    }
    executeCore(_state, options) {
        let modelManipulator = this.modelManipulator;
        let subDocument = this.selection.specialRunInfo.getParentSubDocument();
        this.history.addAndRedo(new ChangeTextBoxPropertiesHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(this.selection.specialRunInfo.getTextBoxPosition(), 1)), options.param));
        return true;
    }
    getValue() {
        let specialRunInfo = this.selection.specialRunInfo;
        let run = specialRunInfo.getParentSubDocument().getRunByPosition(specialRunInfo.getTextBoxPosition());
        let textBoxRun = run;
        return textBoxRun.textBoxProperties.clone();
    }
}
