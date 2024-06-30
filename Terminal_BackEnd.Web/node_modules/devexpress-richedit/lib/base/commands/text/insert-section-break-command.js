import { ControlOptions } from '../../../core/model/options/control';
import { SectionStartType } from '../../../core/model/section/enums';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { SectionPropertiesCommandBase } from '../section-properties/section-properties-command-base';
export class InsertSectionBreakCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.sections) &&
            this.selection.tableInfo.extendedData.numRows == 0 && this.selection.activeSubDocument.isMain() &&
            SectionPropertiesCommandBase.rangePermissionIncludeFullSection(this.control, this.selection.activeSubDocument, this.selection.intervals);
    }
    executeCore(_state, options) {
        const charPropsBundle = this.inputPosition.charPropsBundle;
        this.insertSomeWithSelection(SubDocumentInterval.fromPosition(this.selection.activeSubDocument, options.intervalsInfo.position), (subDocPosition) => {
            this.modelManipulator.section.insertSectionAndSetStartType(subDocPosition.position, this.getStartType(), charPropsBundle);
            return subDocPosition.position + 1;
        });
        return true;
    }
}
export class InsertSectionBreakNextPageCommand extends InsertSectionBreakCommand {
    getStartType() {
        return SectionStartType.NextPage;
    }
}
export class InsertSectionBreakEvenPageCommand extends InsertSectionBreakCommand {
    getStartType() {
        return SectionStartType.EvenPage;
    }
}
export class InsertSectionBreakOddPageCommand extends InsertSectionBreakCommand {
    getStartType() {
        return SectionStartType.OddPage;
    }
}
