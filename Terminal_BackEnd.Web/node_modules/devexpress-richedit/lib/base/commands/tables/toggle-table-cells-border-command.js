import { BorderHelper, TableBorderInfoProvider } from '../../../core/layout-formatter/table/borders/border-helper';
import { BorderInfo } from '../../../core/model/borders/border-info';
import { TableCellBordersHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { TableBordersHistoryItem } from '../../../core/model/history/items/tables/table-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { TablePosition } from '../../../core/model/tables/main-structures/table';
import { TableCellPropertiesMergerBorderBottom, TableCellPropertiesMergerBorderTop } from '../../../core/model/tables/properties-mergers/table-cell-properties-merger';
import { TablePropertiesMergerBorderBottom, TablePropertiesMergerBorderHorizontal, TablePropertiesMergerBorderLeft, TablePropertiesMergerBorderRight, TablePropertiesMergerBorderTop, TablePropertiesMergerBorderVertical } from '../../../core/model/tables/properties-mergers/table-properties-merger';
import { ConditionalTableStyleFormatting, TableCellMergingState } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ToggleTableCellsBorderCommandBase extends CommandBase {
    constructor() {
        super(...arguments);
        this.affectNeighbours = true;
        this.affectInner = true;
        this.affectOuter = true;
        this.affectOnStateFlags = TableBorderGridCellInfo.All;
    }
    get colorProvider() { return this.control.modelManager.model.colorProvider; }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return parameter instanceof BorderInfo ? parameter : this.control.modelManager.model.repositoryBorderItem;
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.ToggleTableCellAllBorders]: true,
            [RichEditClientCommand.ToggleTableCellInsideBorders]: true,
            [RichEditClientCommand.ToggleTableCellInsideHorizontalBorders]: true,
            [RichEditClientCommand.ToggleTableCellInsideVerticalBorders]: true,
            [RichEditClientCommand.ToggleTableCellNoBorder]: true,
            [RichEditClientCommand.ToggleTableCellOutsideBorders]: true,
            [RichEditClientCommand.ToggleTableCellsBottomBorder]: true,
            [RichEditClientCommand.ToggleTableCellsLeftBorder]: true,
            [RichEditClientCommand.ToggleTableCellsRightBorder]: true,
            [RichEditClientCommand.ToggleTableCellsTopBorder]: true,
        };
    }
    getState(options = this.convertToCommandOptions(null)) {
        const tableInfo = this.selection.tableInfo;
        let enabled = this.isEnabled() && this.selection.tableInfo.extendedData.areCellsSelectedInSeries;
        let state = new SimpleCommandState(enabled);
        if (state.enabled)
            state.value = this.isChecked(tableInfo, options.param);
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    isChecked(tableInfo, patternBorder) {
        let table = tableInfo.table;
        if (tableInfo.extendedData.isSelectedEntireTable)
            return this.checkBorderInEntireTable(patternBorder, table);
        let tableBordersInfo = new TableBorderInfoProvider(this.control.modelManager.model, table, v => v);
        let bordersGrid = this.createCellBorderGrid(table, tableInfo, tableBordersInfo);
        return this.isCheckedInParticallyTableSelection(table, bordersGrid, tableBordersInfo, patternBorder);
    }
    executeCore(state, options) {
        this.history.beginTransaction();
        let tableInfo = this.selection.tableInfo;
        let table = tableInfo.table;
        let patternBorder = options.param;
        let subDocument = this.selection.activeSubDocument;
        if (tableInfo.extendedData.isSelectedEntireTable)
            this.applyBorderToTable(subDocument, table, state.value ? null : patternBorder);
        let tblBrdProv = new TableBorderInfoProvider(this.control.modelManager.model, table, v => v);
        let grid = this.createCellBorderGrid(table, tableInfo, tblBrdProv);
        for (let i = 0, gridRow; gridRow = grid[i]; i++) {
            let cellIndex = -1;
            let prevCell = null;
            for (let j = 0, gridCell; gridCell = gridRow[j]; j++) {
                if (gridCell.cell != prevCell)
                    cellIndex++;
                prevCell = gridCell.cell;
                if (!gridCell.cell || gridCell.cell.verticalMerging === TableCellMergingState.Continue)
                    continue;
                this.applyBorderToCell(subDocument, table, gridCell, i, cellIndex, state.value ? null : patternBorder.clone());
            }
        }
        this.history.endTransaction();
        return true;
    }
    isCheckedInParticallyTableSelection(table, grid, tableBordersInfo, patternBorder) {
        let hasAffectedCells = false;
        for (let i = 0, gridRow; gridRow = grid[i]; i++) {
            for (let j = 0, gridCell; gridCell = gridRow[j]; j++) {
                if (!gridCell.cell || gridCell.cell.verticalMerging === TableCellMergingState.Continue || gridCell.info === TableBorderGridCellInfo.None)
                    continue;
                if (!(gridCell.info & this.affectOnStateFlags))
                    continue;
                hasAffectedCells = true;
                if (!this.checkBorderInParticallyTableSelection(patternBorder, table, grid, gridCell, i, j, tableBordersInfo))
                    return false;
            }
        }
        return hasAffectedCells;
    }
    createCellBorderGrid(table, tableInfo, tableBordersInfo) {
        let grid = this.createCellBorderGridCore(table, tableInfo);
        let rowsCount = grid.length;
        let columnsCount = grid[0].length;
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            let columnIndex = row.gridBefore;
            let isLastRow = rowIndex + 1 === rowsCount;
            let hasSpacing = tableBordersInfo.cellSpacings[rowIndex] > 0;
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                let isLastCell = columnIndex + cell.columnSpan === columnsCount;
                let gridCell = grid[rowIndex][columnIndex];
                if (cell.verticalMerging === TableCellMergingState.Continue) {
                    if (isLastRow && grid[rowIndex - 1][columnIndex].info & TableBorderGridCellInfo.BottomOuter) {
                        let prevRowIndex = rowIndex;
                        do {
                            prevRowIndex--;
                            grid[prevRowIndex][columnIndex].info |= TableBorderGridCellInfo.BottomTableOuter;
                        } while (grid[prevRowIndex][columnIndex].cell.verticalMerging !== TableCellMergingState.Restart);
                    }
                    gridCell.info = grid[rowIndex - 1][columnIndex].info;
                }
                else if (!gridCell.selected) {
                    if (!hasSpacing && this.affectNeighbours) {
                        if (!isLastRow && this.checkBottomSibling(grid, rowIndex, columnIndex, ToggleTableCellsBorderCommandBase.checkVSiblingSelected))
                            gridCell.info |= TableBorderGridCellInfo.TopNeighbour;
                        if (this.checkLeftRightSiblingSelected(cell, rowIndex, columnIndex, columnIndex - 1, TableBorderGridCellInfo.RightNeighbour, grid))
                            gridCell.info |= TableBorderGridCellInfo.RightNeighbour;
                        if (ToggleTableCellsBorderCommandBase.checkVSiblingSelected(cell.columnSpan, rowIndex - 1, columnIndex, grid))
                            gridCell.info |= TableBorderGridCellInfo.BottomNeighbour;
                        if (!isLastCell && this.checkLeftRightSiblingSelected(cell, rowIndex, columnIndex, columnIndex + cell.columnSpan, TableBorderGridCellInfo.LeftNeighbour, grid))
                            gridCell.info |= TableBorderGridCellInfo.LeftNeighbour;
                    }
                }
                else {
                    if (this.affectInner) {
                        if (ToggleTableCellsBorderCommandBase.checkVSiblingSelected(cell.columnSpan, rowIndex - 1, columnIndex, grid))
                            gridCell.info |= TableBorderGridCellInfo.TopInner;
                        if (!isLastRow && this.checkBottomSibling(grid, rowIndex, columnIndex, ToggleTableCellsBorderCommandBase.checkVSiblingSelected))
                            gridCell.info |= TableBorderGridCellInfo.BottomInner;
                        if (this.checkLeftRightSiblingSelected(cell, rowIndex, columnIndex, columnIndex - 1, TableBorderGridCellInfo.LeftInner, grid))
                            gridCell.info |= TableBorderGridCellInfo.LeftInner;
                        if (!isLastCell && this.checkLeftRightSiblingSelected(cell, rowIndex, columnIndex, columnIndex + cell.columnSpan, TableBorderGridCellInfo.RightInner, grid))
                            gridCell.info |= TableBorderGridCellInfo.RightInner;
                    }
                    if (this.affectOuter) {
                        if (ToggleTableCellsBorderCommandBase.checkVSiblingUnselected(cell.columnSpan, rowIndex - 1, columnIndex, grid))
                            gridCell.info |= TableBorderGridCellInfo.TopOuter;
                        if (isLastRow || this.checkBottomSibling(grid, rowIndex, columnIndex, ToggleTableCellsBorderCommandBase.checkVSiblingUnselected))
                            gridCell.info |= TableBorderGridCellInfo.BottomOuter;
                        if (!this.checkLeftRightSiblingSelected(cell, rowIndex, columnIndex, columnIndex - 1, TableBorderGridCellInfo.LeftInner, grid))
                            gridCell.info |= TableBorderGridCellInfo.LeftOuter;
                        if (isLastCell || !this.checkLeftRightSiblingSelected(cell, rowIndex, columnIndex, columnIndex + cell.columnSpan, TableBorderGridCellInfo.RightInner, grid))
                            gridCell.info |= TableBorderGridCellInfo.RightOuter;
                        if (columnIndex === 0)
                            gridCell.info |= TableBorderGridCellInfo.LeftTableOuter;
                        if (columnIndex + cell.columnSpan === columnsCount)
                            gridCell.info |= TableBorderGridCellInfo.RightTableOuter;
                        if (rowIndex === 0)
                            gridCell.info |= TableBorderGridCellInfo.TopTableOuter;
                        if (rowIndex === rowsCount - 1)
                            gridCell.info |= TableBorderGridCellInfo.BottomTableOuter;
                    }
                }
                columnIndex += cell.columnSpan;
            }
        }
        return grid;
    }
    createCellBorderGridCore(table, tableInfo) {
        let grid = [];
        let selectedCellsVIndex = 0;
        let selectedCellsHIndex = -1;
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            const horSelectedRowInfo = tableInfo.extendedData.rows[selectedCellsVIndex];
            if (horSelectedRowInfo && horSelectedRowInfo.row === row) {
                selectedCellsVIndex++;
                selectedCellsHIndex = 0;
            }
            else
                selectedCellsHIndex = -1;
            grid.push([]);
            for (let i = 0; i < row.gridBefore; i++)
                grid[rowIndex].push({ cell: null, info: TableBorderGridCellInfo.None, selected: false });
            let columnIndex = row.gridBefore;
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                let borderGridCell = { cell: cell, info: TableBorderGridCellInfo.None, selected: false };
                if (cell.verticalMerging === TableCellMergingState.Continue && grid[rowIndex - 1][columnIndex].selected) {
                    if (grid[rowIndex - 1][columnIndex].selected)
                        borderGridCell.selected = true;
                }
                if (selectedCellsHIndex > -1 && horSelectedRowInfo.cells[selectedCellsHIndex] && horSelectedRowInfo.cells[selectedCellsHIndex].cell === cell) {
                    borderGridCell.selected = true;
                    selectedCellsHIndex++;
                }
                for (let i = 0; i < cell.columnSpan; i++)
                    grid[rowIndex].push(borderGridCell);
                columnIndex += cell.columnSpan;
            }
            for (let i = 0; i < row.gridAfter; i++)
                grid[rowIndex].push({ cell: null, info: TableBorderGridCellInfo.None, selected: false });
        }
        return grid;
    }
    checkBottomSibling(grid, rowIndex, columnIndex, testFunc) {
        let gridCell = grid[rowIndex][columnIndex];
        if (gridCell.cell.verticalMerging === TableCellMergingState.Restart) {
            while (grid[rowIndex]) {
                rowIndex++;
                if (!grid[rowIndex] || grid[rowIndex][columnIndex].cell.verticalMerging !== TableCellMergingState.Continue)
                    break;
            }
        }
        else
            rowIndex++;
        return testFunc(gridCell.cell.columnSpan, rowIndex, columnIndex, grid);
    }
    static checkVSiblingSelected(columnSpan, checkingRowIndex, columnIndex, grid) {
        if (checkingRowIndex < 0)
            return false;
        if (!grid[checkingRowIndex])
            return false;
        for (let i = 0; i < columnSpan; i++) {
            if (!grid[checkingRowIndex][columnIndex + i].selected)
                return false;
        }
        return true;
    }
    static checkVSiblingUnselected(columnSpan, checkingRowIndex, columnIndex, grid) {
        if (checkingRowIndex < 0)
            return true;
        if (!grid[checkingRowIndex])
            return true;
        for (let i = 0; i < columnSpan; i++) {
            if (grid[checkingRowIndex][columnIndex + i].selected)
                return false;
        }
        return true;
    }
    checkLeftRightSiblingSelected(cell, rowIndex, columnIndex, sibColumnIndex, testingPosition, grid) {
        if (sibColumnIndex < 0)
            return false;
        if (!grid[rowIndex][sibColumnIndex].selected)
            return false;
        if (cell.verticalMerging === TableCellMergingState.Restart) {
            while (true) {
                rowIndex++;
                if (!grid[rowIndex] || !grid[rowIndex][columnIndex].cell || grid[rowIndex][columnIndex].cell.verticalMerging !== TableCellMergingState.Continue)
                    break;
                if (!grid[rowIndex][sibColumnIndex].selected)
                    return false;
            }
        }
        else if (cell.verticalMerging === TableCellMergingState.Continue) {
            while (rowIndex > 0) {
                rowIndex--;
                if (grid[rowIndex][columnIndex].cell.verticalMerging === TableCellMergingState.Restart) {
                    if (!(grid[rowIndex][columnIndex].info & testingPosition))
                        return false;
                    break;
                }
            }
        }
        return true;
    }
    getActualLeftBorder(tableBordersInfo, table, rowIndex, columnIndex) {
        const pos = new TablePosition(table, rowIndex, columnIndex).init();
        return BorderHelper.getLeftBorder(this.colorProvider, pos, pos.row.cells[pos.cellIndex - 1], tableBordersInfo, v => v);
    }
    getActualRightBorder(tableBordersInfo, table, rowIndex, columnIndex) {
        const pos = new TablePosition(table, rowIndex, columnIndex).init();
        return BorderHelper.getRightBorder(this.colorProvider, pos, pos.row.cells[pos.cellIndex + 1], tableBordersInfo, v => v);
    }
    getActualTopBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex) {
        var cellSpacing = tableBordersInfo.cellSpacings[rowIndex];
        let sibling = rowIndex > 0 ? grid[rowIndex - 1][columnIndex] : null;
        if (cellSpacing > 0)
            return BorderHelper.mergeThreeBorders(this.colorProvider, currentCell.cell, TableCellPropertiesMergerBorderTop, null, null, !sibling, tableBordersInfo.horizontalBorder, table.style, v => v);
        if (currentCell.info & TableBorderGridCellInfo.TopTableOuter)
            return BorderHelper.mergeThreeBorders(this.colorProvider, currentCell.cell, TableCellPropertiesMergerBorderTop, null, null, true, tableBordersInfo.topBorder, table.style, v => v);
        return BorderHelper.mergeThreeBorders(this.colorProvider, currentCell.cell, TableCellPropertiesMergerBorderTop, sibling.cell, TableCellPropertiesMergerBorderBottom, false, tableBordersInfo.horizontalBorder, table.style, v => v);
    }
    getActualBottomBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex) {
        var cellSpacing = tableBordersInfo.cellSpacings[rowIndex];
        let sibling = rowIndex + 1 < grid.length ? grid[rowIndex + 1][columnIndex] : null;
        if (cellSpacing > 0)
            return BorderHelper.mergeThreeBorders(this.colorProvider, currentCell.cell, TableCellPropertiesMergerBorderBottom, null, null, !sibling, tableBordersInfo.horizontalBorder, table.style, v => v);
        if (currentCell.info & TableBorderGridCellInfo.BottomTableOuter)
            return BorderHelper.mergeThreeBorders(this.colorProvider, currentCell.cell, TableCellPropertiesMergerBorderBottom, null, null, true, tableBordersInfo.bottomBorder, table.style, v => v);
        return BorderHelper.mergeThreeBorders(this.colorProvider, currentCell.cell, TableCellPropertiesMergerBorderBottom, sibling.cell, TableCellPropertiesMergerBorderTop, false, tableBordersInfo.horizontalBorder, table.style, v => v);
    }
}
export class ToggleSingleTableCellsBorderCommand extends ToggleTableCellsBorderCommandBase {
    getGeneralizedBorder() {
        let actualBorder = null;
        let tableInfo = this.selection.tableInfo;
        let table = tableInfo.table;
        let tableBordersInfo = new TableBorderInfoProvider(this.control.modelManager.model, table, v => v);
        let grid = this.createCellBorderGrid(table, tableInfo, tableBordersInfo);
        for (let i = 0, gridRow; gridRow = grid[i]; i++) {
            for (let j = 0, gridCell; gridCell = gridRow[j]; j++) {
                if (!gridCell.cell || gridCell.cell.verticalMerging === TableCellMergingState.Continue || gridCell.info === TableBorderGridCellInfo.None)
                    continue;
                if (!(gridCell.info & this.affectOnStateFlags))
                    continue;
                if (!actualBorder) {
                    actualBorder = this.getActualCellBorder(table, grid, gridCell, i, j, tableBordersInfo);
                    continue;
                }
                if (!actualBorder.equals(this.getActualCellBorder(table, grid, gridCell, i, j, tableBordersInfo)))
                    return null;
            }
        }
        return actualBorder;
    }
}
export class ToggleTableCellsTopBorderCommand extends ToggleSingleTableCellsBorderCommand {
    constructor() {
        super(...arguments);
        this.affectOnStateFlags = TableBorderGridCellInfo.TopOuter;
        this.affectInner = false;
    }
    getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return this.getActualTopBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex);
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return patternBorder.equals(this.getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderTop().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        if (!borderInfo) {
            borderInfo = table.properties.borders.topBorder.clone();
            borderInfo.width = 0;
        }
        else
            borderInfo = borderInfo.clone();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [borderInfo, undefined, undefined, undefined, undefined, undefined], [true, undefined, undefined, undefined, undefined, undefined]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        if (gridCell.info & TableBorderGridCellInfo.TopOuter) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.topBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [borderInfo, undefined, undefined, undefined, undefined, undefined], [true, undefined, undefined, undefined, undefined, undefined]));
        }
        if (gridCell.info & TableBorderGridCellInfo.TopNeighbour) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.bottomBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [undefined, undefined, borderInfo, undefined, undefined, undefined], [undefined, undefined, true, undefined, undefined, undefined]));
        }
    }
}
export class ToggleTableCellsRightBorderCommand extends ToggleSingleTableCellsBorderCommand {
    constructor() {
        super(...arguments);
        this.affectInner = false;
        this.affectOnStateFlags = TableBorderGridCellInfo.RightOuter;
    }
    getActualCellBorder(table, _grid, _currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return this.getActualRightBorder(tableBordersInfo, table, rowIndex, columnIndex);
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return patternBorder.equals(this.getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderRight().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        if (!borderInfo) {
            borderInfo = table.properties.borders.rightBorder.clone();
            borderInfo.width = 0;
        }
        else
            borderInfo = borderInfo.clone();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [undefined, borderInfo, undefined, undefined, undefined, undefined], [undefined, true, undefined, undefined, undefined, undefined]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        if (gridCell.info & TableBorderGridCellInfo.RightOuter) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.rightBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [undefined, borderInfo, undefined, undefined, undefined, undefined], [undefined, true, undefined, undefined, undefined, undefined]));
        }
        if (gridCell.info & TableBorderGridCellInfo.RightNeighbour) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.leftBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [undefined, undefined, undefined, borderInfo, undefined, undefined], [undefined, undefined, undefined, true, undefined, undefined]));
        }
    }
}
export class ToggleTableCellsBottomBorderCommand extends ToggleSingleTableCellsBorderCommand {
    constructor() {
        super(...arguments);
        this.affectInner = false;
        this.affectOnStateFlags = TableBorderGridCellInfo.BottomOuter;
    }
    getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return this.getActualBottomBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex);
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return patternBorder.equals(this.getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderBottom().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        if (!borderInfo) {
            borderInfo = table.properties.borders.bottomBorder.clone();
            borderInfo.width = 0;
        }
        else
            borderInfo = borderInfo.clone();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [undefined, undefined, borderInfo, undefined, undefined, undefined], [undefined, undefined, true, undefined, undefined, undefined]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        if (gridCell.info & TableBorderGridCellInfo.BottomOuter) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.bottomBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [undefined, undefined, borderInfo, undefined, undefined, undefined], [undefined, undefined, true, undefined, undefined, undefined]));
        }
        if (gridCell.info & TableBorderGridCellInfo.BottomNeighbour) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.topBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [borderInfo, undefined, undefined, undefined, undefined, undefined], [true, undefined, undefined, undefined, undefined, undefined]));
        }
    }
}
export class ToggleTableCellsLeftBorderCommand extends ToggleSingleTableCellsBorderCommand {
    constructor() {
        super(...arguments);
        this.affectInner = false;
        this.affectOnStateFlags = TableBorderGridCellInfo.LeftOuter;
    }
    getActualCellBorder(table, _grid, _currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return this.getActualLeftBorder(tableBordersInfo, table, rowIndex, columnIndex);
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return patternBorder.equals(this.getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderLeft().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        if (!borderInfo) {
            borderInfo = table.properties.borders.leftBorder.clone();
            borderInfo.width = 0;
        }
        else
            borderInfo = borderInfo.clone();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [undefined, undefined, undefined, borderInfo, undefined, undefined], [undefined, undefined, undefined, true, undefined, undefined]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        if (gridCell.info & TableBorderGridCellInfo.LeftOuter) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.leftBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [undefined, undefined, undefined, borderInfo, undefined, undefined], [undefined, undefined, undefined, true, undefined, undefined]));
        }
        if (gridCell.info & TableBorderGridCellInfo.LeftNeighbour) {
            if (!borderInfo) {
                borderInfo = gridCell.cell.properties.borders.rightBorder.clone();
                borderInfo.width = 0;
            }
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [undefined, borderInfo, undefined, undefined, undefined, undefined], [undefined, true, undefined, undefined, undefined, undefined]));
        }
    }
}
export class ToggleTableCellAllBordersCommand extends ToggleTableCellsBorderCommandBase {
    constructor() {
        super(...arguments);
        this.affectOnStateFlags = TableBorderGridCellInfo.BottomInner | TableBorderGridCellInfo.BottomOuter | TableBorderGridCellInfo.LeftInner |
            TableBorderGridCellInfo.LeftOuter | TableBorderGridCellInfo.RightInner | TableBorderGridCellInfo.RightOuter |
            TableBorderGridCellInfo.TopInner | TableBorderGridCellInfo.TopOuter;
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return patternBorder.equals(this.getActualTopBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex)) &&
            patternBorder.equals(this.getActualBottomBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex)) &&
            patternBorder.equals(this.getActualLeftBorder(tableBordersInfo, table, rowIndex, columnIndex)) &&
            patternBorder.equals(this.getActualRightBorder(tableBordersInfo, table, rowIndex, columnIndex));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderTop().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderRight().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderBottom().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderLeft().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderHorizontal().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderVertical().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        borderInfo = borderInfo || new BorderInfo();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [
            borderInfo.clone(), borderInfo.clone(), borderInfo.clone(), borderInfo.clone(), borderInfo.clone(), borderInfo.clone()
        ], [true, true, true, true, true, true]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        let topBorder, rightBorder, bottomBorder, leftBorder;
        if (gridCell.info & TableBorderGridCellInfo.TopOuter || gridCell.info & TableBorderGridCellInfo.TopInner || gridCell.info & TableBorderGridCellInfo.BottomNeighbour)
            topBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.RightOuter || gridCell.info & TableBorderGridCellInfo.RightInner || gridCell.info & TableBorderGridCellInfo.LeftNeighbour)
            rightBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.BottomOuter || gridCell.info & TableBorderGridCellInfo.BottomInner || gridCell.info & TableBorderGridCellInfo.TopNeighbour)
            bottomBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.LeftOuter || gridCell.info & TableBorderGridCellInfo.LeftInner || gridCell.info & TableBorderGridCellInfo.RightNeighbour)
            leftBorder = true;
        borderInfo = borderInfo || new BorderInfo();
        if (topBorder || rightBorder || bottomBorder || leftBorder) {
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [topBorder ? borderInfo.clone() : undefined, rightBorder ? borderInfo.clone() : undefined, bottomBorder ? borderInfo.clone() : undefined, leftBorder ? borderInfo.clone() : undefined, undefined, undefined], [topBorder, rightBorder, bottomBorder, leftBorder, undefined, undefined]));
        }
    }
}
export class ToggleTableCellNoBorderCommand extends ToggleTableCellAllBordersCommand {
    isChecked(_tableInfo) {
        return false;
    }
    applyBorderToTable(subDocument, table, _borderInfo) {
        super.applyBorderToTable(subDocument, table, new BorderInfo());
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, _borderInfo) {
        super.applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, new BorderInfo());
    }
}
export class ToggleTableCellInsideBordersCommand extends ToggleTableCellsBorderCommandBase {
    constructor() {
        super(...arguments);
        this.affectOuter = false;
        this.affectNeighbours = false;
        this.affectOnStateFlags = TableBorderGridCellInfo.BottomInner | TableBorderGridCellInfo.LeftInner | TableBorderGridCellInfo.RightInner | TableBorderGridCellInfo.TopInner;
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        if (currentCell.info & TableBorderGridCellInfo.TopInner)
            return patternBorder.equals(this.getActualTopBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex));
        if (currentCell.info & TableBorderGridCellInfo.RightInner)
            return patternBorder.equals(this.getActualRightBorder(tableBordersInfo, table, rowIndex, columnIndex));
        if (currentCell.info & TableBorderGridCellInfo.BottomInner)
            return patternBorder.equals(this.getActualBottomBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex));
        if (currentCell.info & TableBorderGridCellInfo.LeftInner)
            return patternBorder.equals(this.getActualLeftBorder(tableBordersInfo, table, rowIndex, columnIndex));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderHorizontal().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderVertical().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        borderInfo = borderInfo || new BorderInfo();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [
            undefined, undefined, undefined, undefined, borderInfo.clone(), borderInfo.clone()
        ], [undefined, undefined, undefined, undefined, true, true]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        let topBorder, rightBorder, bottomBorder, leftBorder;
        if (gridCell.info & TableBorderGridCellInfo.TopInner)
            topBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.RightInner)
            rightBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.BottomInner)
            bottomBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.LeftInner)
            leftBorder = true;
        borderInfo = borderInfo || new BorderInfo();
        if (topBorder || rightBorder || bottomBorder || leftBorder) {
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [topBorder ? borderInfo.clone() : undefined, rightBorder ? borderInfo.clone() : undefined, bottomBorder ? borderInfo.clone() : undefined, leftBorder ? borderInfo.clone() : undefined, undefined, undefined], [topBorder, rightBorder, bottomBorder, leftBorder, undefined, undefined]));
        }
    }
}
export class ToggleTableCellInsideHorizontalBordersCommand extends ToggleSingleTableCellsBorderCommand {
    constructor() {
        super(...arguments);
        this.affectOuter = false;
        this.affectNeighbours = false;
        this.affectOnStateFlags = TableBorderGridCellInfo.BottomInner | TableBorderGridCellInfo.TopInner;
    }
    getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        let border1, border2;
        if (currentCell.info & TableBorderGridCellInfo.TopInner)
            border1 = this.getActualTopBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex);
        if (currentCell.info & TableBorderGridCellInfo.BottomInner)
            border2 = this.getActualBottomBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex);
        if (border1 && border2)
            return border1.equals(border2) ? border1 : null;
        return border1 || border2;
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return patternBorder.equals(this.getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderHorizontal().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        borderInfo = borderInfo || new BorderInfo();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [
            undefined, undefined, undefined, undefined, borderInfo.clone(), undefined
        ], [undefined, undefined, undefined, undefined, true, undefined]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        let topBorder, bottomBorder;
        if (gridCell.info & TableBorderGridCellInfo.TopInner)
            topBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.BottomInner)
            bottomBorder = true;
        borderInfo = borderInfo || new BorderInfo();
        if (topBorder || bottomBorder) {
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [topBorder ? borderInfo.clone() : undefined, undefined, bottomBorder ? borderInfo.clone() : undefined, undefined, undefined, undefined], [topBorder, undefined, bottomBorder, undefined, undefined, undefined]));
        }
    }
}
export class ToggleTableCellInsideVerticalBordersCommand extends ToggleSingleTableCellsBorderCommand {
    constructor() {
        super(...arguments);
        this.affectOuter = false;
        this.affectNeighbours = false;
        this.affectOnStateFlags = TableBorderGridCellInfo.LeftInner | TableBorderGridCellInfo.RightInner;
    }
    getActualCellBorder(table, _grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        let border1, border2;
        if (currentCell.info & TableBorderGridCellInfo.LeftInner)
            border1 = this.getActualLeftBorder(tableBordersInfo, table, rowIndex, columnIndex);
        if (currentCell.info & TableBorderGridCellInfo.RightInner)
            border2 = this.getActualRightBorder(tableBordersInfo, table, rowIndex, columnIndex);
        if (border1 && border2)
            return border1.equals(border2) ? border1 : null;
        return border1 || border2;
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        return patternBorder.equals(this.getActualCellBorder(table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo));
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderVertical().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        borderInfo = borderInfo || new BorderInfo();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [
            undefined, undefined, undefined, undefined, undefined, borderInfo.clone()
        ], [undefined, undefined, undefined, undefined, undefined, true]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        let leftBorder, rightBorder;
        if (gridCell.info & TableBorderGridCellInfo.LeftInner)
            leftBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.RightInner)
            rightBorder = true;
        borderInfo = borderInfo || new BorderInfo();
        if (rightBorder || leftBorder) {
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [undefined, rightBorder ? borderInfo.clone() : undefined, undefined, leftBorder ? borderInfo.clone() : undefined, undefined, undefined], [undefined, rightBorder, undefined, leftBorder, undefined, undefined]));
        }
    }
}
export class ToggleTableCellOutsideBordersCommand extends ToggleTableCellsBorderCommandBase {
    constructor() {
        super(...arguments);
        this.affectInner = false;
        this.affectOnStateFlags = TableBorderGridCellInfo.LeftOuter | TableBorderGridCellInfo.RightOuter | TableBorderGridCellInfo.TopOuter | TableBorderGridCellInfo.BottomOuter;
    }
    checkBorderInParticallyTableSelection(patternBorder, table, grid, currentCell, rowIndex, columnIndex, tableBordersInfo) {
        if (currentCell.info & TableBorderGridCellInfo.TopOuter && !patternBorder.equals(this.getActualTopBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex)))
            return false;
        if (currentCell.info & TableBorderGridCellInfo.RightOuter && !patternBorder.equals(this.getActualRightBorder(tableBordersInfo, table, rowIndex, columnIndex)))
            return false;
        if (currentCell.info & TableBorderGridCellInfo.BottomOuter && !patternBorder.equals(this.getActualBottomBorder(grid, currentCell, tableBordersInfo, table, rowIndex, columnIndex)))
            return false;
        if (currentCell.info & TableBorderGridCellInfo.LeftOuter && !patternBorder.equals(this.getActualLeftBorder(tableBordersInfo, table, rowIndex, columnIndex)))
            return false;
        return true;
    }
    checkBorderInEntireTable(patternBorder, table) {
        return patternBorder.equals(new TablePropertiesMergerBorderTop().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderRight().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderBottom().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties)) &&
            patternBorder.equals(new TablePropertiesMergerBorderLeft().getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, this.control.modelManager.model.defaultTableProperties));
    }
    applyBorderToTable(subDocument, table, borderInfo) {
        borderInfo = borderInfo || new BorderInfo();
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [
            borderInfo.clone(), borderInfo.clone(), borderInfo.clone(), borderInfo.clone(), undefined, undefined
        ], [true, true, true, true, undefined, undefined]));
    }
    applyBorderToCell(subDocument, table, gridCell, rowIndex, cellIndex, borderInfo) {
        let topBorder, rightBorder, bottomBorder, leftBorder;
        if (gridCell.info & TableBorderGridCellInfo.TopOuter || gridCell.info & TableBorderGridCellInfo.BottomNeighbour)
            topBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.RightOuter || gridCell.info & TableBorderGridCellInfo.LeftNeighbour)
            rightBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.BottomOuter || gridCell.info & TableBorderGridCellInfo.TopNeighbour)
            bottomBorder = true;
        if (gridCell.info & TableBorderGridCellInfo.LeftOuter || gridCell.info & TableBorderGridCellInfo.RightNeighbour)
            leftBorder = true;
        borderInfo = borderInfo || new BorderInfo();
        if (topBorder || rightBorder || bottomBorder || leftBorder) {
            this.history.addAndRedo(new TableCellBordersHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, [topBorder ? borderInfo.clone() : undefined, rightBorder ? borderInfo.clone() : undefined, bottomBorder ? borderInfo.clone() : undefined, leftBorder ? borderInfo.clone() : undefined, undefined, undefined], [topBorder, rightBorder, bottomBorder, leftBorder, undefined, undefined]));
        }
    }
}
export var TableBorderGridCellInfo;
(function (TableBorderGridCellInfo) {
    TableBorderGridCellInfo[TableBorderGridCellInfo["None"] = 0] = "None";
    TableBorderGridCellInfo[TableBorderGridCellInfo["LeftOuter"] = 1] = "LeftOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["RightOuter"] = 2] = "RightOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["BottomOuter"] = 4] = "BottomOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["TopOuter"] = 8] = "TopOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["RightNeighbour"] = 16] = "RightNeighbour";
    TableBorderGridCellInfo[TableBorderGridCellInfo["TopNeighbour"] = 32] = "TopNeighbour";
    TableBorderGridCellInfo[TableBorderGridCellInfo["LeftNeighbour"] = 64] = "LeftNeighbour";
    TableBorderGridCellInfo[TableBorderGridCellInfo["BottomNeighbour"] = 128] = "BottomNeighbour";
    TableBorderGridCellInfo[TableBorderGridCellInfo["RightInner"] = 256] = "RightInner";
    TableBorderGridCellInfo[TableBorderGridCellInfo["TopInner"] = 512] = "TopInner";
    TableBorderGridCellInfo[TableBorderGridCellInfo["LeftInner"] = 1024] = "LeftInner";
    TableBorderGridCellInfo[TableBorderGridCellInfo["BottomInner"] = 2048] = "BottomInner";
    TableBorderGridCellInfo[TableBorderGridCellInfo["LeftTableOuter"] = 4096] = "LeftTableOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["RightTableOuter"] = 8192] = "RightTableOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["TopTableOuter"] = 16384] = "TopTableOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["BottomTableOuter"] = 32768] = "BottomTableOuter";
    TableBorderGridCellInfo[TableBorderGridCellInfo["All"] = -1] = "All";
})(TableBorderGridCellInfo || (TableBorderGridCellInfo = {}));
