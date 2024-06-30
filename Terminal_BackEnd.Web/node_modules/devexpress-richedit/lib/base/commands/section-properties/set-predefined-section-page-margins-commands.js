import { SectionPropertyDescriptor } from '../../../core/model/section/section-property-descriptor';
import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { RichEditClientCommand } from '../client-command';
import { SectionPropertiesCommandBase } from './section-properties-command-base';
export class SetSectionPageMarginsCommandBase extends SectionPropertiesCommandBase {
    getCurrentValue() {
        return this.inputPosition.getMergedSectionPropertiesRaw().margins.clone();
    }
    executeCore(_state, options) {
        const newValue = options.param;
        if (!this.getCurrentValue().equals(newValue)) {
            SectionPropertyDescriptor.marginLeft.setProp(this.inputPosition.getMergedSectionPropertiesRaw(), newValue.left);
            SectionPropertyDescriptor.marginTop.setProp(this.inputPosition.getMergedSectionPropertiesRaw(), newValue.top);
            SectionPropertyDescriptor.marginRight.setProp(this.inputPosition.getMergedSectionPropertiesRaw(), newValue.right);
            SectionPropertyDescriptor.marginBottom.setProp(this.inputPosition.getMergedSectionPropertiesRaw(), newValue.bottom);
            const iter = this.getAffectedSectionsIterator(options.intervalsInfo.intervals);
            this.history.beginTransaction();
            while (iter.moveNext()) {
                const interval = iter.obj.interval;
                this.setMargin(interval, SectionPropertyDescriptor.marginLeft, newValue.left);
                this.setMargin(interval, SectionPropertyDescriptor.marginTop, newValue.top);
                this.setMargin(interval, SectionPropertyDescriptor.marginRight, newValue.right);
                this.setMargin(interval, SectionPropertyDescriptor.marginBottom, newValue.bottom);
            }
            this.history.endTransaction();
            return true;
        }
        return false;
    }
    setMargin(interval, descriptor, newValue) {
        this.history.addAndRedo(new (descriptor.getHistoryItemConstructor())(this.modelManipulator, interval, newValue));
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SetSectionPageMargins]: true,
            [RichEditClientCommand.SetNarrowSectionPageMargins]: true,
            [RichEditClientCommand.SetNormalSectionPageMargins]: true,
            [RichEditClientCommand.SetModerateSectionPageMargins]: true,
            [RichEditClientCommand.SetWideSectionPageMargins]: true,
        };
    }
}
export class SetSectionPageMarginsCommand extends SetSectionPageMarginsCommandBase {
    getStateValue() {
        return this.getCurrentValue();
    }
}
export class SetPredefinedSectionPageMarginsCommand extends SetSectionPageMarginsCommandBase {
    getStateValue() {
        return this.getPredefinedMargins().equals(this.getCurrentValue());
    }
    DEPRECATEDConvertOptionsParameter(_parameter) {
        return this.getPredefinedMargins();
    }
}
export class SetNormalSectionPageMarginsCommand extends SetPredefinedSectionPageMarginsCommand {
    getPredefinedMargins() {
        return new Margins(1700, 850, 1133, 1133);
    }
}
export class SetNarrowSectionPageMarginsCommand extends SetPredefinedSectionPageMarginsCommand {
    getPredefinedMargins() {
        return new Margins(720, 720, 720, 720);
    }
}
export class SetModerateSectionPageMarginsCommand extends SetPredefinedSectionPageMarginsCommand {
    getPredefinedMargins() {
        return new Margins(1080, 1080, 1440, 1440);
    }
}
export class SetWideSectionPageMarginsCommand extends SetPredefinedSectionPageMarginsCommand {
    getPredefinedMargins() {
        return new Margins(2880, 2880, 1440, 1440);
    }
}
