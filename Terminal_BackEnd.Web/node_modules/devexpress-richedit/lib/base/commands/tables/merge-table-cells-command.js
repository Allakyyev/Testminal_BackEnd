import { ControlOptions } from '../../../core/model/options/control';
import { TablePosition } from '../../../core/model/tables/main-structures/table';
import { TableConditionalFormattingCalculator } from '../../../core/model/tables/table-utils';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class MergeTableCellsCommand extends CommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        state.visible = this.selection.tableInfo.extendedData.numRows > 0 && !this.selection.specialRunInfo.isPictureSelected();
        return state;
    }
    isEnabled() {
        const data = this.selection.tableInfo.extendedData;
        return ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables) &&
            data.isSquare && (data.numRows > 1 || data.rows[0].cells.length > 1) && super.isEnabled();
    }
    executeCore(_state, options) {
        this.history.beginTransaction();
        const tblInfo = this.selection.tableInfo;
        const subDocument = options.subDocument;
        this.mergeCellsHorizontally(subDocument, tblInfo);
        this.mergeCellsVertically(subDocument, tblInfo);
        this.modelManipulator.table.normalizeRows(subDocument, tblInfo.table);
        this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(tblInfo.extendedData.firstCell.interval).setEndOfLine(false)));
        TableConditionalFormattingCalculator.updateTable(this.control.modelManager, tblInfo.table, options.subDocument);
        this.history.endTransaction();
        return true;
    }
    getIntervalsForModifying() {
        if (this.control.isClientMode())
            return super.getIntervalsForModifying();
        else {
            const table = this.selection.tableInfo.table;
            return [FixedInterval.fromPositions(table.getStartPosition(), table.getEndPosition())];
        }
    }
    mergeCellsHorizontally(subDocument, tblInfo) {
        tblInfo.extendedData.foreach((rowInfo) => {
            const modelCellInterval = new BoundaryInterval(rowInfo.cells[0].cellIndex, ListUtils.last(rowInfo.cells).cellIndex + 1);
            for (let modelCellInd = modelCellInterval.end - 2; modelCellInd >= modelCellInterval.start; modelCellInd--)
                this.modelManipulator.table.mergeTwoTableCellsHorizontally(subDocument, new TablePosition(tblInfo.table, rowInfo.rowIndex, modelCellInd).init(), this.inputPosition);
        }, () => { });
    }
    mergeCellsVertically(subDocument, tblInfo) {
        ListUtils.reverseForEach(tblInfo.extendedData.rows, (rowInfo) => {
            this.modelManipulator.table.mergeTwoTableCellsVertically(subDocument, new TablePosition(tblInfo.table, rowInfo.rowIndex, rowInfo.cells[0].cellIndex).init(), this.inputPosition);
        }, tblInfo.extendedData.numRows - 2);
    }
}
