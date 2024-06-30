import { CharacterProperties, MaskedCharacterProperties } from '../character/character-properties';
import { CharacterPropertyDescriptor } from '../character/character-property-descriptor';
import { TableStyleCharacterPropertiesMergerAllCaps, TableStyleCharacterPropertiesMergerFontBold, TableStyleCharacterPropertiesMergerFontItalic, TableStyleCharacterPropertiesMergerFontName, TableStyleCharacterPropertiesMergerFontSize, TableStyleCharacterPropertiesMergerFontStrikeoutType, TableStyleCharacterPropertiesMergerFontUnderlineType, TableStyleCharacterPropertiesMergerHidden, TableStyleCharacterPropertiesMergerHighlightColor, TableStyleCharacterPropertiesMergerNoProof, TableStyleCharacterPropertiesMergerScript, TableStyleCharacterPropertiesMergerShadingInfo, TableStyleCharacterPropertiesMergerSmallCaps, TableStyleCharacterPropertiesMergerStrikeoutColor, TableStyleCharacterPropertiesMergerStrikeoutWordsOnly, TableStyleCharacterPropertiesMergerTextColor, TableStyleCharacterPropertiesMergerUnderlineColor, TableStyleCharacterPropertiesMergerUnderlineWordsOnly } from '../tables/properties-mergers/table-style-character-properties-merger';
import { PropertiesMergerBase } from './properties-merger-base';
export class CharacterPropertiesMerger extends PropertiesMergerBase {
    constructor() {
        super(new MaskedCharacterProperties(), CharacterPropertyDescriptor.ALL_FIELDS);
    }
    mergeCharacterProperties(maskedCharacterProperties) {
        this.mergeAll(maskedCharacterProperties);
    }
    mergeOnlyOwnCharacterProperties(sourceProperties, parentProperties) {
        this.mergeOnlyOwnProperties(sourceProperties, parentProperties);
    }
    mergeMergedCharacterProperties(mergedCharacterProperties) {
        var maskedCharacterProperties = new MaskedCharacterProperties();
        maskedCharacterProperties.copyFrom(mergedCharacterProperties);
        maskedCharacterProperties.setAllUse();
        this.mergeAll(maskedCharacterProperties);
    }
    mergeCharacterStyle(characterStyle) {
        var currentCharacterStyle = characterStyle;
        while (currentCharacterStyle) {
            this.mergeAll(currentCharacterStyle.maskedCharacterProperties);
            currentCharacterStyle = currentCharacterStyle.parent;
        }
    }
    mergeParagraphStyle(paragraphStyle) {
        var currentParagraphStyle = paragraphStyle;
        while (currentParagraphStyle) {
            this.mergeAll(currentParagraphStyle.maskedCharacterProperties);
            currentParagraphStyle = currentParagraphStyle.parent;
        }
    }
    mergeTableStyles(tableCell) {
        const tableStyle = tableCell.parentRow.parentTable.style;
        const fakeContainer = new MaskedCharacterProperties();
        fakeContainer.resetAllUse();
        this.mergeTableProperties(CharacterPropertyDescriptor.hidden, () => new TableStyleCharacterPropertiesMergerHidden().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.script, () => new TableStyleCharacterPropertiesMergerScript().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.allCaps, () => new TableStyleCharacterPropertiesMergerAllCaps().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.smallCaps, () => new TableStyleCharacterPropertiesMergerSmallCaps().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.noProof, () => new TableStyleCharacterPropertiesMergerNoProof().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.bold, () => new TableStyleCharacterPropertiesMergerFontBold().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.fontInfo, () => new TableStyleCharacterPropertiesMergerFontName().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.size, () => new TableStyleCharacterPropertiesMergerFontSize().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.italic, () => new TableStyleCharacterPropertiesMergerFontItalic().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.strikeoutType, () => new TableStyleCharacterPropertiesMergerFontStrikeoutType().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.underlineType, () => new TableStyleCharacterPropertiesMergerFontUnderlineType().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.strikeoutWordsOnly, () => new TableStyleCharacterPropertiesMergerStrikeoutWordsOnly().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.underlineWordsOnly, () => new TableStyleCharacterPropertiesMergerUnderlineWordsOnly().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.textColor, () => new TableStyleCharacterPropertiesMergerTextColor().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.shadingInfo, () => new TableStyleCharacterPropertiesMergerShadingInfo().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.highlightColor, () => new TableStyleCharacterPropertiesMergerHighlightColor().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.strikeoutColor, () => new TableStyleCharacterPropertiesMergerStrikeoutColor().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
        this.mergeTableProperties(CharacterPropertyDescriptor.underlineColor, () => new TableStyleCharacterPropertiesMergerUnderlineColor().getProperty(fakeContainer, tableStyle, tableCell.conditionalFormatting, null));
    }
    getMergedProperties() {
        const result = new CharacterProperties();
        result.copyFrom(this.innerProperties);
        return result;
    }
}
