import { MapCreator } from '../../../base-utils/map-creator';
import { NumberingListIndexConstants } from '../../../core/formats/utils/numbering-list-index-constants';
import { BorderLineStyle } from '../../../core/model/borders/enums';
import { CharacterPropertiesMerger } from '../../../core/model/properties-merger/character-properties-merger';
import { ParagraphPropertiesMerger } from '../../../core/model/properties-merger/paragraph-properties-merger';
import { ConditionalTableStyleFormatting } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { RtfExportSR } from '../../translation-table/rtf-export-sr';
import { RtfTableCellPropertiesMerger } from '../../utils/mergers/rtf-table-cell-properties-merger';
import { RtfTablePropertiesMerger } from '../../utils/mergers/rtf-table-properties-merger';
import { RtfTableRowPropertiesMerger } from '../../utils/mergers/rtf-table-row-properties-merger';
import { RtfCharacterPropertiesExporter } from './rtf-character-properties-exporter';
import { RtfContentExporter } from './rtf-content-exporter';
import { RtfParagraphPropertiesExporter } from './rtf-paragraph-properties-exporter';
import { RtfTableStyleTableCellPropertiesExporter } from './table/rtf-table-cell-properties-exporter';
import { RtfTablePropertiesExporter } from './table/rtf-table-properties-exporter';
import { RtfTableRowPropertiesExporter } from './table/rtf-table-row-properties-exporter';
export class RtfStyleExporter {
    constructor(documentModel, rtfBuilder, rtfExportHelper, options) {
        this.documentModel = documentModel;
        this.rtfExportHelper = rtfExportHelper;
        this.rtfBuilder = rtfBuilder;
        this.characterPropertiesExporter = new RtfCharacterPropertiesExporter(documentModel, rtfExportHelper, rtfBuilder, options);
        this.paragraphPropertiesExporter = new RtfParagraphPropertiesExporter(documentModel, rtfExportHelper, rtfBuilder);
    }
    exportStyleSheet(paragraphStyles, characterStyles, tableStyles) {
        if (paragraphStyles.length > 0)
            this.exportParagraphStyles(paragraphStyles);
        if (characterStyles.length > 0)
            this.exportCharacterStyles(characterStyles);
        if (tableStyles.length > 0)
            this.exportTableStyles(tableStyles);
    }
    exportParagraphStyles(paragraphStyles) {
        this.rtfBuilder.clear();
        const styles = paragraphStyles.concat();
        styles.sort((x, y) => {
            if (x.parent && x.parent.equalsByName(y))
                return 1;
            if (y.parent && y.parent.equalsByName(x))
                return -1;
            return 0;
        });
        const stylesToWrite = [];
        const indexCollectionHandler = new MapCreator(this.rtfExportHelper.paragraphStylesCollectionIndex);
        let count = styles.length;
        for (let i = 0; i < count; i++) {
            let style = styles[i];
            if (!style.deleted && !StringMapUtils.containsBy(this.rtfExportHelper.paragraphStylesCollectionIndex, (_val, key) => key == style.styleName)
                && (style.getNumberingListIndex() < NumberingListIndexConstants.minValue || !!style.getNumberingList(this.documentModel))) {
                stylesToWrite.push(style);
                const styleIndex = this.getNextFreeStyleIndex();
                indexCollectionHandler.add(style.styleName, styleIndex);
            }
        }
        count = stylesToWrite.length;
        for (let i = 0; i < count; i++)
            this.exportParagraphStyle(stylesToWrite[i], i);
        this.rtfExportHelper.stylesCollection.push(this.rtfBuilder.rtfContent.getText());
    }
    exportParagraphStyle(style, i) {
        const styleIndex = this.obtainParagraphStyleIndex(style);
        if (styleIndex < 0)
            return;
        this.rtfBuilder.openGroup();
        if (i > 0) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParagraphStyle, styleIndex);
            const parentStyleIndex = this.obtainParagraphStyleIndex(style.parent);
            if (parentStyleIndex >= 0)
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParentStyle, parentStyleIndex);
        }
        if (style.linkedStyle != null) {
            const linkedStyleIndex = this.obtainCharacterStyleIndex(style.linkedStyle);
            if (linkedStyleIndex >= 0)
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.LinkedStyle, linkedStyleIndex);
        }
        if (style.nextParagraphStyle != null) {
            const nextStyleIndex = this.obtainParagraphStyleIndex(style.nextParagraphStyle);
            if (nextStyleIndex >= 0)
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.NextStyle, nextStyleIndex);
        }
        if (style.primary)
            this.rtfBuilder.writeCommand(RtfExportSR.QuickFormatStyle);
        const pMerger = new ParagraphPropertiesMerger();
        pMerger.mergeParagraphStyle(style);
        pMerger.mergeMaskedParagraphProperties(this.documentModel.defaultParagraphProperties);
        this.exportParagraphProperties(pMerger.getMergedProperties());
        this.paragraphPropertiesExporter.writeTabs(style.tabs);
        const cMerger = new CharacterPropertiesMerger();
        cMerger.mergeParagraphStyle(style);
        cMerger.mergeCharacterProperties(this.documentModel.defaultCharacterProperties);
        this.exportCharacterProperties(cMerger.getMergedProperties());
        if (style.getNumberingListIndex() >= NumberingListIndexConstants.minValue) {
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ListIndex, this.documentModel.numberingLists[style.getNumberingListIndex()].getId());
            const listLevelIndex = style.getListLevelIndex();
            if (listLevelIndex > 0) {
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.LevelIndex, listLevelIndex);
            }
        }
        this.writeStyleName(style.styleName);
        this.rtfBuilder.closeGroup();
    }
    exportCharacterStyles(characterStyles) {
        this.rtfBuilder.clear();
        const count = characterStyles.length;
        for (let i = 0; i < count; i++)
            this.exportCharacterStyle(characterStyles[i]);
        this.rtfExportHelper.stylesCollection.push(this.rtfBuilder.rtfContent.getText());
    }
    exportCharacterStyle(style) {
        if (style.deleted)
            return;
        if (StringMapUtils.containsBy(this.rtfExportHelper.characterStylesCollectionIndex, (_val, key) => key == style.styleName))
            return;
        const styleIndex = this.getNextFreeStyleIndex();
        const indexCollectionHandler = new MapCreator(this.rtfExportHelper.characterStylesCollectionIndex);
        indexCollectionHandler.add(style.styleName, styleIndex);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.CharacterStyle, styleIndex);
        const parentStyleIndex = this.obtainCharacterStyleIndex(style.parent);
        if (parentStyleIndex >= 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParentStyle, parentStyleIndex);
        if (style.linkedStyle) {
            const linkedStyleIndex = this.obtainParagraphStyleIndex(style.linkedStyle);
            if (linkedStyleIndex >= 0)
                this.rtfBuilder.writeIntegerCommand(RtfExportSR.LinkedStyle, linkedStyleIndex);
        }
        if (style.primary)
            this.rtfBuilder.writeCommand(RtfExportSR.QuickFormatStyle);
        const merger = new CharacterPropertiesMerger();
        merger.mergeCharacterStyle(style);
        merger.mergeCharacterProperties(this.documentModel.defaultCharacterProperties);
        this.exportCharacterProperties(merger.getMergedProperties());
        this.writeStyleName(style.styleName);
        this.rtfBuilder.closeGroup();
    }
    exportTableStyles(tableStyles) {
        this.rtfBuilder.clear();
        this.tablePropertiesExporter = new RtfTablePropertiesExporter(this.documentModel, this.rtfExportHelper, this.rtfBuilder);
        this.tableRowPropertiesExporter = new RtfTableRowPropertiesExporter(this.documentModel, this.rtfExportHelper, this.rtfBuilder);
        this.tableCellPropertiesExporter = new RtfTableStyleTableCellPropertiesExporter(this.documentModel, this.rtfExportHelper, this.rtfBuilder);
        const count = tableStyles.length;
        for (let i = 0; i < count; i++)
            this.exportTableStyle(tableStyles[i]);
        this.rtfExportHelper.stylesCollection.push(this.rtfBuilder.rtfContent.getText());
    }
    exportTableStyle(style) {
        if (style.deleted)
            return;
        if (StringMapUtils.containsBy(this.rtfExportHelper.tableStylesCollectionIndex, (_val, key) => key == style.styleName))
            return;
        const styleIndex = this.getNextFreeStyleIndex();
        const indexCollectionHandler = new MapCreator(this.rtfExportHelper.tableStylesCollectionIndex);
        indexCollectionHandler.add(style.styleName, styleIndex);
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableStyle, styleIndex);
        this.rtfBuilder.writeCommand(RtfExportSR.TableStyleResetTableProperties);
        const parentStyleIndex = this.obtainTableStyleIndex(style.parent);
        if (parentStyleIndex >= 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.ParentStyle, parentStyleIndex);
        if (style.primary)
            this.rtfBuilder.writeCommand(RtfExportSR.QuickFormatStyle);
        this.exportCharacterProperties(this.getTableConditionalStyleMergedCharacterProperties(style.baseConditionalStyle));
        this.exportParagraphProperties(this.getTableConditionalStyleMergedParagraphProperties(style.baseConditionalStyle));
        this.exportTableProperties(new RtfTablePropertiesMerger(this.documentModel).getStyleMergedProperties(style.baseConditionalStyle, style, ConditionalTableStyleFormatting.WholeTable));
        this.exportTableRowProperties(new RtfTableRowPropertiesMerger(this.documentModel).getStyleMergedProperties(style.baseConditionalStyle, style, ConditionalTableStyleFormatting.WholeTable));
        this.exportTableCellProperties(new RtfTableCellPropertiesMerger(this.documentModel).getStyleMergedProperties(style.baseConditionalStyle, style, ConditionalTableStyleFormatting.WholeTable));
        this.writeStyleName(style.styleName);
        this.rtfBuilder.closeGroup();
        if (!NumberMapUtils.isEmpty(style.conditionalStyles))
            NumberMapUtils.forEach(style.conditionalStyles, (val, conditionalType) => {
                this.exportTableConditionalStyle(val, style, styleIndex, conditionalType);
            });
    }
    exportTableConditionalStyle(conditionalStyle, style, styleIndex, conditionalType) {
        if (conditionalStyle == null)
            return;
        this.rtfBuilder.openGroup();
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableStyle, styleIndex);
        this.rtfBuilder.writeCommand(RtfExportSR.TableStyleResetTableProperties);
        this.exportCharacterProperties(this.getTableConditionalStyleMergedCharacterProperties(conditionalStyle));
        this.exportParagraphProperties(this.getTableConditionalStyleMergedParagraphProperties(conditionalStyle));
        this.exportTableRowProperties(new RtfTableRowPropertiesMerger(this.documentModel).getStyleMergedProperties(conditionalStyle, style, conditionalType));
        this.exportTableCellProperties(new RtfTableCellPropertiesMerger(this.documentModel).getStyleMergedProperties(conditionalStyle, style, conditionalType));
        this.writeConditionalStyleType(conditionalType);
        this.writeStyleName(style.styleName);
        this.rtfBuilder.closeGroup();
    }
    writeConditionalStyleType(conditionType) {
        let keyword = RtfContentExporter.conditionalStylesTypes[conditionType];
        if (keyword)
            this.rtfBuilder.writeCommand(keyword);
    }
    getTableConditionalStyleMergedCharacterProperties(conditionalStyle) {
        const characterPropertiesMerger = new CharacterPropertiesMerger();
        characterPropertiesMerger.mergeCharacterProperties(conditionalStyle.maskedCharacterProperties);
        return characterPropertiesMerger.getMergedProperties();
    }
    getTableConditionalStyleMergedParagraphProperties(conditionalStyle) {
        const paragraphPropertiesMerger = new ParagraphPropertiesMerger();
        paragraphPropertiesMerger.mergeMaskedParagraphProperties(conditionalStyle.maskedParagraphProperties);
        return paragraphPropertiesMerger.getMergedProperties();
    }
    exportCharacterProperties(characterProperties) {
        this.characterPropertiesExporter.exportCharacterProperties(characterProperties, true, false, false);
    }
    exportParagraphProperties(mergedParagraphProperties) {
        if (mergedParagraphProperties.topBorder.style != BorderLineStyle.None)
            this.paragraphPropertiesExporter.writeParagraphBorder(mergedParagraphProperties.topBorder, RtfExportSR.TopParagraphBorder);
        if (mergedParagraphProperties.leftBorder.style != BorderLineStyle.None)
            this.paragraphPropertiesExporter.writeParagraphBorder(mergedParagraphProperties.leftBorder, RtfExportSR.LeftParagraphBorder);
        if (mergedParagraphProperties.bottomBorder.style != BorderLineStyle.None)
            this.paragraphPropertiesExporter.writeParagraphBorder(mergedParagraphProperties.bottomBorder, RtfExportSR.BottomParagraphBorder);
        if (mergedParagraphProperties.rightBorder.style != BorderLineStyle.None)
            this.paragraphPropertiesExporter.writeParagraphBorder(mergedParagraphProperties.rightBorder, RtfExportSR.RightParagraphBorder);
        if (mergedParagraphProperties.betweenBorder.style != BorderLineStyle.None)
            this.paragraphPropertiesExporter.writeParagraphBorder(mergedParagraphProperties.betweenBorder, RtfExportSR.BetweenParagraphBorder);
        this.paragraphPropertiesExporter.writeParagraphAlignment(mergedParagraphProperties.alignment);
        this.paragraphPropertiesExporter.writeParagraphIndents(mergedParagraphProperties);
        this.paragraphPropertiesExporter.writeParagraphSuppressHyphenation(mergedParagraphProperties.suppressHyphenation);
        this.paragraphPropertiesExporter.writeParagraphSuppressLineNumbers(mergedParagraphProperties.suppressLineNumbers);
        this.paragraphPropertiesExporter.writeParagraphContextualSpacing(mergedParagraphProperties.contextualSpacing);
        this.paragraphPropertiesExporter.writeParagraphPageBreakBefore(mergedParagraphProperties.pageBreakBefore);
        this.paragraphPropertiesExporter.writeParagraphOutlineLevel(mergedParagraphProperties.outlineLevel);
        this.paragraphPropertiesExporter.writeParagraphShading(mergedParagraphProperties.shadingInfo);
        this.paragraphPropertiesExporter.writeParagraphLineSpacing(mergedParagraphProperties.lineSpacingType, mergedParagraphProperties.lineSpacing);
        this.paragraphPropertiesExporter.writeParagraphSpacingBefore(mergedParagraphProperties.spacingBefore);
        this.paragraphPropertiesExporter.writeParagraphSpacingAfter(mergedParagraphProperties.spacingAfter);
    }
    exportTableProperties(mergedTableProperties) {
        this.tablePropertiesExporter.writeBandSizes(mergedTableProperties);
        this.tablePropertiesExporter.writeTableBorders(mergedTableProperties.borders);
        this.tablePropertiesExporter.writeTableCellMargins(mergedTableProperties.cellMargins);
        this.tablePropertiesExporter.writeTableIndent(mergedTableProperties.indent);
    }
    exportTableRowProperties(mergedTableRowProperties) {
        this.tableRowPropertiesExporter.writeRowAlignment(mergedTableRowProperties.tableRowAlignment);
        this.tableRowPropertiesExporter.writeRowHeader(mergedTableRowProperties.header);
        this.tableRowPropertiesExporter.writeRowCantSplit(mergedTableRowProperties.cantSplit);
        this.tableRowPropertiesExporter.writeRowCellSpacing(mergedTableRowProperties.cellSpacing);
    }
    exportTableCellProperties(mergedTableCellProperties) {
        this.tableCellPropertiesExporter.writeCellVerticalAlignment(mergedTableCellProperties.verticalAlignment);
        this.tableCellPropertiesExporter.writeCellShading(mergedTableCellProperties.shadingInfo);
        this.tableCellPropertiesExporter.writeCellBasicBorders(mergedTableCellProperties.borders.topBorder, mergedTableCellProperties.borders.leftBorder, mergedTableCellProperties.borders.rightBorder, mergedTableCellProperties.borders.bottomBorder);
        this.tableCellPropertiesExporter.writeCellTextDirection(mergedTableCellProperties.textDirection);
        this.tableCellPropertiesExporter.writeCellFitText(mergedTableCellProperties.fitText);
        this.tableCellPropertiesExporter.writeCellNoWrap(mergedTableCellProperties.noWrap);
        this.tableCellPropertiesExporter.writeCellHideCellMark(mergedTableCellProperties.hideCellMark);
        this.tableCellPropertiesExporter.writeCellMargings(mergedTableCellProperties.cellMargins);
    }
    writeStyleName(name) {
        const count = name.length;
        for (let i = 0; i < count; i++) {
            this.rtfBuilder.writeChar(name[i]);
        }
        this.rtfBuilder.writeChar(';');
    }
    getNextFreeStyleIndex() {
        let result = 0;
        while (StringMapUtils.containsBy(this.rtfExportHelper.characterStylesCollectionIndex, (val) => val == result)
            || StringMapUtils.containsBy(this.rtfExportHelper.paragraphStylesCollectionIndex, (val) => val == result)
            || StringMapUtils.containsBy(this.rtfExportHelper.tableStylesCollectionIndex, (val) => val == result))
            result++;
        return result;
    }
    obtainParagraphStyleIndex(style) {
        return RtfStyleExporter.obtainStyleIndex(style, this.rtfExportHelper.paragraphStylesCollectionIndex);
    }
    obtainCharacterStyleIndex(style) {
        return RtfStyleExporter.obtainStyleIndex(style, this.rtfExportHelper.characterStylesCollectionIndex);
    }
    obtainTableStyleIndex(style) {
        return RtfStyleExporter.obtainStyleIndex(style, this.rtfExportHelper.tableStylesCollectionIndex);
    }
    static obtainStyleIndex(style, collection) {
        if (!style)
            return -1;
        const result = collection[style.styleName];
        if (result !== undefined && result !== null)
            return result;
        else
            return -1;
    }
}
