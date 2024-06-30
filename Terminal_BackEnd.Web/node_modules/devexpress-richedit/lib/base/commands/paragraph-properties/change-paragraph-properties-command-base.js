import { ControlOptions } from '../../../core/model/options/control';
import { RichUtils } from '../../../core/model/rich-utils';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CommandBase } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
export class ChangeParagraphPropertiesCommandBase extends CommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        const state = new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(options.intervalsInfo.intervals), this.getValueForState(this.getCurrentValue()));
        state.denyUpdateValue = this.isLockUpdateValue();
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphFormatting);
    }
    executeCore(_state, options) {
        const desc = this.getDescriptor();
        const newValue = this.convertValue(options.param);
        if (this.getActualValue() !== newValue) {
            const history = this.history;
            history.beginTransaction();
            desc.setProp(this.inputPosition.getMergedParagraphPropertiesFull(), newValue);
            desc.setProp(this.inputPosition.getMergedParagraphPropertiesRaw(), newValue);
            for (let interval of options.intervalsInfo.intervals)
                history.addAndRedo(new (desc.getHistoryItemConstructor())(this.modelManipulator, new SubDocumentInterval(options.subDocument, interval), newValue, true));
            history.endTransaction();
        }
        return true;
    }
    isLockUpdateValue() {
        return false;
    }
    getCurrentValue() {
        return this.getDescriptor().getProp(this.inputPosition.getMergedParagraphPropertiesRaw());
    }
    getValueForState(val) {
        return val;
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
    convertValue(val) {
        return val;
    }
    getActualValue() {
        return this.getCurrentValue();
    }
    convertBooleanParameterToEnumType(parameter, ifTrue, ifFalse) {
        if (typeof parameter === 'boolean')
            return parameter ? ifTrue : ifFalse;
        return this.getCurrentValue() == ifTrue ? ifFalse : ifTrue;
    }
}
