import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { SectionsFormattingChangedModelChange } from '../changes/model/section-formatting-changed';
import { HistoryItemState } from '../history/states/history-item-state';
import { HistoryItemSectionStateObject } from '../history/states/history-item-state-object';
import { ControlOptions } from '../options/control';
import { SectionPropertyDescriptor } from '../section/section-property-descriptor';
import { BaseManipulator } from './base-manipulator';
export class SectionPropertiesManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.landscape = new SectionPropertiesLandscapeManipulator(manipulator, SectionPropertyDescriptor.landscape);
        this.marginBottom = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.marginBottom);
        this.marginLeft = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.marginLeft);
        this.marginRight = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.marginRight);
        this.marginTop = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.marginTop);
        this.columnCount = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.columnCount);
        this.columnsInfo = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.columnsInfo);
        this.equalWidthColumns = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.equalWidthColumns);
        this.pageHeight = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.pageHeight);
        this.pageWidth = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.pageWidth);
        this.space = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.space);
        this.startType = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.startType);
        this.differentFirstPage = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.differentFirstPage);
        this.headerOffset = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.headerOffset);
        this.footerOffset = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.footerOffset);
        this.paperKind = new SectionPropertiesManipulatorBase(manipulator, SectionPropertyDescriptor.paperKind);
    }
}
class SectionPropertiesManipulatorBase {
    constructor(manipulator, descriptor) {
        this.manipulator = manipulator;
        this.descriptor = descriptor;
    }
    setValue(interval, newValue) {
        var oldState = new HistoryItemState();
        if (!ControlOptions.isEnabled(this.manipulator.model.options.sections))
            return oldState;
        var newState = new HistoryItemState();
        var endPosition = Math.max(interval.start, interval.end - 1);
        var sections = this.manipulator.model.sections;
        var startSectionIndex = SearchUtils.normedInterpolationIndexOf(sections, section => section.startLogPosition.value, interval.start);
        var endSectionIndex = interval.length ?
            SearchUtils.normedInterpolationIndexOf(sections, section => section.startLogPosition.value, endPosition) :
            startSectionIndex;
        for (var i = startSectionIndex; i <= endSectionIndex; i++) {
            var section = sections[i];
            oldState.register(new HistoryItemSectionStateObject(i, this.descriptor.getProp(section.sectionProperties)));
            newState.register(new HistoryItemSectionStateObject(i, newValue));
            this.setPropertyValue(section.sectionProperties, newValue);
        }
        this.manipulator.notifyModelChanged(new SectionsFormattingChangedModelChange(startSectionIndex, endSectionIndex, this.descriptor.getJSONProperty(), newState));
        return oldState;
    }
    restoreValue(state) {
        if (!ControlOptions.isEnabled(this.manipulator.model.options.sections))
            return;
        if (state.isEmpty())
            return;
        var sections = this.manipulator.model.sections;
        for (var i = 0, stateObject; stateObject = state.objects[i]; i++) {
            var section = sections[stateObject.sectionIndex];
            this.setPropertyValue(section.sectionProperties, stateObject.value);
        }
        const startSectionIndex = state.objects[0].sectionIndex;
        const endSectionIndex = state.lastObject.sectionIndex;
        this.manipulator.notifyModelChanged(new SectionsFormattingChangedModelChange(startSectionIndex, endSectionIndex, this.descriptor.getJSONProperty(), state));
    }
    setPropertyValue(properties, value) {
        this.descriptor.setProp(properties, value);
    }
}
class SectionPropertiesLandscapeManipulator extends SectionPropertiesManipulatorBase {
    setPropertyValue(properties, value) {
        if (properties.landscape !== value) {
            properties.landscape = value;
            [properties.pageWidth, properties.pageHeight] = [properties.pageHeight, properties.pageWidth];
        }
    }
}
