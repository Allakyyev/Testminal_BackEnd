import { SectionPropertyDescriptor } from '../../../core/model/section/section-property-descriptor';
import { RichEditClientCommand } from '../client-command';
import { ChangeSectionPropertiesCommandBase } from './change-section-properties-command-base';
export class SetLandscapePageOrientationCommand extends ChangeSectionPropertiesCommandBase {
    getDescriptor() {
        return SectionPropertyDescriptor.landscape;
    }
    DEPRECATEDConvertOptionsParameter(_parameter) {
        return this.isLandscape();
    }
    getStateValue() {
        return this.getCurrentValue() == this.isLandscape();
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SetLandscapePageOrientation]: true,
            [RichEditClientCommand.SetPortraitPageOrientation]: true,
        };
    }
    executeCore(state, options) {
        const history = this.history;
        history.beginTransaction();
        const isExecuted = super.executeCore(state, options);
        if (isExecuted) {
            const props = this.inputPosition.getMergedSectionPropertiesFull();
            const oldPageSize = props.pageSize;
            const iter = this.getAffectedSectionsIterator(options.intervalsInfo.intervals);
            while (iter.moveNext()) {
                history.addAndRedo(new (SectionPropertyDescriptor.pageWidth.getHistoryItemConstructor())(this.modelManipulator, iter.obj.interval, oldPageSize.height));
                history.addAndRedo(new (SectionPropertyDescriptor.pageHeight.getHistoryItemConstructor())(this.modelManipulator, iter.obj.interval, oldPageSize.width));
            }
        }
        history.endTransaction();
        return isExecuted;
    }
    isLandscape() {
        return true;
    }
}
export class SetPortraitPageOrientationCommand extends SetLandscapePageOrientationCommand {
    isLandscape() {
        return false;
    }
}
