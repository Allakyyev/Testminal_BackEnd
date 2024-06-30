import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { GoToLineVerticallyCommandBase } from './go-to-line-vertically-command-base';
export class GoToLineAboveCommand extends GoToLineVerticallyCommandBase {
    extendSelection() {
        return false;
    }
    getPositionForEdgeLine(_layoutPosition) {
        var lastInterval = this.selection.lastSelectedInterval;
        return lastInterval.start;
    }
    canAdvanceToNextRow(cellIterator) {
        return cellIterator.tryAdvanceToAboveRow();
    }
    getNewLayoutPositionRowLevel(oldLayoutPosition) {
        var newLayoutPosition = oldLayoutPosition.clone();
        if (newLayoutPosition.advanceToPrevRow(this.control.layout))
            return newLayoutPosition;
        else
            return null;
    }
    getInitialSelectionEndPosition() {
        if (this.extendSelection() && this.selection.forwardDirection)
            return this.selection.lastSelectedInterval.end;
        else
            return this.selection.lastSelectedInterval.start;
    }
    isForwardDirection() {
        return false;
    }
}
export class ExtendGoToLineAboveCommand extends GoToLineAboveCommand {
    extendSelection() {
        return true;
    }
    getPositionForEdgeLine(layoutPosition) {
        return layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Row);
    }
    canAdvanceToNextRow(_cellIterator) {
        return false;
    }
    canGoToNextTableRow(cellIterator) {
        return cellIterator.canAdvanceToAboveRow();
    }
    getCurrentTableRow(selectedCells) {
        let isForward = this.selection.forwardDirection;
        return isForward ? selectedCells[selectedCells.length - 1][selectedCells[selectedCells.length - 1].length - 1].parentRow : selectedCells[0][0].parentRow;
    }
    checkTableRowIndex(rowIndex, _length = 0) {
        return rowIndex > -1 && rowIndex != 0;
    }
    getNextTableRow(table, rowIndex) {
        return table.rows[rowIndex - 1];
    }
    performSelectionOnTheLastTableRow(isForward, selectedCells) {
        if (!isForward) {
            let table = selectedCells[0][0].parentRow.parentTable;
            let lastSelectedCell = selectedCells[selectedCells.length - 1][selectedCells[selectedCells.length - 1].length - 1];
            const firstRowIndex = SearchUtils.binaryIndexOf(table.rows, (row) => row.getStartPosition() - lastSelectedCell.parentRow.getStartPosition());
            const lastRowIndex = 0;
            this.selectTableCellsRange({
                firstCell: table.rows[firstRowIndex].cells[table.rows[firstRowIndex].cells.length - 1],
                lastCell: table.rows[lastRowIndex].cells[0]
            });
        }
    }
}
