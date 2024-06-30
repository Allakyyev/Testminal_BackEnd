import { ControlOptions } from '../../../core/model/options/control';
import { RichUtils } from '../../../core/model/rich-utils';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertColumnBreakCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.sections) &&
            this.selection.tableInfo.extendedData.numRows == 0 && this.selection.activeSubDocument.isMain();
    }
    executeCore(_state, options) {
        this.insertTextWithSelection(options.intervalsInfo.subDocInterval, RichUtils.specialCharacters.ColumnBreak);
        return true;
    }
}
