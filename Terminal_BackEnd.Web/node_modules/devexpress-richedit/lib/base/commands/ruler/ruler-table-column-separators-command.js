import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { TableCellIterator } from '../../../core/layout/table/table-cell-iterator';
import { TableCellPropertiesMergerMarginLeft, TableCellPropertiesMergerMarginRight } from '../../../core/model/tables/properties-mergers/table-cell-properties-merger';
import { TableRowPropertiesMergerCellSpacing } from '../../../core/model/tables/properties-mergers/table-row-properties-merger';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class TableColumnSeparatorStruct {
    constructor() {
        this.index = 0;
        this.tableIndex = 0;
        this.cellSpacing = 0;
        this.minValue = -1;
        this.maxValue = -1;
        this.items = [];
    }
    get currItem() {
        return this.items[this.index];
    }
    get hasItems() {
        return this.items.length > 0;
    }
    createItem(position, marginLeft, marginRight) {
        this.items.push(new TableColumnSeparatorItem(position, marginLeft, marginRight));
    }
    clone() {
        const result = new TableColumnSeparatorStruct();
        result.index = this.index;
        result.tableIndex = this.tableIndex;
        result.minValue = this.minValue;
        result.maxValue = this.maxValue;
        result.items = ListUtils.deepCopy(this.items);
        return result;
    }
}
export class TableColumnSeparatorItem {
    constructor(position, leftMargin, rightMargin) {
        this.position = position;
        this.leftMargin = leftMargin;
        this.rightMargin = rightMargin;
    }
    clone() {
        return new TableColumnSeparatorItem(this.position, this.leftMargin, this.rightMargin);
    }
}
export class RulerTableColumnSeparatorsCommand extends CommandBase {
    DEPRECATEDCorrectlMainCommandOptions(options) {
        options.intervalsInfo.interval = this.selection.lastSelectedInterval;
    }
    getState(options = this.convertToCommandOptions(undefined)) {
        return new SimpleCommandState(this.isEnabled(), this.getColumnSeparatorsInfo(options.intervalsInfo.position, options.subDocument));
    }
    executeCore(_state, _parameter) {
        return true;
    }
    getLogicCell(grid, rowIndex, cellIndex) {
        return grid.table.rows[rowIndex].cells[grid.tableCellGridInfos[rowIndex][cellIndex].getCellIndex(0)];
    }
    getMergedCell(layoutGrids, gridCell, startRowIndex) {
        let currLayoutGrid = layoutGrids[0];
        if (layoutGrids.length > 1) {
            for (let table, i = 0; table = layoutGrids[i]; i++) {
                if (table.tableRows[startRowIndex]) {
                    currLayoutGrid = table;
                    break;
                }
                startRowIndex = startRowIndex - table.tableRows.length;
            }
        }
        return this.findLayoutCellByCellGridIndex(currLayoutGrid.tableRows[startRowIndex].rowCells, gridCell.getGridCellIndex());
    }
    getColumnSeparatorsInfo(position, subDocument) {
        let sellSpacing = null;
        const setCellSpacing = (cell) => {
            if (sellSpacing == null) {
                const table = cell.parentRow.parentTable;
                const val = new TableRowPropertiesMergerCellSpacing(this.control.modelManager.model, table, cell.parentRow.tablePropertiesException)
                    .getProperty(cell.parentRow.properties, table.style, cell.conditionalFormatting, this.control.modelManager.model.defaultTableRowProperties);
                sellSpacing = UnitConverter.twipsToPixelsF(val.value);
            }
            return sellSpacing;
        };
        let struct = new TableColumnSeparatorStruct();
        if (this.selection.tableInfo.extendedData.numRows) {
            let layoutPosition = (subDocument.isMain()
                ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, position, DocumentLayoutDetailsLevel.Character)
                : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, position, this.selection.pageIndex, DocumentLayoutDetailsLevel.Character))
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
            if (layoutPosition) {
                let iterator = new TableCellIterator(layoutPosition, this.control.layout, this.control.measurer);
                let layoutCell = iterator.tableCellInfo;
                if (layoutCell) {
                    let layoutGrids = iterator.getLayoutTablesAssociatedWithLogicGrid();
                    let currLayoutGrid = layoutCell.parentRow.parentTable;
                    let currLogicGrid = currLayoutGrid.logicInfo.grid;
                    let logicGridRowIndex = layoutCell.parentRow.rowIndex;
                    let gridCells = currLogicGrid.tableCellInfos[logicGridRowIndex];
                    let isCreatedLastItem = false;
                    for (let gridCell, i = 0; gridCell = gridCells[i]; i++) {
                        var startRowIndex = gridCell.getStartRowIndex();
                        if (startRowIndex != logicGridRowIndex) {
                            let mergedCell = this.getMergedCell(layoutGrids, gridCell, startRowIndex);
                            if (mergedCell) {
                                let logicCell = this.getLogicCell(currLogicGrid, startRowIndex, mergedCell.cellGridIndex);
                                let xPos = mergedCell.x;
                                if (i == gridCells.length - 1) {
                                    isCreatedLastItem = true;
                                    struct.createItem(xPos + mergedCell.width, 0, 0);
                                    setCellSpacing(logicCell);
                                }
                                struct.createItem(xPos, this.getMarginLeft(logicCell), this.getMarginRight(logicCell));
                                setCellSpacing(logicCell);
                            }
                        }
                    }
                    for (let i = 0, cell; cell = layoutCell.parentRow.rowCells[i]; i++) {
                        let logicCell = this.getLogicCell(currLogicGrid, logicGridRowIndex, cell.cellGridIndex);
                        struct.createItem(cell.x, this.getMarginLeft(logicCell), this.getMarginRight(logicCell));
                        setCellSpacing(logicCell);
                    }
                    if (!isCreatedLastItem) {
                        let lastLayoutCell = ListUtils.last(layoutCell.parentRow.rowCells);
                        struct.createItem(lastLayoutCell.right, 0, 0);
                    }
                    struct.tableIndex = currLogicGrid.table.index;
                    struct.items = struct.items.sort((a, b) => a.position - b.position);
                    struct.index = SearchUtils.normedInterpolationIndexOf(struct.items, (item) => item.position, layoutCell.x);
                    if (currLayoutGrid.parentCell) {
                        struct.minValue = currLayoutGrid.parentCell.x;
                        struct.maxValue = currLayoutGrid.parentCell.right;
                    }
                }
            }
        }
        struct.cellSpacing = sellSpacing == null ? 0 : sellSpacing;
        return struct;
    }
    getMarginLeft(cell) {
        let table = cell.parentRow.parentTable;
        let val = new TableCellPropertiesMergerMarginLeft(table, this.control.modelManager.model, cell.parentRow.tablePropertiesException)
            .getProperty(cell.properties, table.style, cell.conditionalFormatting, this.control.modelManager.model.defaultTableCellProperties);
        return UnitConverter.twipsToPixelsF(val.value);
    }
    getMarginRight(cell) {
        let table = cell.parentRow.parentTable;
        let val = new TableCellPropertiesMergerMarginRight(table, this.control.modelManager.model, cell.parentRow.tablePropertiesException)
            .getProperty(cell.properties, table.style, cell.conditionalFormatting, this.control.modelManager.model.defaultTableCellProperties);
        return UnitConverter.twipsToPixelsF(val.value);
    }
    findLayoutCellByCellGridIndex(cells, cellGridIndex) {
        return cells[SearchUtils.normedInterpolationIndexOf(cells, (c) => c.cellGridIndex, cellGridIndex)];
    }
}
