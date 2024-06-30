import { TableCellVerticalMergingHistoryItem } from '../../../core/model/history/items/tables/table-cell-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { TableCellMergingState } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableCellUtils, TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { TableUtilsEx } from '../../rich-utils/table-utils-ex';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class DeleteTableColumnsCommand extends TableCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled()
            && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables)
            && this.selection.tableInfo.rawData.isSquare;
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        const tableInfo = this.selection.tableInfo;
        const table = tableInfo.table;
        const subDocument = options.subDocument;
        if (tableInfo.rawData.firstRowInfo.cells.length == table.rows[tableInfo.rawData.firstRowInfo.rowIndex].cells.length) {
            this.modelManipulator.table.removeTableWithContent(subDocument, table);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(table.getStartPosition()).setEndOfLine(false)));
        }
        else {
            const startPosition = tableInfo.rawData.firstCell.startParagraphPosition.value;
            const columnsRange = TableUtilsEx.getColumnsRangeBySelectedCells(tableInfo.rawData);
            for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
                let cellIndices = TableCellUtils.getCellIndicesByColumnsRange(row, columnsRange);
                if (cellIndices.length === row.cells.length) {
                    this.modelManipulator.table.removeTableRowWithContent(subDocument, table, rowIndex);
                    rowIndex--;
                }
                else {
                    for (let i = cellIndices.length - 1; i >= 0; i--)
                        this.modelManipulator.table.removeTableCellWithContent(subDocument, table, rowIndex, cellIndices[i]);
                }
                this.modelManipulator.table.normalizeTableGrid(subDocument, table);
            }
            this.normalizeCellVerticalMerging(subDocument, table);
            this.modelManipulator.table.normalizeCellColumnSpans(subDocument, table, true);
            TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, options.subDocument);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(startPosition).setEndOfLine(false)));
        }
        this.history.endTransaction();
        return true;
    }
    normalizeCellVerticalMerging(subDocument, table) {
        for (let rowIndex = table.rows.length - 1, row; row = table.rows[rowIndex]; rowIndex--) {
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                if (cell.verticalMerging === TableCellMergingState.None)
                    continue;
                let columnIndex = TableCellUtils.getStartColumnIndex(cell);
                let nextRow = table.rows[rowIndex + 1];
                if (cell.verticalMerging === TableCellMergingState.Restart) {
                    if (rowIndex === table.rows.length - 1) {
                        this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                        continue;
                    }
                    let nextRowCell = nextRow.cells[TableCellUtils.getCellIndexByColumnIndex(nextRow, columnIndex)];
                    if (!nextRowCell || nextRowCell.verticalMerging !== TableCellMergingState.Continue)
                        this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                }
                else {
                    let prevRow = table.rows[rowIndex - 1];
                    let prevCell = prevRow ? prevRow.cells[TableCellUtils.getCellIndexByColumnIndex(prevRow, columnIndex)] : null;
                    let nextRow = table.rows[rowIndex + 1];
                    let nextCell = nextRow ? nextRow.cells[TableCellUtils.getCellIndexByColumnIndex(nextRow, columnIndex)] : null;
                    if (!prevCell || prevCell.verticalMerging === TableCellMergingState.None) {
                        if (!nextCell || nextCell.verticalMerging !== TableCellMergingState.Continue)
                            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                        else if (nextCell && nextCell.verticalMerging === TableCellMergingState.Continue)
                            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.Restart));
                    }
                }
            }
        }
    }
}
