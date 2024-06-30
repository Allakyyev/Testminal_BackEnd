import { TableCellColumnSpanHistoryItem, TableCellPreferredWidthHistoryItem, TableCellVerticalMergingHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { TableRowGridAfterHistoryItem, TableRowGridBeforeHistoryItem, TableRowHeightHistoryItem } from '../../../core/model/history/items/tables/table-row-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { TablePosition } from '../../../core/model/tables/main-structures/table';
import { TableCellMergingState } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableHeightUnit, TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { TableCellUtils, TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { RichEditClientCommand } from '../client-command';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class SplitTableCellsCommand extends TableCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) && this.selection.tableInfo.extendedData.areCellsSelectedInSeries;
    }
    executeCore(_state, options) {
        const parameters = options.param;
        this.history.beginTransaction();
        const tableInfo = this.selection.tableInfo;
        let selectedCells = ListUtils.map(tableInfo.rawData.rows, (rowInfo) => ListUtils.map(rowInfo.cells, (cellInfo) => cellInfo.cell));
        let firstCell = tableInfo.extendedData.firstCell;
        if (parameters.isMergeBeforeSplit) {
            this.control.commandManager.getCommand(RichEditClientCommand.MergeTableCells).execute(this.control.commandManager.isPublicApiCall);
            selectedCells = this.filterRemovedCells(selectedCells);
        }
        this.splitTableCellsHorizontally(this.selection.activeSubDocument, selectedCells, parameters);
        this.splitTableCellsVertically(this.selection.activeSubDocument, selectedCells, parameters);
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(selectedCells[0][0].startParagraphPosition.value).setEndOfLine(false)));
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, firstCell.parentRow.parentTable, this.selection.activeSubDocument);
        this.history.endTransaction();
        return true;
    }
    splitTableCellsHorizontally(subDocument, selectedCells, parameters) {
        let startCell = selectedCells[0][0];
        let table = startCell.parentRow.parentTable;
        if (parameters.isMergeBeforeSplit) {
            let rowIndex = SearchUtils.normedInterpolationIndexOf(table.rows, r => r.getStartPosition(), startCell.startParagraphPosition.value);
            let cellIndex = SearchUtils.normedInterpolationIndexOf(table.rows[rowIndex].cells, c => c.startParagraphPosition.value, startCell.startParagraphPosition.value);
            this.splitTableCellsHorizontallyCore(subDocument, TablePosition.createAndInit(table, rowIndex, cellIndex), parameters.columnCount);
            return;
        }
        let topRowIndex = SearchUtils.normedInterpolationIndexOf(table.rows, r => r.getStartPosition(), startCell.startParagraphPosition.value);
        for (var i = selectedCells.length - 1; i >= 0; i--) {
            let rowIndex = i + topRowIndex;
            let row = table.rows[rowIndex];
            let startCellIndex = SearchUtils.normedInterpolationIndexOf(row.cells, c => c.startParagraphPosition.value, selectedCells[i][0].startParagraphPosition.value);
            for (let j = selectedCells[i].length - 1; j >= 0; j--) {
                let cellIndex = startCellIndex + j;
                let cell = row.cells[cellIndex];
                if (cell.verticalMerging === TableCellMergingState.Continue)
                    continue;
                this.splitTableCellsHorizontallyCore(subDocument, TablePosition.createAndInit(table, rowIndex, cellIndex), parameters.columnCount);
            }
        }
    }
    splitTableCellsVertically(subDocument, selectedCells, parameters) {
        if (parameters.rowCount === 1)
            return;
        let columnCount = this.getColumnsCountForSplitVertically(selectedCells[0], parameters);
        let startCell = selectedCells[0][0];
        let topRowIndex = SearchUtils.normedInterpolationIndexOf(startCell.parentRow.parentTable.rows, r => r.getStartPosition(), startCell.startParagraphPosition.value);
        let startCellIndex = SearchUtils.normedInterpolationIndexOf(startCell.parentRow.cells, c => c.startParagraphPosition.value, startCell.startParagraphPosition.value);
        this.splitTableCellsVerticallyCore(subDocument, TablePosition.createAndInit(startCell.parentRow.parentTable, topRowIndex, startCellIndex), parameters.rowCount, columnCount);
    }
    splitTableCellsVerticallyCore(subDocument, position, rowsCount, columnsCount) {
        if (position.cell.verticalMerging === TableCellMergingState.Restart) {
            this.splitMergedCellsVertically(subDocument, position, columnsCount, rowsCount);
            return;
        }
        let table = position.table;
        this.insertRows(subDocument, position, rowsCount);
        let startIndex = position.cellIndex;
        let endIndex = position.cellIndex + columnsCount - 1;
        for (let i = 0, cell; cell = position.row.cells[i]; i++) {
            if (i < startIndex || i > endIndex) {
                let columnIndex = TableCellUtils.getStartColumnIndex(cell);
                let mergeCellPosition = TableCellUtils.getVerticalSpanCellPositions(TablePosition.createAndInit(table, position.rowIndex, i), columnIndex)[0];
                let restartRowIndex = mergeCellPosition.rowIndex;
                let continionRowIndex = rowsCount + position.rowIndex - 2;
                for (let i = continionRowIndex; i >= restartRowIndex; i--) {
                    let row = table.rows[i];
                    let mergeCellIndex = TableCellUtils.getCellIndexByColumnIndex(row, columnIndex);
                    this.modelManipulator.table.mergeTwoTableCellsVertically(subDocument, TablePosition.createAndInit(table, i, mergeCellIndex), this.inputPosition);
                }
                this.modelManipulator.table.normalizeRows(subDocument, table);
            }
        }
    }
    insertRows(subDocument, position, rowsCount) {
        let rowHeight = position.row.height;
        this.history.addAndRedo(new TableRowHeightHistoryItem(this.modelManipulator, subDocument, position.table.index, position.rowIndex, TableHeightUnit.create(rowHeight.value / rowsCount, rowHeight.type)));
        for (let i = 1; i < rowsCount; i++) {
            this.modelManipulator.table.insertRowBelow(subDocument, position.table, position.rowIndex);
        }
    }
    splitMergedCellsVertically(subDocument, position, columnsCount, rowsCount) {
        let endIndex = position.cellIndex + columnsCount - 1;
        for (let cellIndex = position.cellIndex; cellIndex <= endIndex; cellIndex++) {
            this.splitMergedCellsVerticallyCore(subDocument, TablePosition.createAndInit(position.table, position.rowIndex, cellIndex), rowsCount);
        }
    }
    splitMergedCellsVerticallyCore(subDocument, position, rowsCount) {
        let columnIndex = TableCellUtils.getStartColumnIndex(position.cell);
        let mergedCellsPositions = TableCellUtils.getVerticalSpanCellPositions(position, columnIndex);
        if (mergedCellsPositions.length === rowsCount) {
            for (let i = 0, mergedCellsPosition; mergedCellsPosition = mergedCellsPositions[i]; i++) {
                this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, position.table.index, mergedCellsPosition.rowIndex, mergedCellsPosition.cellIndex, TableCellMergingState.None));
            }
            return;
        }
        let totalRowsCount = mergedCellsPositions.length / rowsCount;
        for (let i = 0, mergedCellsPosition; mergedCellsPosition = mergedCellsPositions[i]; i++) {
            if (i % totalRowsCount == 0)
                this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, position.table.index, mergedCellsPosition.rowIndex, mergedCellsPosition.cellIndex, TableCellMergingState.Restart));
        }
    }
    splitTableCellsHorizontallyCore(subDocument, position, columnsCount) {
        let columnIndex = TableCellUtils.getStartColumnIndex(position.cell);
        let verticalSpanPositions = TableCellUtils.getVerticalSpanCellPositions(position, columnIndex);
        let spanDelta = columnsCount - position.cell.columnSpan;
        let oldPatternCellWidth = position.cell.preferredWidth;
        if (oldPatternCellWidth.type !== TableWidthUnitType.Nil && oldPatternCellWidth.type !== TableWidthUnitType.Auto) {
            for (let i = verticalSpanPositions.length - 1; i >= 0; i--) {
                let cellPosition = verticalSpanPositions[i];
                let cellWidth = cellPosition.cell.preferredWidth;
                if (cellWidth.type !== TableWidthUnitType.Nil && cellWidth.type !== TableWidthUnitType.Auto)
                    this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, cellPosition.table.index, cellPosition.rowIndex, cellPosition.cellIndex, TableWidthUnit.create(cellWidth.value / columnsCount, cellWidth.type)));
                if (cellPosition.cell.columnSpan > 1)
                    this.history.addAndRedo(new TableCellColumnSpanHistoryItem(this.modelManipulator, subDocument, cellPosition.table.index, cellPosition.rowIndex, cellPosition.cellIndex, Math.max(1, cellPosition.cell.columnSpan - (columnsCount - 1))));
            }
        }
        for (let i = 1; i < columnsCount; i++)
            this.modelManipulator.table.insertCellToTheRight(subDocument, position.table, position.rowIndex, position.cellIndex, this.inputPosition, false, false);
        if (spanDelta > 0)
            this.normalizeColumnSpansAfterSplitHorizontally(subDocument, verticalSpanPositions, columnIndex, spanDelta);
    }
    normalizeColumnSpansAfterSplitHorizontally(subDocument, verticalSpanPositions, columnIndex, newColumnsCount) {
        let table = verticalSpanPositions[0].table;
        let startRowIndex = verticalSpanPositions[0].rowIndex;
        let endRowIndex = startRowIndex + verticalSpanPositions.length - 1;
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            if (rowIndex >= startRowIndex && rowIndex <= endRowIndex)
                continue;
            let cellIndex = TableCellUtils.getCellIndexByColumnIndex(row, columnIndex);
            let cell = row.cells[cellIndex];
            if (!cell) {
                if (row.gridBefore >= columnIndex)
                    this.history.addAndRedo(new TableRowGridBeforeHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, row.gridBefore + newColumnsCount));
                else
                    this.history.addAndRedo(new TableRowGridAfterHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, row.gridAfter + newColumnsCount));
            }
            else
                this.history.addAndRedo(new TableCellColumnSpanHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, cell.columnSpan + newColumnsCount));
        }
    }
    getColumnsCountForSplitVertically(selectedCells, parameters) {
        if (parameters.isMergeBeforeSplit)
            return parameters.columnCount;
        return selectedCells.length * parameters.columnCount;
    }
    filterRemovedCells(selectedCells) {
        let result = [];
        let table = selectedCells[0][0].parentRow.parentTable;
        for (let i = 0, horCells; horCells = selectedCells[i]; i++) {
            let row = horCells[0].parentRow;
            if (table.rows.indexOf(row) < 0)
                continue;
            result.push([horCells[0]]);
        }
        return result;
    }
}
