import { InsertParagraphHistoryItem } from '../../../core/model/history/items/insert-paragraph-history-item';
import { SplitTableCellToTheLeftHistoryItem, SplitTableCellToTheRightHistoryItem } from '../../../core/model/history/items/tables/split-table-cell-history-item';
import { TableCellPreferredWidthHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { InsertParagraphManipulatorParams } from '../../../core/model/manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { ControlOptions } from '../../../core/model/options/control';
import { SubDocumentPosition } from '../../../core/model/sub-document';
import { TableCellUtils, TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { Constants } from '@devexpress/utils/lib/constants';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class InsertTableColumnCommandBase extends TableCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) && this.selection.tableInfo.extendedData.isSquare;
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        let patternCell = this.getPatternCell();
        let columnIndex = this.getColumnIndex(patternCell);
        let table = patternCell.parentRow.parentTable;
        let columnCellIndices = this.getColumnCellIndices(table, columnIndex);
        let columnCount = this.getInsertedColumnCount();
        let newCells = [];
        let subDocument = options.subDocument;
        for (let i = 0; i < columnCount; i++) {
            for (let rowIndex = columnCellIndices.length - 1; rowIndex >= 0; rowIndex--) {
                newCells.push(this.splitTableCellCore(subDocument, table, rowIndex, columnCellIndices[rowIndex], patternCell));
            }
        }
        this.modelManipulator.table.normalizeTableGrid(subDocument, table);
        this.modelManipulator.table.normalizeCellColumnSpans(subDocument, table, false);
        this.modelManipulator.table.normalizeTableCellWidth(subDocument, table);
        let newCellIntervals = [];
        for (let i = 0, newCell; newCell = newCells[i]; i++)
            newCellIntervals.push(newCell.interval);
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, subDocument);
        this.history.endTransaction();
        return true;
    }
    getInsertedColumnCount() {
        return ListUtils.accumulate(this.selection.tableInfo.extendedData.rows, Constants.MAX_SAFE_INTEGER, (acc, rowInfo) => Math.min(acc, rowInfo.columnCountInSeries));
    }
    getColumnCellIndices(table, columnIndex) {
        return ListUtils.map(table.rows, currentRow => this.getCurrentCellIndex(columnIndex, currentRow));
    }
    insertParagraphToTheLeft(subDocument, currentCell) {
        let sourceRun = subDocument.getRunByPosition(currentCell.startParagraphPosition.value);
        let sourceParagraph = subDocument.getParagraphByPosition(currentCell.startParagraphPosition.value);
        this.history.addAndRedo(new InsertParagraphHistoryItem(this.modelManipulator, new InsertParagraphManipulatorParams(new SubDocumentPosition(subDocument, currentCell.startParagraphPosition.value), sourceRun.getCharPropsBundle(this.modelManipulator.model), sourceParagraph.getParagraphBundleFull(this.modelManipulator.model))));
    }
    insertParagraphToTheRight(subDocument, currentCell) {
        let sourceRun = subDocument.getRunByPosition(currentCell.endParagrapPosition.value - 1);
        let sourceParagraph = subDocument.getParagraphByPosition(currentCell.endParagrapPosition.value - 1);
        this.history.addAndRedo(new InsertParagraphHistoryItem(this.modelManipulator, new InsertParagraphManipulatorParams(new SubDocumentPosition(subDocument, currentCell.endParagrapPosition.value - 1), sourceRun.getCharPropsBundle(this.modelManipulator.model), sourceParagraph.getParagraphBundleFull(this.modelManipulator.model))));
    }
}
export class InsertTableColumnToTheLeftCommand extends InsertTableColumnCommandBase {
    splitTableCellCore(subDocument, table, rowIndex, cellIndex, patternCell) {
        if (cellIndex < 0)
            cellIndex = table.rows[rowIndex].cells.length - 1;
        this.insertParagraphToTheLeft(subDocument, table.rows[rowIndex].cells[cellIndex]);
        this.history.addAndRedo(new SplitTableCellToTheLeftHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, true));
        this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, patternCell.preferredWidth.clone()));
        return table.rows[rowIndex].cells[cellIndex];
    }
    getPatternCell() {
        return this.selection.tableInfo.extendedData.firstCell;
    }
    getColumnIndex(patternCell) {
        return TableCellUtils.getStartColumnIndex(patternCell);
    }
    getCurrentCellIndex(relativeColumnIndex, currentRow) {
        return TableCellUtils.getCellIndexByColumnIndex(currentRow, relativeColumnIndex);
    }
}
export class InsertTableColumnToTheRightCommand extends InsertTableColumnCommandBase {
    splitTableCellCore(subDocument, table, rowIndex, cellIndex, patternCell) {
        if (cellIndex < 0) {
            this.insertParagraphToTheLeft(subDocument, table.rows[rowIndex].cells[0]);
            this.history.addAndRedo(new SplitTableCellToTheLeftHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, 0, true));
        }
        else {
            this.insertParagraphToTheRight(subDocument, table.rows[rowIndex].cells[cellIndex]);
            this.history.addAndRedo(new SplitTableCellToTheRightHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, true));
        }
        this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, Math.max(0, cellIndex), patternCell.preferredWidth.clone()));
        return table.rows[rowIndex].cells[cellIndex + 1];
    }
    getPatternCell() {
        return ListUtils.last(ListUtils.last(this.selection.tableInfo.extendedData.rows).cells).cell;
    }
    getColumnIndex(patternCell) {
        return TableCellUtils.getStartColumnIndex(patternCell) + patternCell.columnSpan - 1;
    }
    getCurrentCellIndex(relativeColumnIndex, currentRow) {
        return TableCellUtils.getCellIndexByEndColumnIndex(currentRow, relativeColumnIndex);
    }
}
