import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { TablePosition } from '../../../../model/tables/main-structures/table';
import { TableCellPropertiesMergerNoWrap } from '../../../../model/tables/properties-mergers/table-cell-properties-merger';
import { TableCellMergingState, TableLayoutType } from '../../../../model/tables/secondary-structures/table-base-structures';
import { TableWidthUnit, TableWidthUnitType } from '../../../../model/tables/secondary-structures/table-units';
import { BorderHelper, TableBorderInfoProvider } from '../../borders/border-helper';
import { Formatter } from '../../formatter';
export class TablePropertiesCache {
    constructor(model, table, grid, innerClientProperties) {
        this.borderProvider = new TableBorderInfoProvider(model, table, UnitConverter.twipsToPixels);
        this.indent = table.getActualTableIndent(model.defaultTableProperties);
        if (innerClientProperties.viewsSettings.isSimpleView && table.nestedLevel == 0 && this.indent.value < 0) {
            this.indent = this.indent.clone();
            this.indent.value = 0;
        }
        this.layoutType = table.getActualTableLayout(model.defaultTableProperties);
        this.preferredWidth = this.getActualPreferredWidth(table);
        const pos = new TablePosition(table, -1, -1);
        this.rows = [];
        while (pos.moveToNextRow())
            this.rows.push(new TableRowPropertiesCache(model, this.borderProvider, pos, this.rows, grid));
    }
    get isFixedTableWidth() {
        const type = this.preferredWidth.type;
        return type == TableWidthUnitType.FiftiethsOfPercent || type == TableWidthUnitType.ModelUnits;
    }
    get isFixedAlgoritm() {
        return this.layoutType == TableLayoutType.Fixed && this.isFixedTableWidth;
    }
    getActualPreferredWidth(table) {
        let result = table.preferredWidth;
        if (result.type == TableWidthUnitType.ModelUnits && result.value == 0)
            result = TableWidthUnit.createDefault();
        return result;
    }
}
export class TableRowPropertiesCache {
    constructor(model, tblBrdProv, pos, rows, grid) {
        this.cells = [];
        while (pos.moveToNextCell()) {
            if (pos.cell.verticalMerging == TableCellMergingState.Continue) {
                const cellInfo = grid.tableCellInfos[pos.rowIndex][pos.cellIndex];
                const rowIndex = cellInfo.getStartRowIndex();
                this.cells.push(rows[rowIndex].cells[cellInfo.getCellIndexAbs(rowIndex)]);
            }
            else
                this.cells.push(new TableCellPropertiesCache(model, tblBrdProv, pos));
        }
    }
}
export class TableCellPropertiesCache {
    constructor(model, tblBrdProv, pos) {
        const tableStyle = pos.table.style;
        const defCellProps = model.defaultTableCellProperties;
        this.noWrap = new TableCellPropertiesMergerNoWrap().getProperty(pos.cell.properties, tableStyle, pos.cell.conditionalFormatting, defCellProps);
        this.horizontalMargins =
            Formatter.getCellMargin(pos.cell.getActualLeftCellMargin(model)) +
                Formatter.getCellMargin(pos.cell.getActualRightCellMargin(model));
        this.leftBorderWidth = BorderHelper.getLeftBorder(model.colorProvider, pos, pos.row.cells[pos.cellIndex - 1], tblBrdProv, UnitConverter.twipsToPixels).width;
        this.rightBorderWidth = BorderHelper.getRightBorder(model.colorProvider, pos, pos.row.cells[pos.cellIndex + 1], tblBrdProv, UnitConverter.twipsToPixels).width;
        this.spacing = tblBrdProv.cellSpacings[pos.rowIndex] *
            ((pos.cell.parentRow.gridBefore == 0 && pos.cellIndex == 0) ||
                (pos.cell.parentRow.gridAfter == 0 && pos.cellIndex == pos.row.cells.length - 1) ?
                3 : 2);
    }
}
