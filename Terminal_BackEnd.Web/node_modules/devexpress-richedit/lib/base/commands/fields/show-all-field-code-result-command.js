import { ControlOptions } from '../../../core/model/options/control';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { CommandBase } from '../command-base';
import { IntervalCommandState } from '../command-states';
export class ShowAllFieldCodesCommand extends CommandBase {
    getState() {
        return new IntervalCommandState(this.isEnabled(), this.selection.lastSelectedInterval);
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.fields);
    }
    executeCore(_state, _options) {
        this.modelManipulator.field.setAllFieldsShowCode(this.baseValue(), NumberMapUtils.toList(this.modelManipulator.model.subDocuments));
        return true;
    }
    baseValue() {
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class ShowAllFieldResultCommand extends ShowAllFieldCodesCommand {
    baseValue() {
        return false;
    }
}
