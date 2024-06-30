import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutTableRowInfo } from '../../../layout/table/layout-table-row-info';
import { TableRowPropertiesMergerCantSplit, TableRowPropertiesMergerCellSpacing, TableRowPropertiesMergerHorizontalAlignment } from '../../../model/tables/properties-mergers/table-row-properties-merger';
import { TableCellMergingState } from '../../../model/tables/secondary-structures/table-base-structures';
import { Formatter } from '../formatter';
import { TableRowHeightInfo, TopAndBottomMarginsForRow } from '../other';
export class RowInfo {
    constructor(tableInfo, rowIndex) {
        this.cells = [];
        this.tableInfo = tableInfo;
        this.rowIndex = rowIndex;
        this.howManyColumnsConsiderTableRow = 0;
        this.init();
    }
    get row() { return this.tableInfo.table.rows[this.rowIndex]; }
    init() {
        const row = this.row;
        const cantSplit = new TableRowPropertiesMergerCantSplit().getProperty(row.properties, this.tableInfo.tableStyle, row.conditionalFormatting, this.tableInfo.defaultTblRowProps);
        const horizontalAlignment = new TableRowPropertiesMergerHorizontalAlignment(row.tablePropertiesException)
            .getProperty(row.properties, this.tableInfo.tableStyle, row.conditionalFormatting, this.tableInfo.defaultTblRowProps);
        this.heightInfo = new TableRowHeightInfo(cantSplit, row.height, horizontalAlignment);
        this.cellSpacing = new TableRowPropertiesMergerCellSpacing(this.tableInfo.model, this.tableInfo.table, row.tablePropertiesException)
            .getProperty(row.properties, this.tableInfo.tableStyle, row.conditionalFormatting, this.tableInfo.defaultTblRowProps)
            .asNumberNoPercentType(UnitConverter.twipsToPixels);
        this.topAndBottomMargins = new TopAndBottomMarginsForRow();
        for (let cell of row.cells) {
            if (cell.verticalMerging == TableCellMergingState.Continue)
                continue;
            this.topAndBottomMargins.addCellTopMargin(Formatter.getCellMargin(cell.getActualTopCellMargin(this.tableInfo.model)));
            this.topAndBottomMargins.addCellBottomMargin(Formatter.getCellMargin(cell.getActualBottomCellMargin(this.tableInfo.model)));
        }
    }
    initLayoutInfo(isFirstRowInColumn, column) {
        const prevTblRow = ListUtils.last(this.tableInfo.currLayoutTableColumnInfo.tableRows);
        this.currLayoutTableRowInfo = new LayoutTableRowInfo(this.tableInfo.currLayoutTableColumnInfo, new Rectangle(this.tableInfo.xPositionStart, prevTblRow ? prevTblRow.bottom : this.tableInfo.currLayoutTableColumnInfo.y, 0, 0), this.tableInfo.minRowIndex);
        this.tableInfo.currRowHorizontalBorders = this.tableInfo.bordersHelper.getHorizontalBordersByRow(this.currLayoutTableRowInfo.rowIndex, this.tableInfo.isThisTableRowFirstInColumn || isFirstRowInColumn, true);
        for (let cell of this.cells)
            cell.initLayoutInfo();
        this.layoutRowIndexInColumn = column.rows.length;
    }
    clearLayoutInfo() {
        this.currLayoutTableRowInfo = null;
        this.tableInfo.currRowHorizontalBorders = null;
        for (let cell of this.cells)
            cell.clearLayoutInfo();
    }
}
