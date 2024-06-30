import { DeleteOneTableCellWithShiftToTheUpOperation } from '../../../core/model/manipulators/tables/merge-table-cells-operation';
import { ControlOptions } from '../../../core/model/options/control';
import { TablePosition } from '../../../core/model/tables/main-structures/table';
import { TableCellUtils, TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SimpleCommandState } from '../command-states';
import { TableCommandBase } from './table-command-base';
export class DeleteTableCellsWithShiftToTheVerticallyCommand extends TableCommandBase {
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
        const subDocument = options.subDocument;
        const tableInfo = this.selection.tableInfo;
        const table = tableInfo.table;
        if (tableInfo.extendedData.isSelectedEntireTable) {
            this.modelManipulator.table.removeTableWithContent(subDocument, table);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(table.getStartPosition()).setEndOfLine(false)));
        }
        else {
            const startPosition = tableInfo.rawData.firstCell.startParagraphPosition.value;
            ListUtils.reverseForEach(tableInfo.rawData.rows, (rowInfo) => {
                for (let cellInfo of rowInfo.cells)
                    this.removeTableCell(subDocument, table, rowInfo.rowIndex, cellInfo.cellIndex);
            });
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(startPosition).setEndOfLine(false)));
            TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, options.subDocument);
        }
        this.history.endTransaction();
        return true;
    }
    removeTableCell(subDocument, table, rowIndex, cellIndex) {
        const columnIndex = TableCellUtils.getStartColumnIndex(table.rows[rowIndex].cells[cellIndex]);
        const rowsCount = table.rows.length;
        for (let i = rowIndex; i < rowsCount; i++) {
            let cellIndex = TableCellUtils.getCellIndexByColumnIndex(table.rows[rowIndex], columnIndex);
            if (table.rows[i].cells[cellIndex])
                new DeleteOneTableCellWithShiftToTheUpOperation(this.control.modelManager, subDocument)
                    .execute(TablePosition.createAndInit(table, i, cellIndex), false, this.inputPosition);
        }
    }
}
