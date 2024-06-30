import { TableCellPreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { InsertTableCellWithShiftToTheDownOperation } from '../../../core/model/manipulators/tables/merge-table-cells-operation';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { TablePosition } from '../../../core/model/tables/main-structures/table';
import { TableCellMergingState } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableCellUtils, TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertTableCellsWithShiftToTheVerticallyCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) && this.selection.tableInfo.extendedData.areCellsSelectedInSeries;
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        let tableInfo = this.selection.tableInfo;
        let table = tableInfo.table;
        let newCells = [];
        tableInfo.extendedData.foreach((rowInfo) => ListUtils.addListOnTail(newCells, this.insertTableCellWithShiftToTheVertically(this.selection.activeSubDocument, table, rowInfo)), () => { });
        let newCellIntervals = [];
        for (let i = 0, newCell; newCell = newCells[i]; i++)
            newCellIntervals.push(newCell.interval);
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, options.subDocument);
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals(newCellIntervals)));
        this.history.endTransaction();
        return true;
    }
    insertTableCellWithShiftToTheVertically(subDocument, table, rowInfo) {
        if (ListUtils.allOf(rowInfo.cells, (c) => c.cell.verticalMerging == TableCellMergingState.Continue))
            return [];
        let startCellIndex = rowInfo.cells[0].cellIndex;
        let endCellIndex = startCellIndex + rowInfo.cells.length - 1;
        let insertedRowsCount = this.calculateInsertedRowsCount(table, rowInfo.rowIndex, startCellIndex, endCellIndex);
        let newCells = [];
        for (let i = 0; i < insertedRowsCount; i++) {
            this.modelManipulator.table.insertRowBelow(subDocument, table, table.rows.length - 1);
            for (let cellIndex = endCellIndex; cellIndex >= startCellIndex; cellIndex--) {
                newCells = newCells.concat(this.insertCellWithShiftToTheDown(subDocument, table, rowInfo.rowIndex + i, cellIndex));
            }
        }
        this.deleteTextInCell(subDocument, table, rowInfo.rowIndex, insertedRowsCount);
        return newCells;
    }
    calculateInsertedRowsCount(table, rowIndex, startCellIndex, endCellIndex) {
        let row = table.rows[rowIndex];
        let result = Number.MAX_VALUE;
        for (let i = startCellIndex; i <= endCellIndex; i++) {
            let cell = row.cells[i];
            let columnIndex = TableCellUtils.getStartColumnIndex(cell);
            result = Math.min(result, TableCellUtils.getVerticalSpanCellPositions(TablePosition.createAndInit(table, rowIndex, i), columnIndex).length);
        }
        return result;
    }
    insertCellWithShiftToTheDown(subDocument, table, rowIndex, cellIndex) {
        let newCells = [];
        for (let i = table.rows.length - 1; i > rowIndex; i--) {
            let currentRow = table.rows[i];
            let cellsCountInCurrentRow = currentRow.cells.length;
            let previousRow = table.rows[i - 1];
            if (cellIndex >= previousRow.cells.length)
                continue;
            if (cellIndex >= cellsCountInCurrentRow) {
                let previousRowLastCell = previousRow.cells[previousRow.cells.length - 1];
                this.insertTableCells(subDocument, table, i, currentRow.cells.length - 1, cellIndex - cellsCountInCurrentRow + 1, previousRowLastCell.preferredWidth);
            }
            new InsertTableCellWithShiftToTheDownOperation(this.control.modelManager, subDocument).execute(TablePosition.createAndInit(table, i, cellIndex), false, this.inputPosition);
            newCells.push(table.rows[i].cells[cellIndex]);
        }
        this.deleteContentInCell(subDocument, table, rowIndex, cellIndex);
        this.modelManipulator.table.normalizeTableGrid(subDocument, table);
        this.modelManipulator.table.normalizeCellColumnSpans(subDocument, table, true);
        return newCells;
    }
    insertTableCells(subDocument, table, patternRowIndex, patternCellIndex, insertedCellsCount, preferredWidth) {
        for (let i = 0; i < insertedCellsCount; i++) {
            let lastCellIndex = patternCellIndex + i;
            this.modelManipulator.table.insertCellToTheRight(subDocument, table, patternRowIndex, lastCellIndex, this.inputPosition, false, true, false);
            this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, patternRowIndex, lastCellIndex + 1, preferredWidth.clone()));
        }
    }
    deleteTextInCell(subDocument, table, rowIndex, rowsCount) {
        let startRowIndex = rowIndex + 1;
        let endRowIndex = startRowIndex + rowsCount;
        for (let i = startRowIndex; i < endRowIndex; i++) {
            let row = table.rows[i];
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                if (cell.verticalMerging === TableCellMergingState.Continue)
                    this.deleteContentInCell(subDocument, table, i, cellIndex);
            }
        }
    }
    deleteContentInCell(subDocument, table, rowIndex, cellIndex) {
        let cell = table.rows[rowIndex].cells[cellIndex];
        if (cell.endParagrapPosition.value - cell.startParagraphPosition.value > 1)
            this.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, FixedInterval.fromPositions(cell.startParagraphPosition.value, cell.endParagrapPosition.value - 1)), true, false);
    }
}
