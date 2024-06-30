import { ControlOptions } from '../../../core/model/options/control';
import { Section } from '../../../core/model/section/section';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { CommandBase } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
export class SectionPropertiesCommandBase extends CommandBase {
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.intervals = SectionPropertiesCommandBase.getIntervals(this.control, options.subDocument);
    }
    getState(options = this.convertToCommandOptions(null)) {
        return this.getStateCore(this.isEnabled(options), options.intervalsInfo.intervals, this.getStateValue(options));
    }
    getStateCore(enabled, intervals, value) {
        return new IntervalCommandStateEx(enabled, intervals, value);
    }
    isEnabled(options) {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.sections) &&
            (!this.control.modelManager.model.isDocumentProtectionEnabled ||
                SectionPropertiesCommandBase.rangePermissionIncludeFullSection(this.control, options.subDocument, options.intervalsInfo.intervals));
    }
    getAffectedSectionsIterator(intervals) {
        const sections = this.control.modelManager.model.sections;
        return IntervalAlgorithms.getAffectedObjects(sections, intervals, undefined, (objectInterval, touchingIntervalLength, touchPoint) => touchingIntervalLength == 0 && objectInterval.contains(touchPoint))
            .getObjectsIterator(sections);
    }
    static rangePermissionIncludeFullSection(control, subDoc, intervals) {
        if (subDoc.isMain()) {
            const secIndexes = [];
            const currInts = ListUtils.map(intervals, (curr) => {
                const c = curr.clone();
                if (!c.length)
                    c.length++;
                return c;
            });
            ListUtils.forEach(currInts, (currInt) => {
                ListUtils.forEach(control.modelManager.model.sections, (sec, secInd) => {
                    if (IntervalAlgorithms.getIntersectionNonNullLength(sec.interval, currInt))
                        secIndexes.push(secInd);
                });
            });
            return control.modelManager.model.mainSubDocument.isEditable(ListUtils.map(ListUtils.uniqueNumber(secIndexes), (ind) => control.modelManager.model.sections[ind].interval));
        }
        if (subDoc.isHeaderFooter()) {
            const section = control.modelManager.model.mainSubDocument.getSectionByPosition(control.layoutFormatterManager.forceFormatPage(control.selection.pageIndex).getPosition());
            return control.modelManager.model.mainSubDocument.isEditable([section.interval]);
        }
        if (subDoc.isTextBox()) {
            const selection = control.selection;
            return SectionPropertiesCommandBase.rangePermissionIncludeFullSection(control, selection.specialRunInfo.getParentSubDocument(), [new FixedInterval(selection.specialRunInfo.getPosition(), 1)]);
        }
    }
    static getIntervals(control, subDocument) {
        if (subDocument.isMain() || subDocument.isTextBox())
            return ListUtils.deepCopy(control.selection.intervalsInfo.intervals);
        else if (subDocument.isHeaderFooter()) {
            let layoutPage = control.layoutFormatterManager.forceFormatPage(control.selection.pageIndex);
            let sectionIndex = Section.getPageSectionIndex(layoutPage, control.modelManager.model.sections);
            let section = control.modelManager.model.sections[sectionIndex];
            return [new FixedInterval(section.startLogPosition.value, section.getLength())];
        }
        else
            throw new Error("Unknown subDocument type");
    }
}
