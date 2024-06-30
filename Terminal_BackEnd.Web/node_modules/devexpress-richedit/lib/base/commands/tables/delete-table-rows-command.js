import { ControlOptions } from '../../../core/model/options/control';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SimpleCommandState } from '../command-states';
import { RowCommandBase } from './row-command-base';
export class DeleteTableRowsCommand extends RowCommandBase {
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
        const subDocument = options.subDocument;
        const table = tableInfo.table;
        if (tableInfo.rawData.numRows === table.rows.length) {
            this.modelManipulator.table.removeTableWithContent(subDocument, table);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(table.getStartPosition()).setEndOfLine(false)));
        }
        else {
            const startPosition = tableInfo.rawData.firstCell.startParagraphPosition.value;
            ListUtils.reverseForEach(tableInfo.rawData.rows, (rowInfo) => this.modelManipulator.table.removeTableRowWithContent(subDocument, table, rowInfo.rowIndex));
            this.modelManipulator.table.normalizeCellColumnSpans(subDocument, table, true);
            TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, options.subDocument);
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setPosition(startPosition).setEndOfLine(false)));
        }
        this.history.endTransaction();
        return true;
    }
}
