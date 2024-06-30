import { SplitTableCellToTheLeftHistoryItem, SplitTableCellToTheRightHistoryItem } from '../../history/items/tables/split-table-cell-history-item';
import { TableCellVerticalMergingHistoryItem } from '../../history/items/tables/table-cell-properties-history-items';
import { TableRowGridAfterHistoryItem } from '../../history/items/tables/table-row-properties-history-items';
import { SubDocumentPosition } from '../../sub-document';
import { Table, TablePosition } from '../../tables/main-structures/table';
import { TableCellMergingState } from '../../tables/secondary-structures/table-base-structures';
import { TableCellUtils } from '../../tables/table-utils';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
export class InsertTableCellOperationBase {
    constructor(modelManager, subDocument) {
        this.subDocument = subDocument;
        this.modelManager = modelManager;
    }
    get modelManipulator() { return this.modelManager.modelManipulator; }
    execute(table, rowIndex, cellIndex, canNormalizeTable, canNormalizeVerticalMerging, canCopyProperties, inpPos) {
        let row = table.rows[rowIndex];
        let cell = row.cells[cellIndex];
        let patternCellStartColumnIndex = TableCellUtils.getStartColumnIndex(cell);
        let restartCellPosition = Table.getFirstCellPositionInVerticalMergingGroup(TablePosition.createAndInit(table, rowIndex, cellIndex));
        let verticalSpanCellsPositions = TableCellUtils.getVerticalSpanCellPositions(restartCellPosition, patternCellStartColumnIndex);
        for (let i = verticalSpanCellsPositions.length - 1, pos; pos = verticalSpanCellsPositions[i]; i--) {
            if (canNormalizeVerticalMerging)
                this.modelManipulator.table.normalizeVerticalMerging(this.subDocument, table, pos.rowIndex, pos.cellIndex);
            this.insertTableCellCore(this.subDocument, pos, canCopyProperties, inpPos);
        }
        if (canNormalizeTable) {
            this.normalizeTableGridAfter(table);
            this.modelManipulator.table.normalizeCellColumnSpans(this.subDocument, table, true);
        }
    }
    normalizeTableGridAfter(table) {
        let maxEndColumnIndex = 0;
        let endColumnIndices = [];
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            let lastCell = row.cells[row.cells.length - 1];
            let currentEndColumnIndex = TableCellUtils.getEndColumnIndex(lastCell) + row.gridAfter;
            endColumnIndices.push(currentEndColumnIndex);
            maxEndColumnIndex = Math.max(maxEndColumnIndex, currentEndColumnIndex);
        }
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            let currentEndColumnIndex = endColumnIndices[rowIndex];
            let delta = maxEndColumnIndex - currentEndColumnIndex;
            if (delta > 0)
                this.modelManager.history.addAndRedo(new TableRowGridAfterHistoryItem(this.modelManager.modelManipulator, this.subDocument, table.index, rowIndex, row.gridAfter + delta));
        }
    }
}
export class InsertTableCellToTheLeftOperation extends InsertTableCellOperationBase {
    insertTableCellCore(subDocument, pos, copyProperties, inpPos) {
        this.modelManipulator.table.insertParagraphToTheCellStartAndShiftContent(subDocument, pos.cell, inpPos);
        this.modelManager.history.addAndRedo(new SplitTableCellToTheLeftHistoryItem(this.modelManager.modelManipulator, subDocument, pos.table.index, pos.rowIndex, pos.cellIndex, copyProperties));
        if (pos.cell.verticalMerging !== TableCellMergingState.None)
            this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, subDocument, pos.table.index, pos.rowIndex, pos.cellIndex, pos.cell.verticalMerging));
    }
}
export class InsertTableCellToTheRightOperation extends InsertTableCellOperationBase {
    insertTableCellCore(subDocument, pos, copyProperties, inpPos) {
        this.modelManager.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(subDocument, pos.cell.endParagrapPosition.value - 1), inpPos));
        this.modelManager.history.addAndRedo(new SplitTableCellToTheRightHistoryItem(this.modelManager.modelManipulator, subDocument, pos.table.index, pos.rowIndex, pos.cellIndex, copyProperties));
        if (pos.cell.verticalMerging !== TableCellMergingState.None)
            this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, subDocument, pos.table.index, pos.rowIndex, pos.cellIndex + 1, pos.cell.verticalMerging));
    }
}
