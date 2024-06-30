import { SectionPropertyDescriptor } from '../../core/model/section/section-property-descriptor';
import { InputPositionBase } from '../../core/selection/input-position-base';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
export class InputPosition extends InputPositionBase {
    constructor(selection) {
        super();
        this.selection = selection;
        this.setIntervals(this.selection.getState().intervalsInfo);
        this.reset();
    }
    reset() {
        this.setIntervals(this.selection.getState().intervalsInfo);
        this.resetReturnValues();
    }
    resetSectionMergedProperties() {
        this.mergedSectionPropertiesRaw = null;
        this.mergedSectionPropertiesFull = null;
    }
    getMergedSectionPropertiesRaw() {
        if (!this.mergedSectionPropertiesRaw) {
            var interval = this.intervalsInfo.interval;
            var intervalStartPosition = interval.start;
            var intervalEndPosition = interval.end;
            var sections = this.model.sections;
            var sectionIndex = SearchUtils.normedInterpolationIndexOf(sections, (s) => s.startLogPosition.value, intervalStartPosition);
            this.mergedSectionPropertiesRaw = sections[sectionIndex++].sectionProperties.clone();
            for (var section; (section = sections[sectionIndex]) && (section.startLogPosition.value < intervalEndPosition); sectionIndex++)
                InputPositionBase.mergePropertiesRaw(this.mergedSectionPropertiesRaw, section.sectionProperties, SectionPropertyDescriptor.ALL_FIELDS);
        }
        return this.mergedSectionPropertiesRaw;
    }
    getMergedSectionPropertiesFull() {
        if (!this.mergedSectionPropertiesFull)
            this.mergedSectionPropertiesFull = InputPositionBase.mergePropertiesFull(this.getMergedSectionPropertiesRaw(), SectionPropertyDescriptor.ALL_FIELDS);
        return this.mergedSectionPropertiesFull;
    }
    resetReturnValues() {
        super.resetReturnValues();
        this.mergedSectionPropertiesRaw = null;
        this.mergedSectionPropertiesFull = null;
    }
}
