import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { GoToLineVerticallyCommandBase } from './go-to-line-vertically-command-base';
export class LineDownCommand extends GoToLineVerticallyCommandBase {
    extendSelection() {
        return false;
    }
    getPositionForEdgeLine(_layoutPosition) {
        var lastIntervalEnd = this.selection.lastSelectedInterval.end;
        if (this.selection.activeSubDocument.getDocumentEndPosition() == lastIntervalEnd)
            lastIntervalEnd--;
        return lastIntervalEnd;
    }
    canAdvanceToNextRow(cellIterator) {
        return cellIterator.tryAdvanceToBelowRow();
    }
    getNewLayoutPositionRowLevel(oldLayoutPosition) {
        var newLayoutPosition = oldLayoutPosition.clone();
        if (newLayoutPosition.advanceToNextRow(this.control.layout))
            return newLayoutPosition;
        return null;
    }
    getInitialSelectionEndPosition() {
        if (this.extendSelection() && !this.selection.forwardDirection)
            return this.selection.lastSelectedInterval.start;
        else
            return this.selection.lastSelectedInterval.end;
    }
    isForwardDirection() {
        return true;
    }
}
export class ExtendLineDownCommand extends LineDownCommand {
    extendSelection() {
        return true;
    }
    getPositionForEdgeLine(layoutPosition) {
        return layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Row) + layoutPosition.row.getLastBoxEndPositionInRow();
    }
    canAdvanceToNextRow(_cellIterator) {
        return false;
    }
    canGoToNextTableRow(cellInterator) {
        return cellInterator.canAdvanceToBelowRow();
    }
    getCurrentTableRow(selectedCells) {
        return this.selection.forwardDirection ? selectedCells[selectedCells.length - 1][0].parentRow : selectedCells[0][0].parentRow;
    }
    checkTableRowIndex(rowIndex, length = 0) {
        return rowIndex > -1 && rowIndex < length - 1;
    }
    getNextTableRow(table, rowIndex) {
        return table.rows[rowIndex + 1];
    }
    performSelectionOnTheLastTableRow(isForward, selectedCells) {
        if (isForward) {
            let table = selectedCells[0][0].parentRow.parentTable;
            const firstRowIndex = SearchUtils.binaryIndexOf(table.rows, (row) => row.getStartPosition() - selectedCells[0][0].parentRow.getStartPosition());
            const lastRowIndex = table.rows.length - 1;
            this.selectTableCellsRange({
                firstCell: table.rows[firstRowIndex].cells[0],
                lastCell: table.rows[lastRowIndex].cells[table.rows[lastRowIndex].cells.length - 1]
            });
        }
    }
}
