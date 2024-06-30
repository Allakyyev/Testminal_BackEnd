import { TableCellPropertiesMergerBorderLeft, TableCellPropertiesMergerBorderRight, TableCellPropertiesMergerBorderTop, TableCellPropertiesMergerBorderTopLeftDiagonal, TableCellPropertiesMergerBorderTopRightDiagonal, TableCellPropertiesMergerMarginBottom, TableCellPropertiesMergerMarginLeft, TableCellPropertiesMergerMarginRight, TableCellPropertiesMergerMarginTop, TableCellPropertiesMergerNoWrap, TableCellPropertiesMergerShadingInfo, TableCellVerticalAlignmentMerger } from '../../../core/model/tables/properties-mergers/table-cell-properties-merger';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfTablePropertiesMergerBase } from './rtf-table-properties-merger-base';
export class RtfTableCellPropertiesMerger extends RtfTablePropertiesMergerBase {
    constructor(model) {
        super(model);
    }
    get defaultProperties() {
        return this.model.defaultTableCellProperties;
    }
    getMergedProperties(cell) {
        return this.merge(cell.properties, cell.parentRow.parentTable.style, cell, null, cell.conditionalFormatting);
    }
    getStyleMergedProperties(style, tableStyle, conditionalTFormatting) {
        return this.merge(style.tableCellProperties, tableStyle, null, null, conditionalTFormatting);
    }
    merge(source, tableStyle, cell, _tablePropertiesException, conditionalFormatting) {
        const result = source.clone();
        if (cell) {
            const row = cell.parentRow;
            const table = row.parentTable;
            const tablePropertiesException = row.tablePropertiesException;
            result.cellMargins.left = new TableCellPropertiesMergerMarginLeft(table, this.model, tablePropertiesException)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.cellMargins.right = new TableCellPropertiesMergerMarginRight(table, this.model, tablePropertiesException)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.cellMargins.top = new TableCellPropertiesMergerMarginTop(table, this.model, tablePropertiesException)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.cellMargins.bottom = new TableCellPropertiesMergerMarginBottom(table, this.model, tablePropertiesException)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.borders.leftBorder = new TableCellPropertiesMergerBorderLeft(tablePropertiesException, row.cells[0] == cell)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.borders.rightBorder = new TableCellPropertiesMergerBorderRight(tablePropertiesException, ListUtils.last(row.cells) == cell)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.borders.topBorder = new TableCellPropertiesMergerBorderTop(tablePropertiesException, table.rows[0] == row)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.borders.bottomBorder = new TableCellPropertiesMergerBorderTop(tablePropertiesException, ListUtils.last(table.rows) == row)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.borders.topLeftDiagonalBorder = new TableCellPropertiesMergerBorderTopLeftDiagonal(tablePropertiesException)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
            result.borders.topRightDiagonalBorder = new TableCellPropertiesMergerBorderTopRightDiagonal(tablePropertiesException)
                .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        }
        result.shadingInfo = new TableCellPropertiesMergerShadingInfo()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.noWrap = new TableCellPropertiesMergerNoWrap()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        result.verticalAlignment = new TableCellVerticalAlignmentMerger()
            .getProperty(source, tableStyle, conditionalFormatting, this.defaultProperties);
        return result;
    }
}
