import { ControlOptions } from '../../../core/model/options/control';
import { TableCellMergingState } from '../../../core/model/tables/secondary-structures/table-base-structures';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertTableCellWithShiftToTheHorizontallyCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) && this.selection.tableInfo.extendedData.numRows > 0;
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        const tblInfo = this.selection.tableInfo;
        const table = tblInfo.table;
        const subDocument = options.subDocument;
        const newCells = [];
        tblInfo.extendedData.foreach(() => { }, (cellInfo, rowInfo) => {
            if (cellInfo.cell.verticalMerging !== TableCellMergingState.Continue)
                newCells.push(this.insertTableCell(subDocument, table, rowInfo.rowIndex, cellInfo.cellIndex));
        });
        this.modelManipulator.table.normalizeVerticalSpans(subDocument, table);
        const newCellIntervals = [];
        for (let i = 0, newCell; newCell = newCells[i]; i++)
            newCellIntervals.push(newCell.interval);
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, table, subDocument);
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setIntervals(newCellIntervals).setEndOfLine(false)));
        this.history.endTransaction();
        return true;
    }
}
export class InsertTableCellWithShiftToTheLeftCommand extends InsertTableCellWithShiftToTheHorizontallyCommandBase {
    insertTableCell(subDocument, table, rowIndex, cellIndex) {
        this.modelManipulator.table.insertCellToTheLeft(subDocument, table, rowIndex, cellIndex, this.inputPosition);
        return table.rows[rowIndex].cells[cellIndex];
    }
}
