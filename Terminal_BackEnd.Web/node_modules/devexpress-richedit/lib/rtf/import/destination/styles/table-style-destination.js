import { CharacterPropertiesMask } from '../../../../core/model/character/enums';
import { CharacterPropertiesMerger } from '../../../../core/model/properties-merger/character-properties-merger';
import { ParagraphPropertiesMerger } from '../../../../core/model/properties-merger/paragraph-properties-merger';
import { ConditionalTableStyleFormatting } from '../../../../core/model/tables/secondary-structures/table-base-structures';
import { TableStyle } from '../../../../core/model/tables/styles/table-style';
import { RtfTableCellPropertiesMerger } from '../../../utils/mergers/rtf-table-cell-properties-merger';
import { RtfTablePropertiesMerger } from '../../../utils/mergers/rtf-table-properties-merger';
import { RtfTableRowPropertiesMerger } from '../../../utils/mergers/rtf-table-row-properties-merger';
import { DestinationSubDocument } from '../sub-document/destination-sub-document';
import { DestinationType } from '../utils/destination-type';
export class TableStyleDestination extends DestinationSubDocument {
    constructor(importer, styleIndex) {
        super(importer, importer.subDocument);
        this.conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.WholeTable;
        this.styleName = '';
        this.rtfStyleIndex = styleIndex;
        this.importer.importers.character.characterFormatting.coreProperties.setUseValue(CharacterPropertiesMask.UseAll, false);
    }
    get destinationType() { return DestinationType.TableStyleDestination; }
    get controlCharHT() { return null; }
    static onStyleQFormatKeyword(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).qFormat = true;
    }
    static onParentStyleIndex(importer, parameterValue, _hasParameter) {
        importer.importers.style.table.rtfParentStyleIndex = parameterValue;
    }
    static onConditionalStyleFirstRow(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.FirstRow;
    }
    static onConditionalStyleLastRow(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.LastRow;
    }
    static onConditionalStyleFirstColumn(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.FirstColumn;
    }
    static onConditionalStyleLastColumn(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.LastColumn;
    }
    static onConditionalStyleOddRowBanding(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.OddRowBanding;
    }
    static onConditionalStyleEvenRowBanding(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.EvenRowBanding;
    }
    static onConditionalStyleOddColumnBanding(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.OddColumnBanding;
    }
    static onConditionalStyleEvenColumnBanding(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.EvenColumnBanding;
    }
    static onConditionalStyleTopLeftCell(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.TopLeftCell;
    }
    static onConditionalStyleTopRightCell(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.TopRightCell;
    }
    static onConditionalStyleBottomLeftCell(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.BottomLeftCell;
    }
    static onConditionalStyleBottomRightCell(importer, _parameterValue, _hasParameter) {
        TableStyleDestination.getThis(importer).conditionalTableStyleFormattingType = ConditionalTableStyleFormatting.BottomRightCell;
    }
    static getThis(rtfImporter) {
        return rtfImporter.destination;
    }
    get canAppendText() {
        return false;
    }
    get rtfStyleIndex() { return this.importer.importers.style.table.rtfStyleIndex; }
    set rtfStyleIndex(value) { this.importer.importers.style.table.rtfStyleIndex = value; }
    get rtfParentStyleIndex() { return this.importer.importers.style.table.rtfParentStyleIndex; }
    beforePopRtfState() {
        const name = this.styleName.trim();
        let style = null;
        const isConditionalStyle = this.conditionalTableStyleFormattingType != ConditionalTableStyleFormatting.WholeTable;
        let realConditionalStyle;
        if (isConditionalStyle) {
            style = this.addConditionalStyle();
            realConditionalStyle = style;
        }
        else {
            this.importer.importers.character.characterFormatting.coreProperties.setUseValue(CharacterPropertiesMask.UseAll, true);
            const styleModelIndex = this.importer.importers.style.table.mapRtfIndexToModelIndex[this.rtfStyleIndex];
            if (styleModelIndex == undefined)
                style = this.importer.importers.style.table.getOrCreateStyleByName(name);
            else
                style = this.documentModel.tableStyles[styleModelIndex];
            realConditionalStyle = style.baseConditionalStyle;
        }
        if (style == null)
            return;
        const tableStyle = style;
        const conditionalStyle = style;
        if (tableStyle != null)
            tableStyle.primary = this.qFormat;
        if (name != TableStyle.DEFAULT_STYLENAME) {
            var parentTableStyle;
            if (!isConditionalStyle) {
                parentTableStyle = this.importer.importers.style.table.parentStyle;
            }
            else {
                parentTableStyle = style.parent;
                if (parentTableStyle == null)
                    parentTableStyle = this.importer.documentModel.tableStyles[0];
            }
            let parentParagraphProperties;
            if (isConditionalStyle) {
                conditionalStyle.maskedCharacterProperties.copyFrom(this.importer.importers.character.characterFormatting.coreProperties);
                parentParagraphProperties = conditionalStyle.maskedParagraphProperties;
            }
            else {
                const characterPropertiesMerger = new CharacterPropertiesMerger();
                characterPropertiesMerger.mergeCharacterProperties(tableStyle.baseConditionalStyle.maskedCharacterProperties);
                characterPropertiesMerger.mergeMergedCharacterProperties(parentTableStyle.baseConditionalStyle.maskedCharacterProperties);
                tableStyle.baseConditionalStyle.maskedCharacterProperties = characterPropertiesMerger.innerProperties;
                const parentParagraphPropertiesMerger = new ParagraphPropertiesMerger();
                parentParagraphPropertiesMerger.mergeMaskedParagraphProperties(tableStyle.baseConditionalStyle.maskedParagraphProperties);
                parentParagraphPropertiesMerger.mergeMaskedParagraphProperties(parentTableStyle.baseConditionalStyle.maskedParagraphProperties);
                parentParagraphProperties = parentParagraphPropertiesMerger.innerProperties;
            }
            const formattingInfo = this.importer.importers.paragraph.paragraphFormatting;
            const paragraphPropertiesMerger = new ParagraphPropertiesMerger();
            paragraphPropertiesMerger.mergeMaskedParagraphProperties(formattingInfo.getCoreProperties());
            paragraphPropertiesMerger.mergeMaskedParagraphProperties(parentParagraphProperties);
            realConditionalStyle.maskedParagraphProperties = paragraphPropertiesMerger.innerProperties;
            realConditionalStyle.tableProperties = this.importer.importers.table.tableReader.tableProperties.coreProperties;
            realConditionalStyle.tableProperties = new RtfTablePropertiesMerger(this.importer.documentModel)
                .getStyleMergedProperties(realConditionalStyle, tableStyle, this.conditionalTableStyleFormattingType);
            realConditionalStyle.tableRowProperties = this.importer.importers.table.tableReader.rowProperties.coreProperties;
            realConditionalStyle.tableRowProperties = new RtfTableRowPropertiesMerger(this.importer.documentModel)
                .getStyleMergedProperties(realConditionalStyle, tableStyle, this.conditionalTableStyleFormattingType);
            realConditionalStyle.tableCellProperties = this.importer.importers.table.tableReader.cellProperties.coreProperties;
            realConditionalStyle.tableCellProperties = new RtfTableCellPropertiesMerger(this.importer.documentModel)
                .getStyleMergedProperties(realConditionalStyle, tableStyle, this.conditionalTableStyleFormattingType);
        }
    }
    addConditionalStyle() {
        if (this.importer.importers.style.table.mapRtfIndexToModelIndex[this.rtfStyleIndex] == undefined)
            return null;
        const documentModel = this.importer.documentModel;
        const mainStyle = documentModel.tableStyles[this.importer.importers.style.table.getModelIndex(this.rtfStyleIndex)];
        const tableConditionalStyle = mainStyle.conditionalStyles[this.conditionalTableStyleFormattingType];
        return tableConditionalStyle;
    }
    createClone() {
        return new TableStyleDestination(this.importer, this.rtfStyleIndex);
    }
    processCharCore(ch) {
        if (ch != ';')
            this.styleName += ch;
    }
    finalizePieceTableCreation() {
    }
}
