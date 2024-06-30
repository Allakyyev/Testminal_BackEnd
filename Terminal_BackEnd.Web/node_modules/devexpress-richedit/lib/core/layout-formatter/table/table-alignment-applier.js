import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { TableCellBoundFlags } from '../../layout/table/layout-table-cell-info';
import { TableCellVerticalAlignmentMerger } from '../../model/tables/properties-mergers/table-cell-properties-merger';
import { TablePropertiesMergerHorizontalAlignment } from '../../model/tables/properties-mergers/table-properties-merger';
import { TableRowPropertiesMergerHorizontalAlignment } from '../../model/tables/properties-mergers/table-row-properties-merger';
import { ConditionalTableStyleFormatting, TableCellVerticalAlignment, TableRowAlignment } from '../../model/tables/secondary-structures/table-base-structures';
export class TableAlignmentApplier {
    static getTableAlignment(table) {
        const firstRowAlignment = new TableRowPropertiesMergerHorizontalAlignment(table.rows[0].tablePropertiesException)
            .getProperty(table.rows[0].properties, table.style, table.rows[0].conditionalFormatting, null);
        const allRowAlignmentsEqual = firstRowAlignment != null && ListUtils.allOf(table.rows, (row) => new TableRowPropertiesMergerHorizontalAlignment(row.tablePropertiesException)
            .getProperty(row.properties, table.style, row.conditionalFormatting, null) == firstRowAlignment);
        return allRowAlignmentsEqual ? firstRowAlignment : new TablePropertiesMergerHorizontalAlignment()
            .getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, null);
    }
    static applyHorizontalAlignment(currTableColumnInfo, tableMaxWidth) {
        const table = currTableColumnInfo.logicInfo.grid.table;
        const tableAlignment = this.getTableAlignment(table);
        const leftBound = currTableColumnInfo.x;
        const rightBound = leftBound + tableMaxWidth;
        const avalSpace = rightBound - currTableColumnInfo.right;
        let offset;
        switch (tableAlignment != null ? tableAlignment : TableRowAlignment.Left) {
            case TableRowAlignment.Right:
                offset = avalSpace;
                break;
            case TableRowAlignment.Center:
                offset = Math.floor(avalSpace / 2);
                break;
            case TableRowAlignment.Left:
            default:
                offset = 0;
                break;
        }
        if (offset <= 0)
            return;
        TableAlignmentApplier.moveAllTable(currTableColumnInfo, (rect) => rect.x += offset);
    }
    static applyCellsVerticalAlignment(defaultTableCellProps, grid, currTableColumnInfo, rowInfo) {
        const table = grid.table;
        const tableStyle = table.style;
        for (let tblRow of currTableColumnInfo.tableRows) {
            for (let tblCell of tblRow.rowCells) {
                if (!(tblCell.boundFlags.get(TableCellBoundFlags.StartOnThisColumn) && tblCell.boundFlags.get(TableCellBoundFlags.EndOnThisColumn)))
                    continue;
                const cellGridInfo = grid.tableCellGridInfos[tblRow.rowIndex][tblCell.cellGridIndex];
                const cellStartRowIndex = cellGridInfo.getStartRowIndex();
                const cellIndex = cellGridInfo.getCellIndex(0);
                const cell = table.rows[cellStartRowIndex].cells[cellIndex];
                const verticalAlignmentType = new TableCellVerticalAlignmentMerger()
                    .getProperty(cell.properties, tableStyle, cell.conditionalFormatting, defaultTableCellProps);
                const topAndBottomMargins = rowInfo[cellStartRowIndex].topAndBottomMargins;
                const bottomBound = tblCell.bottom - topAndBottomMargins.bottomMargin -
                    rowInfo[tblRow.rowIndex].cellSpacing * (tblRow.rowIndex == table.rows.length - 1 ? 2 : 1);
                const numLayoutRows = tblCell.layoutRows.length;
                const lastInnerTable = tblCell.internalTables[numLayoutRows];
                const rowsBottomBound = lastInnerTable ?
                    lastInnerTable.bottom :
                    tblCell.layoutRows[numLayoutRows - 1].bottom;
                const avalSpace = bottomBound - rowsBottomBound;
                var offset;
                switch (verticalAlignmentType) {
                    case TableCellVerticalAlignment.Bottom:
                        offset = avalSpace;
                        break;
                    case TableCellVerticalAlignment.Center:
                        offset = Math.floor(avalSpace / 2);
                        break;
                    case TableCellVerticalAlignment.Top:
                    default:
                        offset = 0;
                        break;
                }
                if (offset <= 0)
                    continue;
                for (let layoutRow of tblCell.layoutRows)
                    layoutRow.y += offset;
                NumberMapUtils.forEach(tblCell.internalTables, table => TableAlignmentApplier.moveAllTable(table, (rect) => rect.y += offset));
            }
        }
    }
    static moveAllTable(tblCol, mover) {
        mover(tblCol);
        for (let tblRow of tblCol.tableRows) {
            mover(tblRow);
            for (let tblCell of tblRow.rowCells) {
                mover(tblCell);
                NumberMapUtils.forEach(tblCell.internalTables, table => TableAlignmentApplier.moveAllTable(table, mover));
                for (let layoutRow of tblCell.layoutRows)
                    mover(layoutRow);
            }
        }
    }
}
