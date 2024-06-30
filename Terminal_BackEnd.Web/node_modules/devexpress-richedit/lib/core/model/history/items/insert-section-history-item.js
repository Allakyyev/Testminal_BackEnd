import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichUtils } from '../../rich-utils';
import { PositionBasedHistoryItem } from '../base/position-based-history-item';
export class InsertSectionHistoryItem extends PositionBasedHistoryItem {
    constructor(modelManipulator, subDocPos, charPropsBundle, parPropsBundle, sectionProperties, isInsertPropertiesToCurrentSection, isInsertPropertiesAndStyleIndexToCurrentParagraph) {
        super(modelManipulator, subDocPos);
        this.charPropsBundle = charPropsBundle;
        this.parPropsBundle = parPropsBundle;
        this.sectionProperties = sectionProperties;
        this.isInsertPropertiesToCurrentSection = isInsertPropertiesToCurrentSection;
        this.isInsertPropertiesAndStyleIndexToCurrentParagraph = isInsertPropertiesAndStyleIndexToCurrentParagraph;
    }
    redo() {
        this.modelManipulator.section.insertSection(this.subDocPos, this.charPropsBundle, this.sectionProperties, this.isInsertPropertiesToCurrentSection, this.parPropsBundle, this.isInsertPropertiesAndStyleIndexToCurrentParagraph);
    }
    undo() {
        this.modelManipulator.range.removeIntervalWithoutHistory(this.boundSubDocument, new FixedInterval(this.subDocPos.position, RichUtils.specialCharacters.SectionMark.length), false);
    }
}
