import { ControlOptions } from '../../../core/model/options/control';
import { TableCellMergingState } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class DeleteTableCellsWithShiftToTheHorizontallyCommand extends TableCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled()
            && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables)
            && this.selection.tableInfo.extendedData.isSquare;
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        const tableInfo = this.selection.tableInfo;
        const subDocument = options.subDocument;
        const table = tableInfo.table;
        if (tableInfo.extendedData.isSelectedEntireTable) {
            this.modelManipulator.table.removeTableWithContent(subDocument, table);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(table.getStartPosition()).setEndOfLine(false)));
        }
        else {
            let startPosition = tableInfo.extendedData.firstCell.startParagraphPosition.value;
            ListUtils.reverseForEach(tableInfo.extendedData.rows, (rowInfo) => {
                const row = table.rows[rowInfo.rowIndex];
                if (row.cells.length === rowInfo.cells.length)
                    this.deleteEntireRow(subDocument, table, rowInfo.rowIndex);
                else {
                    ListUtils.reverseForEach(rowInfo.cells, (cellInfo) => {
                        if (cellInfo.cell.verticalMerging != TableCellMergingState.Continue)
                            this.deleteTableCell(subDocument, table, rowInfo.rowIndex, cellInfo.cellIndex);
                    });
                }
            });
            this.modelManipulator.table.normalizeVerticalSpans(subDocument, table);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(startPosition).setEndOfLine(false)));
            TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, options.subDocument);
        }
        this.history.endTransaction();
        return true;
    }
    deleteEntireRow(subDocument, table, rowIndex) {
        this.modelManipulator.table.removeTableRowWithContent(subDocument, table, rowIndex);
        this.modelManipulator.table.normalizeCellColumnSpans(subDocument, table, true);
    }
    deleteTableCell(subDocument, table, rowIndex, cellIndex) {
        this.modelManipulator.table.removeTableCellWithContent(subDocument, table, rowIndex, cellIndex);
        this.modelManipulator.table.normalizeTableGrid(subDocument, table);
        this.modelManipulator.table.normalizeCellColumnSpans(subDocument, table, false);
    }
}
