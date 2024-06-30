import { SectionPropertiesCommandBase } from './section-properties-command-base';
export class ChangeSectionPropertiesCommandBase extends SectionPropertiesCommandBase {
    getStateValue(_options) {
        return this.getCurrentValue();
    }
    executeCore(_state, options) {
        const newValue = options.param;
        if (this.getCurrentValue() != newValue) {
            this.getDescriptor().setProp(this.inputPosition.getMergedSectionPropertiesRaw(), newValue);
            const iter = this.getAffectedSectionsIterator(options.intervalsInfo.intervals);
            while (iter.moveNext())
                this.history.addAndRedo(new (this.getDescriptor().getHistoryItemConstructor())(this.modelManipulator, iter.obj.interval, newValue));
            return true;
        }
        return false;
    }
    getCurrentValue() {
        return this.getDescriptor().getProp(this.inputPosition.getMergedSectionPropertiesRaw());
    }
}
