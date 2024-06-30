import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { TableCellIterator } from '../../../core/layout/table/table-cell-iterator';
import { TableCellUtils } from '../../../core/model/tables/table-utils';
import { Errors } from '@devexpress/utils/lib/errors';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { ScrollState } from '../../scroll/model-states';
import { RichEditClientCommand } from '../client-command';
import { SelectionCommandBase } from './selection-command-base';
export class GoToLineVerticallyCommandBase extends SelectionCommandBase {
    extendTableCellsSelection() {
        const currentLayoutPosition = this.getInitialLayoutPosition();
        if (!currentLayoutPosition)
            return false;
        const cellIterator = new TableCellIterator(currentLayoutPosition, this.control.layout, this.control.measurer);
        const selectedCells = this.getSelectedCells();
        const areCellsSelectedInSeries = this.selection.tableInfo.extendedData.areCellsSelectedInSeries;
        if (this.extendSelection() && (selectedCells.length > 1 || this.canGoToNextTableRow(cellIterator)) && areCellsSelectedInSeries) {
            let isForward = this.selection.isCollapsed() ? this.isForwardDirection() : this.selection.forwardDirection;
            let table = selectedCells[0][0].parentRow.parentTable;
            let currentRow = this.getCurrentTableRow(selectedCells);
            let currentRowIndex = SearchUtils.binaryIndexOf(table.rows, (row) => row.getStartPosition() - currentRow.getStartPosition());
            if (this.checkTableRowIndex(currentRowIndex, table.rows.length)) {
                let nextRow = this.getNextTableRow(table, currentRowIndex);
                let firstSelectedCell = selectedCells[0][0];
                let lastSelectedCell = selectedCells[selectedCells.length - 1][selectedCells[selectedCells.length - 1].length - 1];
                return this.performTableCellsSelection(isForward, nextRow, firstSelectedCell, lastSelectedCell);
            }
            this.performSelectionOnTheLastTableRow(isForward, selectedCells);
        }
        return false;
    }
    getSelectedCells() {
        let selectedCells = ListUtils.map(this.selection.tableInfo.rawData.rows, (rowInfo) => ListUtils.map(rowInfo.cells, (cellInfo) => cellInfo.cell));
        let position = LayoutPositionMainSubDocumentCreator.createLightLayoutPosition(this.control.layout, this.selection.activeSubDocument, this.getInitialSelectionEndPosition(), this.selection.pageIndex, DocumentLayoutDetailsLevel.Character, true, false);
        if (!selectedCells.length && position.row.tableCellInfo) {
            let modelTable = position.row.tableCellInfo.parentRow.parentTable.logicInfo.grid.table;
            let modelRowIndex = position.row.tableCellInfo.parentRow.rowIndex;
            selectedCells = [];
            for (let i = 0; i <= modelRowIndex; i++)
                selectedCells.push(modelTable.rows[i].cells);
        }
        return selectedCells;
    }
    getLogPositionByX(layoutPosition, x) {
        var newLayoutPosition = layoutPosition.clone();
        var xOffsetBoxLevel = Math.max(0, x - (newLayoutPosition.page.x + newLayoutPosition.pageArea.x + newLayoutPosition.column.x + newLayoutPosition.row.x));
        var boxIndex = SearchUtils.normedInterpolationIndexOf(newLayoutPosition.row.boxes, (b) => b.x, xOffsetBoxLevel);
        if (boxIndex < 0)
            boxIndex = 0;
        newLayoutPosition.box = newLayoutPosition.row.boxes[boxIndex];
        var isNoVisibleBoxesInRow = false;
        if (!newLayoutPosition.box.isVisible()) {
            var lastVisibleBoxIndexInRow = newLayoutPosition.row.getLastVisibleBoxIndex();
            if (lastVisibleBoxIndexInRow < 0) {
                lastVisibleBoxIndexInRow = 0;
                isNoVisibleBoxesInRow = true;
            }
            newLayoutPosition.boxIndex = lastVisibleBoxIndexInRow;
            newLayoutPosition.box = newLayoutPosition.row.boxes[lastVisibleBoxIndexInRow];
        }
        var xOffsetCharLevel = isNoVisibleBoxesInRow ? 0 : xOffsetBoxLevel - newLayoutPosition.box.x;
        return newLayoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Box) + newLayoutPosition.box.calculateCharOffsetByPointX(this.control.measurer, xOffsetCharLevel);
    }
    isEndOfLine(layoutPosition, position) {
        return position === layoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Row) + layoutPosition.row.getLastBoxEndPositionInRow();
    }
    selectTableCellsRange(parameters) {
        return this.control.commandManager.getCommand(RichEditClientCommand.SelectTableCellsRange).execute(this.control.commandManager.isPublicApiCall, parameters);
    }
    executeCore(_state, _options) {
        if (this.extendTableCellsSelection())
            return true;
        var selection = this.selection;
        var layout = this.control.layout;
        var subDocument = this.selection.activeSubDocument;
        let initialLayoutPosition = this.getInitialLayoutPosition();
        if (!initialLayoutPosition)
            return false;
        var keepX = selection.keepX;
        if (keepX < 0)
            keepX = initialLayoutPosition.page.x + initialLayoutPosition.pageArea.x + initialLayoutPosition.column.x + initialLayoutPosition.row.x + initialLayoutPosition.box.x +
                initialLayoutPosition.box.getCharOffsetXInPixels(this.control.measurer, initialLayoutPosition.charOffset);
        var newLayoutPosition;
        var cellIterator = new TableCellIterator(initialLayoutPosition, layout, this.control.measurer);
        if (this.canAdvanceToNextRow(cellIterator))
            newLayoutPosition = cellIterator.getModifyPosition();
        else {
            var currentPosition = initialLayoutPosition.getLogPosition(DocumentLayoutDetailsLevel.Character);
            newLayoutPosition = this.getNewLayoutPositionRowLevel(initialLayoutPosition);
            if (newLayoutPosition && this.extendSelection()) {
                var isEdgeDocumentPosition = currentPosition == 0 || currentPosition == subDocument.getDocumentEndPosition();
                var needKeepCurrentLine = isEdgeDocumentPosition && currentPosition != this.getLogPositionByX(initialLayoutPosition, keepX);
                if (needKeepCurrentLine)
                    newLayoutPosition = initialLayoutPosition.clone();
            }
            else if (!newLayoutPosition) {
                var edgeLinePosition = this.getPositionForEdgeLine(initialLayoutPosition);
                if (this.extendSelection() && currentPosition != edgeLinePosition) {
                    this.selection.changeState((newState) => newState.extendLastInterval(edgeLinePosition).setKeepX(keepX)
                        .setEndOfLine(this.isEndOfLine(initialLayoutPosition, edgeLinePosition)));
                    return true;
                }
                else if (!this.extendSelection()) {
                    var lastInterval = selection.lastSelectedInterval;
                    if (lastInterval && lastInterval.length > 0)
                        selection.deprecatedSetSelection(edgeLinePosition, edgeLinePosition, this.isEndOfLine(initialLayoutPosition, edgeLinePosition), keepX, true);
                }
                return false;
            }
        }
        var newLogPosition = this.getLogPositionByX(newLayoutPosition, keepX);
        if (newLogPosition == initialLayoutPosition.getLogPosition())
            return false;
        var endOfLine = this.isEndOfLine(newLayoutPosition, newLogPosition);
        if (this.extendSelection()) {
            this.selection.changeState((newState) => newState.extendLastInterval(newLogPosition).setKeepX(keepX).setEndOfLine(endOfLine));
            this.selection.scrollManager.setScroll(new ScrollState()
                .byModelPosition(this.selection)
                .setModelPosition(newLogPosition)
                .useStdRelativePosition()
                .useStdOffset());
        }
        else
            selection.deprecatedSetSelection(newLogPosition, newLogPosition, endOfLine, keepX, true);
        return true;
    }
    getInitialLayoutPosition() {
        const selection = this.selection;
        const subDocument = selection.activeSubDocument;
        const initialSelectionEndPosition = this.getInitialSelectionEndPosition();
        const useBoxEndPos = selection.endOfLine;
        return (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, initialSelectionEndPosition, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, initialSelectionEndPosition, selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(useBoxEndPos), new LayoutPositionCreatorConflictFlags().setDefault(false));
    }
    canGoToNextTableRow(_cellInterator) {
        return false;
    }
    checkTableRowIndex(_rowIndex, _length) {
        throw new Error(Errors.NotImplemented);
    }
    getCurrentTableRow(_selectedCells) {
        throw new Error(Errors.NotImplemented);
    }
    getNextTableRow(_table, _rowIndex) {
        throw new Error(Errors.NotImplemented);
    }
    performTableCellsSelection(isForward, nextRow, firstCell, lastCell) {
        let lastSelectedCell = isForward ? lastCell : firstCell;
        let lastCellIndex = TableCellUtils.getCellIndexByColumnIndex(nextRow, TableCellUtils.getStartColumnIndex(lastSelectedCell));
        const newFirstCell = isForward ? firstCell : lastCell;
        const newLastCell = nextRow.cells[lastCellIndex];
        if (newFirstCell === newLastCell) {
            const firstPos = newFirstCell.startParagraphPosition.value;
            const lastPos = newFirstCell.endParagrapPosition.value - 1;
            this.selection.changeState(state => state.setInterval(FixedInterval.fromPositions(firstPos, lastPos)).setForwardDirection(isForward));
            return true;
        }
        else
            return this.selectTableCellsRange({
                firstCell: newFirstCell,
                lastCell: newLastCell
            });
    }
    performSelectionOnTheLastTableRow(_isForward, _selectedCells) {
        throw new Error(Errors.NotImplemented);
    }
    isForwardDirection() {
        throw new Error(Errors.NotImplemented);
    }
}
