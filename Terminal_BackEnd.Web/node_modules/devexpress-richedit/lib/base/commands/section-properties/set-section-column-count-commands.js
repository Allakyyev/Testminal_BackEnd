import { SectionPropertyDescriptor } from '../../../core/model/section/section-property-descriptor';
import { RichEditClientCommand } from '../client-command';
import { ChangeSectionPropertiesCommandBase } from './change-section-properties-command-base';
export class SetSectionColumnCountBaseCommand extends ChangeSectionPropertiesCommandBase {
    getDescriptor() {
        return SectionPropertyDescriptor.columnCount;
    }
    isEnabled(options) {
        return super.isEnabled(options) && this.selection.activeSubDocument.isMain();
    }
    getCurrentValue() {
        return this.inputPosition.getMergedSectionPropertiesRaw().equalWidthColumns ?
            super.getCurrentValue() :
            undefined;
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SetSectionOneColumn]: true,
            [RichEditClientCommand.SetSectionTwoColumns]: true,
            [RichEditClientCommand.SetSectionThreeColumns]: true,
        };
    }
    executeCore(state, options) {
        const history = this.history;
        history.beginTransaction();
        const isExecuted = super.executeCore(state, options);
        if (isExecuted) {
            const iter = this.getAffectedSectionsIterator(options.intervalsInfo.intervals);
            while (iter.moveNext())
                history.addAndRedo(new (SectionPropertyDescriptor.equalWidthColumns.getHistoryItemConstructor())(this.modelManipulator, iter.obj.interval, true));
        }
        history.endTransaction();
        return isExecuted;
    }
}
export class SetSectionColumnCountCommand extends SetSectionColumnCountBaseCommand {
}
export class SetSectionColumnPredefinedCountCommand extends SetSectionColumnCountBaseCommand {
    getStateValue(options) {
        return options.param === this.getCurrentValue();
    }
}
export class SetSectionOneColumnCommand extends SetSectionColumnPredefinedCountCommand {
    DEPRECATEDConvertOptionsParameter(_parameter) {
        return 1;
    }
}
export class SetSectionTwoColumnsCommand extends SetSectionColumnPredefinedCountCommand {
    DEPRECATEDConvertOptionsParameter(_parameter) {
        return 2;
    }
}
export class SetSectionThreeColumnsCommand extends SetSectionColumnPredefinedCountCommand {
    DEPRECATEDConvertOptionsParameter(_parameter) {
        return 3;
    }
}
