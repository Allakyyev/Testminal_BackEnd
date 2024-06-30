import { BorderInfo } from '../../../../../core/model/borders/border-info';
import { BorderLineStyle } from '../../../../../core/model/borders/enums';
import { TableCellMergingState, TableLookTypes } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TableWidthUnitType } from '../../../../../core/model/tables/secondary-structures/table-units';
import { Errors } from '@devexpress/utils/lib/errors';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfExportSR } from '../../../../translation-table/rtf-export-sr';
import { RtfTableCellPropertiesMerger } from '../../../../utils/mergers/rtf-table-cell-properties-merger';
import { RtfTablePropertiesMerger } from '../../../../utils/mergers/rtf-table-properties-merger';
import { RtfTableRowPropertiesMerger } from '../../../../utils/mergers/rtf-table-row-properties-merger';
import { RtfStyleExporter } from '../../rtf-style-exporter';
import { RtfTableCellPropertiesExporter } from '../rtf-table-cell-properties-exporter';
import { RtfTableExporter } from '../rtf-table-exporter';
import { RtfTablePropertiesExporter } from '../rtf-table-properties-exporter';
import { RtfTableRowPropertiesExporter } from '../rtf-table-row-properties-exporter';
export class RtfTableExporterStateBase {
    constructor(rtfExporter, table, nestingLevel) {
        this.rtfExporter = rtfExporter;
        this._nestingLevel = nestingLevel;
        this.table = table;
        this.tableRowPropertiesExporter = new RtfTableRowPropertiesExporter(rtfExporter.documentModel, rtfExporter.rtfExportHelper, rtfExporter.rtfBuilder);
        this.tableCellPropertiesExporter = new RtfTableCellPropertiesExporter(rtfExporter.documentModel, rtfExporter.rtfExportHelper, rtfExporter.rtfBuilder);
        this.tablePropertiesExporter = new RtfTablePropertiesExporter(rtfExporter.documentModel, rtfExporter.rtfExportHelper, rtfExporter.rtfBuilder);
        this.tableStyleIndex = this.getTableStyleIndex();
    }
    get rtfBuilder() {
        return this.rtfExporter.rtfBuilder;
    }
    get documentModel() {
        return this.subDocument.documentModel;
    }
    get subDocument() {
        return this.rtfExporter.subDocument;
    }
    get nestingLevel() {
        return this._nestingLevel;
    }
    exportBase() {
        this.table.rows.forEach((_row, rowIndex) => {
            this.exportRow(this.table.rows[rowIndex], rowIndex);
        });
    }
    getTableStyleIndex() {
        if (this.table.style !== this.documentModel.tableStyles[0])
            return RtfStyleExporter.obtainStyleIndex(this.table.style, this.rtfExporter.rtfExportHelper.tableStylesCollectionIndex);
        return -1;
    }
    exportRowCells(row, rowIndex) {
        for (let cell of row.cells)
            this.exportCellParagraphs(cell, rowIndex);
    }
    exportInTableParagraph(parIndex, tableNestingLevel, isEndParagraph, condTypes) {
        const paragraph = this.subDocument.paragraphs[parIndex];
        this.rtfExporter.exportParagraphCore(paragraph, tableNestingLevel, condTypes, this.tableStyleIndex);
        this.finishParagraph(isEndParagraph);
    }
    finishParagraph(isEndParagraph) {
        if (isEndParagraph)
            this.writeParagraphEndMark();
        else
            this.rtfBuilder.writeCommand(RtfExportSR.EndOfParagraph);
    }
    exportCellParagraphs(cell, parentRowIndex) {
        const startParagraphIndex = this.subDocument.getParagraphIndexByPosition(cell.startParagraphPosition.value);
        const endParagraphIndex = this.subDocument.getParagraphIndexByPosition(cell.endParagrapPosition.value - 1);
        for (let parIndex = startParagraphIndex; parIndex <= endParagraphIndex; parIndex++) {
            const paragraph = this.subDocument.paragraphs[parIndex];
            const parCell = paragraph.getTableCell();
            const nextParIndex = this.exportNestedTable(cell, parIndex);
            if (parCell !== cell) {
                parIndex = nextParIndex;
                if (this.nestingLevel == 1) {
                    const row = cell.parentRow;
                    this.exportRowProperties(row, parentRowIndex);
                }
            }
            else {
                if (this.nestingLevel == 1 && parIndex == startParagraphIndex && cell.isFirstCellInRow)
                    this.exportRowProperties(cell.parentRow, parentRowIndex);
                const isEndParagraph = parIndex == endParagraphIndex;
                this.exportInTableParagraph(parIndex, this.nestingLevel, isEndParagraph, cell.conditionalFormatting);
            }
        }
    }
    exportNestedTable(parentCell, parIndex) {
        const paragraph = this.subDocument.paragraphs[parIndex];
        const parCell = paragraph.getTableCell();
        if (parCell === parentCell) {
            return parIndex;
        }
        let nestedTable = parCell.parentRow.parentTable;
        while (parentCell !== nestedTable.parentCell) {
            nestedTable = nestedTable.parentCell.parentRow.parentTable;
        }
        return RtfTableExporter.exportNestedTable(this.rtfExporter, nestedTable, this.nestingLevel + 1);
    }
    exportRowProperties(row, rowIndex) {
        const rowLeft = this.calculateRowLeft(row, row.parentTable.getActualTableIndent(this.documentModel.defaultTableProperties));
        this.exportOwnRowProperties(row, rowIndex, rowLeft);
        let cellRightVirtualColInd = row.gridBefore;
        for (const cell of row.cells) {
            cellRightVirtualColInd += cell.columnSpan;
            const cellRight = rowLeft + this.getCellWidth(cellRightVirtualColInd);
            this.exportCellProperties(cell, cellRight);
        }
    }
    getCellWidth(virtualColumnIndex) {
        if (virtualColumnIndex < 0)
            throw new Error(Errors.InternalException);
        const minVirtualColumnWidth = 10;
        return virtualColumnIndex * minVirtualColumnWidth;
    }
    calculateRowLeft(row, indent) {
        const widthBefore = row.gridBefore > 0 ? this.getCellWidth(row.gridBefore) : 0;
        const offset = this.getActualWidth(indent) + widthBefore;
        return offset - (this.rowLeftOffset != null ? this.rowLeftOffset : this.calculateRowLeftOffset(row));
    }
    calculateRowLeftOffset(row) {
        const borderWidth = row.cells[0].properties.borders.leftBorder.width;
        const leftMargin = row.cells[0].properties.cellMargins.left;
        this.rowLeftOffset = Math.max(borderWidth / 2, this.getActualWidth(leftMargin));
        return this.rowLeftOffset;
    }
    getActualWidth(unit) {
        if (unit.type == TableWidthUnitType.ModelUnits)
            return unit.value;
        return 0;
    }
    exportOwnRowProperties(row, rowIndex, left) {
        this.startNewRow(rowIndex);
        this.tableRowPropertiesExporter.writeRowAlignment(row.properties.tableRowAlignment);
        const table = row.parentTable;
        const mergedTableProperties = new RtfTablePropertiesMerger(this.documentModel).getMergedProperties(table);
        this.tablePropertiesExporter.writeTableBorders(mergedTableProperties.borders);
        this.tablePropertiesExporter.writeRowLeft(left);
        this.tableRowPropertiesExporter.writeRowHeight(row.height);
        const mergedRowProperties = new RtfTableRowPropertiesMerger(this.documentModel).getMergedProperties(row);
        this.tableRowPropertiesExporter.writeRowHeader(mergedRowProperties.header);
        this.tableRowPropertiesExporter.writeRowCantSplit(mergedRowProperties.cantSplit);
        this.tablePropertiesExporter.writeTableWidth(table.preferredWidth);
        this.tableRowPropertiesExporter.writeWidthBefore(row.widthBefore);
        this.tableRowPropertiesExporter.writeWidthAfter(row.widthAfter);
        this.tablePropertiesExporter.writeTableLayout(table.properties.layoutType);
        this.tableRowPropertiesExporter.writeRowCellSpacing(mergedRowProperties.cellSpacing);
        this.tablePropertiesExporter.writeTableCellMargins(mergedTableProperties.cellMargins);
        this.tablePropertiesExporter.writeTableLook(table.lookTypes);
        this.tablePropertiesExporter.writeTableIndent(mergedTableProperties.indent);
        this.tablePropertiesExporter.writeBandSizes(table.properties);
    }
    startNewRow(rowIndex) {
        this.rtfBuilder.writeCommand(RtfExportSR.ResetTableProperties);
        this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableRowIndex, rowIndex);
        if ((this.table.lookTypes & TableLookTypes.ApplyFirstRow) > 0)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableRowBandIndex, rowIndex - 1);
        else
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableRowBandIndex, rowIndex);
        if (rowIndex == this.table.rows.length - 1)
            this.tableRowPropertiesExporter.writeLastRowMark();
        this.writeTableStyleIndex();
        this.tableRowPropertiesExporter.writeHalfSpaceBetweenCells(this.calcHalfSpaceBetweenCells());
    }
    writeTableStyleIndex() {
        if (this.tableStyleIndex != -1)
            this.rtfBuilder.writeIntegerCommand(RtfExportSR.TableStyleIndex, this.tableStyleIndex);
    }
    calcHalfSpaceBetweenCells() {
        const leftMargin = this.table.properties.cellMargins.left;
        const leftMarginVal = leftMargin.type == TableWidthUnitType.ModelUnits ? leftMargin.value : 0;
        const rightMargin = this.table.properties.cellMargins.right;
        const rightMarginVal = rightMargin.type == TableWidthUnitType.ModelUnits ? rightMargin.value : 0;
        return (leftMarginVal + rightMarginVal) / 2;
    }
    exportCellProperties(cell, cellRight) {
        const mergetTableCellProperties = new RtfTableCellPropertiesMerger(this.documentModel).getMergedProperties(cell);
        this.tableCellPropertiesExporter.writeCellVerticalMerging(cell.verticalMerging, TableCellMergingState.None);
        this.tableCellPropertiesExporter.writeCellVerticalAlignment(mergetTableCellProperties.verticalAlignment);
        this.tableCellPropertiesExporter.writeCellBasicBorders(this.getActualTopBorderInfo(cell), this.getActualLeftBorderInfo(cell), this.getActualRightBorderInfo(cell), this.getActualBottomBorderInfo(cell));
        this.tableCellPropertiesExporter.writeCellShading(mergetTableCellProperties.shadingInfo);
        this.tableCellPropertiesExporter.writeCellTextDirection(mergetTableCellProperties.textDirection);
        this.tableCellPropertiesExporter.writeCellFitText(mergetTableCellProperties.fitText);
        this.tableCellPropertiesExporter.writeCellNoWrap(mergetTableCellProperties.noWrap);
        this.tableCellPropertiesExporter.writeCellHideCellMark(mergetTableCellProperties.hideCellMark);
        this.tableCellPropertiesExporter.writeCellPreferredWidth(cell.preferredWidth);
        this.tableCellPropertiesExporter.writeCellMargings(mergetTableCellProperties.cellMargins);
        this.tableCellPropertiesExporter.writeCellRight(cellRight);
    }
    getActualLeftBorderInfo(cell) {
        let cellBorderInfo = cell.getActualLeftCellBorder(this.documentModel.defaultTableCellProperties);
        const isTableOuterBorder = cell.parentRow.cells[0] == cell && this.table.properties.cellSpacing.value <= 0;
        if (!cellBorderInfo)
            cellBorderInfo = this.table.getActualLeftBorder(this.documentModel.defaultTableProperties, isTableOuterBorder);
        return this.getActualBorderInfoCore(cellBorderInfo);
    }
    getActualRightBorderInfo(cell) {
        let cellBorderInfo = cell.getActualRightCellBorder(this.subDocument.documentModel.defaultTableCellProperties);
        const isTableOuterBorder = ListUtils.last(cell.parentRow.cells) == cell && this.table.properties.cellSpacing.value <= 0;
        if (!cellBorderInfo)
            cellBorderInfo = this.table.getActualRightBorder(this.documentModel.defaultTableProperties, isTableOuterBorder);
        return this.getActualBorderInfoCore(cellBorderInfo);
    }
    getActualTopBorderInfo(cell) {
        let cellBorderInfo = cell.getActualTopCellBorder(this.subDocument.documentModel.defaultTableCellProperties);
        const isTableOuterBorder = cell.parentRow.parentTable.rows[0] == cell.parentRow && this.table.properties.cellSpacing.value <= 0;
        if (!cellBorderInfo)
            cellBorderInfo = this.table.getActualTopBorder(this.documentModel.defaultTableProperties, isTableOuterBorder);
        return this.getActualBorderInfoCore(cellBorderInfo);
    }
    getActualBottomBorderInfo(cell) {
        let cellBorderInfo = cell.getActualBottomCellBorder(this.subDocument.documentModel.defaultTableCellProperties);
        const isTableOuterBorder = ListUtils.last(cell.parentRow.parentTable.rows) == cell.parentRow && this.table.properties.cellSpacing.value <= 0;
        if (!cellBorderInfo)
            cellBorderInfo = this.table.getActualBottomBorder(this.documentModel.defaultTableProperties, isTableOuterBorder);
        return this.getActualBorderInfoCore(cellBorderInfo);
    }
    getActualBorderInfoCore(cellBorderInfo) {
        if (!cellBorderInfo || cellBorderInfo.style == BorderLineStyle.Nil)
            return new BorderInfo();
        return cellBorderInfo;
    }
}
