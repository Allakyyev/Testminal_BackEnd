import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CommandBase } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
export class ChangeCharacterPropertiesCommandBase extends CommandBase {
    getState(options = this.convertToCommandOptions(undefined)) {
        this._options = options;
        const state = new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(options.intervalsInfo.intervals), this.getValueForState(this.getCurrentValue()));
        state.denyUpdateValue = this.isLockUpdateValue();
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.characterFormatting);
    }
    lockInputPositionUpdating() {
        return true;
    }
    getIntervalsForModifying() {
        return this.getApplyToIntervals(this._options);
    }
    getApplyToIntervals(options) {
        if (options.intervalsInfo.isCollapsed) {
            const pos = options.intervalsInfo.position;
            const paragraph = options.subDocument.getParagraphByPosition(pos);
            let interval;
            if (pos + 1 == paragraph.getEndPosition() && !paragraph.isInList())
                interval = new FixedInterval(paragraph.getEndPosition() - 1, 1);
            else
                interval = options.subDocument.getWholeWordInterval(pos);
            const intervals = [interval];
            if (options.subDocument.isEditable(intervals))
                return intervals;
            return options.intervalsInfo.intervals;
        }
        else
            return ListUtils.map(options.intervalsInfo.intervals, (interval) => {
                if (this._areParagraphContentInterval(interval))
                    interval.length++;
                return interval;
            });
    }
    _areParagraphContentInterval(interval) {
        const paragraphInterval = this.selection.activeSubDocument.getParagraphByPosition(interval.start).interval;
        return interval.start == paragraphInterval.start && interval.end == paragraphInterval.end - 1;
    }
    executeCore(_state, options) {
        const desc = this.getDescriptor();
        const newValue = options.param;
        const applyToIntervals = this.getApplyToIntervals(options);
        if (this.getCurrentValue() !== newValue) {
            const history = this.history;
            history.beginTransaction();
            this.applyToInputPosition(desc, newValue);
            for (let interval of applyToIntervals)
                if (interval.length > 0)
                    history.addAndRedo(new (desc.getHistoryItemConstructor())(this.modelManipulator, new SubDocumentInterval(options.subDocument, interval), newValue, true));
            history.endTransaction();
        }
        return true;
    }
    applyToInputPosition(desc, newValue) {
        desc.setProp(this.inputPosition.getMaskedCharacterProperties(), newValue);
        desc.setProp(this.inputPosition.getMergedCharacterPropertiesFull(), newValue);
        desc.setProp(this.inputPosition.getMergedCharacterPropertiesRaw(), newValue);
        this.inputPosition.getMaskedCharacterProperties().setUseValue(desc.maskValue(), true);
    }
    isLockUpdateValue() {
        return false;
    }
    getCurrentValue() {
        return this.getDescriptor().getProp(this.inputPosition.getMergedCharacterPropertiesRaw());
    }
    getValueForState(val) {
        return val;
    }
    convertBooleanParameterToEnumType(parameter, ifTrue, ifFalse) {
        if (typeof parameter === 'boolean')
            return parameter ? ifTrue : ifFalse;
        return this.getCurrentValue() == ifTrue ? ifFalse : ifTrue;
    }
}
