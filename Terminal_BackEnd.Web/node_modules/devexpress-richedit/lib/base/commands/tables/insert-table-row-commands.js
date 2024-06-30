import { ControlOptions } from '../../../core/model/options/control';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { SimpleCommandState } from '../command-states';
import { RowCommandBase } from './row-command-base';
export class InsertTableRowCommandBase extends RowCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) &&
            this.selection.tableInfo.isSelected && this.selection.tableInfo.rawData.withoutGapByRows;
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        const subDocument = options.subDocument;
        const tableInfo = this.selection.tableInfo;
        const table = tableInfo.table;
        const rowCount = tableInfo.rawData.numRows;
        const patternRowIndex = this.getPatternRowIndex(tableInfo);
        const newRows = ListUtils.initByCallback(rowCount, (rowOffset) => this.insertTableRowCore(subDocument, table, patternRowIndex + rowOffset));
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(FixedInterval.fromPositions(newRows[0].getStartPosition(), ListUtils.last(newRows).getEndPosition())).setEndOfLine(false)));
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, subDocument);
        this.history.endTransaction();
        return true;
    }
}
export class InsertTableRowAboveCommand extends InsertTableRowCommandBase {
    insertTableRowCore(subDocument, table, patternRowIndex) {
        this.modelManipulator.table.insertRowAbove(subDocument, table, patternRowIndex);
        return table.rows[patternRowIndex];
    }
    getPatternRowIndex(tableInfo) {
        return tableInfo.rawData.rows[0].rowIndex;
    }
}
export class InsertTableRowBelowCommand extends InsertTableRowCommandBase {
    insertTableRowCore(subDocument, table, patternRowIndex) {
        this.modelManipulator.table.insertRowBelow(subDocument, table, patternRowIndex);
        return table.rows[patternRowIndex + 1];
    }
    getPatternRowIndex(tableInfo) {
        return tableInfo.rawData.lastRowInfo.rowIndex;
    }
}
