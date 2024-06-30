import { NumberingType } from '../../../core/model/numbering-lists/numbering-list';
import { ControlOptions } from '../../../core/model/options/control';
import { NumberingListCommandBase } from './numbering-list-command-base';
export class ToggleMultiLevelListCommand extends NumberingListCommandBase {
    getNumberingListType() {
        return NumberingType.MultiLevel;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.numberingMultiLevel);
    }
}
