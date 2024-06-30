import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { LayoutPoint } from '../../../core/layout/layout-point';
import { TableCellBoundFlags } from '../../../core/layout/table/layout-table-cell-info';
import { TableCellUtils } from '../../../core/model/tables/table-utils';
import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { Errors } from '@devexpress/utils/lib/errors';
import { HitTestDeviation } from '@devexpress/utils/lib/geometry/rectangle';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ModifierKey } from '@devexpress/utils/lib/utils/key';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { RichEditClientCommand } from '../../commands/client-command';
import { SelectTableRowCommandOptions } from '../../commands/selection/select-table-command';
import { MouseHandlerStateBase } from './mouse-handler-state-base';
export class MouseHandlerContinueSelectionByRangesState extends MouseHandlerStateBase {
    onMouseMove(evt) {
        var htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None)
            this.continueSelection(htr, evt);
    }
    onMouseUp(_evt) {
        this.stopProcessing();
    }
    start() {
        var _a;
        this.handler.control.inputPositionModelChangesListener.beginUpdate();
        (_a = this.handler.control.barHolder.ribbon) === null || _a === void 0 ? void 0 : _a.beginUpdate();
        this.handler.control.barHolder.publicUiChangesListener.beginUpdate();
        this.handler.control.horizontalRulerControl.beginUpdate();
    }
    finish() {
        var _a;
        this.handler.control.inputPositionModelChangesListener.endUpdate();
        this.handler.control.inputPosition.reset();
        (_a = this.handler.control.barHolder.ribbon) === null || _a === void 0 ? void 0 : _a.endUpdate();
        this.handler.control.barHolder.publicUiChangesListener.endUpdate();
        this.handler.control.horizontalRulerControl.endUpdate();
        this.handler.control.barHolder.updateItemsState();
        this.handler.control.horizontalRulerControl.update();
    }
    stopProcessing() {
        this.handler.switchToDefaultState();
    }
    continueSelection(htr, _evt) {
        var command = this.getExtendSelectionCommand();
        var parameter = this.getExtendSelectionCommandParameter(htr);
        command.execute(this.handler.control.commandManager.isPublicApiCall, parameter);
    }
    getExtendSelectionCommand() {
        throw new Error(Errors.NotImplemented);
    }
    getExtendSelectionCommandParameter(_htr) {
        return undefined;
    }
}
export class MouseHandlerBeginMultiselectionState extends MouseHandlerStateBase {
    constructor(handler, startPosition) {
        super(handler);
        this.startPosition = startPosition;
    }
    onMouseUp(evt) {
        this.handler.switchToDefaultState();
        this.handler.state.onMouseUp(evt);
    }
    onMouseMove(evt) {
        this.updateSelection(evt);
    }
    onMouseWheel(evt) {
        this.updateSelection(evt);
    }
    updateSelection(evt) {
        const htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel > DocumentLayoutDetailsLevel.None) {
            var newPosition = htr.getPosition();
            if (newPosition !== this.startPosition) {
                this.handler.control.selection.changeState((newState) => {
                    newState.addInterval(FixedInterval.fromPositions(this.startPosition, newPosition))
                        .resetKeepX().setEndOfLine(false);
                });
                this.handler.switchState(new MouseHandlerContinueSelectionByCharactersState(this.handler));
            }
        }
    }
}
export class MouseHandlerContinueSelectionByCharactersState extends MouseHandlerContinueSelectionByRangesState {
    constructor() {
        super(...arguments);
        this.prevLayoutPoint = new LayoutPoint(-1, -1, -1);
    }
    extendToPoints(selection, bounds) {
        selection.changeState((newState) => {
            newState.interval.start = Math.min(newState.interval.start, bounds.minElement);
            newState.interval.end = Math.max(newState.interval.end, bounds.maxElement);
            newState.resetKeepX().setEndOfLine(false);
        });
    }
    isForwardMouseDirection(evt) {
        const currLp = evt.layoutPoint;
        return currLp.pageIndex > this.prevLayoutPoint.pageIndex || currLp.y > this.prevLayoutPoint.y || currLp.x > this.prevLayoutPoint.x;
    }
    extendForward(selection, pos) {
        const lastSelectedInterval = selection.lastSelectedInterval;
        const lastParagraphInterval = this.handler.control.selection.activeSubDocument.getParagraphByPosition(Math.max(0, Math.max(pos, lastSelectedInterval.end) - 1)).interval;
        if (lastParagraphInterval.length > 1 && (lastParagraphInterval.end - 1 == pos || lastParagraphInterval.end == pos)
            && lastSelectedInterval.contains(lastParagraphInterval.start)) {
            selection.changeState((newState) => {
                newState.extendLastInterval(Math.max(lastParagraphInterval.end, lastSelectedInterval.end))
                    .resetKeepX().setEndOfLine(false);
            });
            return true;
        }
        return false;
    }
    extendBackward(selection, pos) {
        const lastSelectedInterval = selection.lastSelectedInterval;
        const firstParagraphInterval = this.handler.control.selection.activeSubDocument.getParagraphByPosition(Math.min(pos, lastSelectedInterval.start)).interval;
        let needToExtend = false;
        let bounds = new MinMaxNumber(lastSelectedInterval.start, lastSelectedInterval.end);
        if (firstParagraphInterval.length > 1 && firstParagraphInterval.start == pos && lastSelectedInterval.containsWithIntervalEnd(firstParagraphInterval.end - 1) && !lastSelectedInterval.containsWithIntervalEnd(firstParagraphInterval.end)) {
            bounds.minElement = Math.min(bounds.minElement, firstParagraphInterval.start);
            bounds.maxElement = Math.max(bounds.maxElement, firstParagraphInterval.end);
            needToExtend = true;
        }
        if (lastSelectedInterval.end > firstParagraphInterval.end && !selection.forwardDirection) {
            const lastParInterval = this.handler.control.selection.activeSubDocument.getParagraphByPosition(Math.max(pos, lastSelectedInterval.end)).interval;
            if (lastParInterval.length > 1 && lastSelectedInterval.contains(lastParInterval.start) && lastSelectedInterval.end == lastParInterval.end - 1) {
                bounds.minElement = Math.min(bounds.minElement, lastParInterval.start);
                bounds.maxElement = Math.max(bounds.maxElement, lastParInterval.end);
                needToExtend = true;
            }
        }
        if (needToExtend) {
            this.extendToPoints(selection, bounds);
            return true;
        }
        return false;
    }
    extendSelectionToFullParagraph(evt, pos) {
        const selection = this.handler.control.selection;
        if (this.isForwardMouseDirection(evt)) {
            if (this.extendForward(selection, pos))
                return true;
        }
        else {
            if (this.extendBackward(selection, pos))
                return true;
        }
        return false;
    }
    continueSelection(htr, evt, isTableCell = false) {
        const pos = htr.getPosition();
        if (isTableCell || !this.extendSelectionToFullParagraph(evt, pos))
            this.handler.control.selection.changeState((newState) => {
                newState.extendLastInterval(pos).resetKeepX().setEndOfLine(false);
            });
        this.prevLayoutPoint = evt.layoutPoint.clone();
    }
}
export class MouseHandlerContinueSelectionByLinesState extends MouseHandlerContinueSelectionByRangesState {
    getExtendSelectionCommand() {
        return this.handler.control.commandManager.getCommand(RichEditClientCommand.ExtendSelectLineNoUpdateControlState);
    }
    getExtendSelectionCommandParameter(htr) {
        return htr.getRelatedSubDocumentPagePosition() + htr.pageArea.pageOffset + htr.column.pageAreaOffset + htr.row.columnOffset;
    }
}
export class MouseHandlerContinueSelectionByTableColumnsState extends MouseHandlerContinueSelectionByRangesState {
    constructor(handler, table, startColumnIndex, columnOffsetX) {
        super(handler);
        this.table = table;
        this.startColumnIndex = startColumnIndex;
        this.lastColumnIndex = startColumnIndex;
        this.columnOffsetX = columnOffsetX;
    }
    onMouseMove(evt) {
        if (evt.layoutPoint.isEmpty())
            return;
        let relativeX = evt.layoutPoint.x - this.columnOffsetX - this.table.x;
        let columnIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(this.table.logicInfo.grid.columns.positions, (posX) => posX, relativeX));
        if (columnIndex !== this.lastColumnIndex) {
            let shouldExtend = evt.modifiers & ModifierKey.Ctrl;
            let cmd = this.handler.control.commandManager.getCommand(shouldExtend ? RichEditClientCommand.ExtendSelectTableColumn : RichEditClientCommand.SelectTableColumn);
            let columnIndices = [];
            let startColumnIndex = Math.min(this.startColumnIndex, columnIndex);
            let endColumnIndex = Math.max(this.startColumnIndex, columnIndex);
            for (let i = startColumnIndex; i <= endColumnIndex; i++)
                columnIndices.push(i);
            cmd.execute(this.handler.control.commandManager.isPublicApiCall, { table: this.table.logicInfo.grid.table, columnIndices: columnIndices });
            this.lastColumnIndex = columnIndex;
        }
    }
}
export class MouseHandlerContinueSelectionByTableRowsState extends MouseHandlerContinueSelectionByCharactersState {
    constructor(handler, table, startRowIndex) {
        super(handler);
        this.table = table;
        this.startRowIndex = startRowIndex;
        this.lastRowIndex = startRowIndex;
    }
    onMouseMove(evt) {
        let htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None)
            return;
        let shouldExtend = evt.modifiers & ModifierKey.Ctrl;
        let position = htr.getPosition();
        let modelTable = this.table.logicInfo.grid.table;
        let rowIndex;
        let shouldContinue = false;
        let forwardDirection;
        if (position < modelTable.getStartPosition()) {
            rowIndex = 0;
            shouldContinue = true;
            forwardDirection = false;
        }
        else if (position > modelTable.getEndPosition()) {
            rowIndex = modelTable.rows.length - 1;
            shouldContinue = true;
            forwardDirection = true;
        }
        else {
            rowIndex = SearchUtils.normedInterpolationIndexOf(modelTable.rows, r => r.getStartPosition(), position);
            forwardDirection = rowIndex >= this.startRowIndex;
        }
        let selection = this.handler.control.selection;
        if (this.lastRowIndex !== rowIndex || (!shouldContinue && (selection.intervals[0].start < modelTable.getStartPosition() || selection.intervals[selection.intervals.length - 1].end > modelTable.getEndPosition()))) {
            let cmd = this.handler.control.commandManager.getCommand(shouldExtend ? RichEditClientCommand.ExtendSelectTableRow : RichEditClientCommand.SelectTableRow);
            let rowIndices = [];
            let startRowIndex = Math.min(this.startRowIndex, rowIndex);
            let endRowIndex = Math.max(this.startRowIndex, rowIndex);
            for (let i = startRowIndex; i <= endRowIndex; i++)
                rowIndices.push(i);
            if (rowIndex < this.startRowIndex)
                rowIndices = rowIndices.reverse();
            cmd.execute(this.handler.control.commandManager.isPublicApiCall, new SelectTableRowCommandOptions(this.handler.control, this.table.logicInfo.grid.table, rowIndices, forwardDirection));
            this.lastRowIndex = rowIndex;
        }
        if (shouldContinue)
            this.continueSelection(htr, evt);
    }
}
export class MouseHandlerContinueSelectionByTableCellsState extends MouseHandlerContinueSelectionByCharactersState {
    constructor(handler, startTable, startRowIndex, startGridCellIndex, startPosition) {
        super(handler);
        let modelRow = startTable.logicInfo.grid.table.rows[startRowIndex];
        const cellIndex = startTable.logicInfo.grid.tableCellGridInfos[startRowIndex][startGridCellIndex].getCellIndexAbs(startRowIndex);
        this.startCell = modelRow.cells[cellIndex];
        this.lastCell = this.startCell;
        this.startParentCell = this.startCell;
        this.startPosition = startPosition;
        while (this.startParentCell.parentRow.parentTable.parentCell)
            this.startParentCell = this.startParentCell.parentRow.parentTable.parentCell;
    }
    onMouseMove(evt) {
        let htr = this.handler.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Character, this.handler.control.selection.activeSubDocument);
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None)
            return;
        let selection = this.handler.control.selection;
        let extendSelection = !!(evt.modifiers & ModifierKey.Ctrl);
        if (!htr.row.tableCellInfo) {
            this.selectWholeInterval(htr, evt, extendSelection);
            return;
        }
        let modelTable = htr.row.tableCellInfo.parentRow.parentTable.logicInfo.grid.table;
        let modelRow = modelTable.rows[htr.row.tableCellInfo.parentRow.rowIndex];
        let modelCell = modelRow.cells[TableCellUtils.getCellIndexByColumnIndex(modelRow, htr.row.tableCellInfo.cellGridIndex)];
        let sameTableCells = TableCellUtils.getSameTableCells(this.startCell, modelCell);
        if (!sameTableCells) {
            this.selectWholeInterval(htr, evt, extendSelection);
            return;
        }
        if (this.startCell === sameTableCells.lastCell) {
            if (!extendSelection &&
                (selection.intervals.length !== 1 ||
                    (selection.intervals[0].start !== this.startPosition && selection.intervals[0].end !== this.startPosition)))
                this.handler.control.selection.deprecatedSetSelection(this.startPosition, htr.getPosition(), false, -1, true);
            else {
                const noExtend = htr.row.tableCellInfo && htr.row.tableCellInfo.boundFlags.get(TableCellBoundFlags.EndOnThisColumn) &&
                    ListUtils.last(htr.row.tableCellInfo.layoutRows) == htr.row && htr.exactlyDetailLevel >= DocumentLayoutDetailsLevel.TableCell &&
                    (htr.deviations[DocumentLayoutDetailsLevel.Character] & HitTestDeviation.Right) &&
                    htr.isLastBoxInRow() && htr.charOffset == htr.box.getLength();
                if (!noExtend)
                    this.continueSelection(htr, evt, true);
            }
            this.lastCell = this.startCell;
            return;
        }
        if (this.lastCell === sameTableCells.lastCell)
            return;
        let commandParameters = {
            firstCell: sameTableCells.firstCell,
            lastCell: sameTableCells.lastCell,
            extendSelection: extendSelection
        };
        this.handler.control.commandManager.getCommand(RichEditClientCommand.SelectTableCellsRange)
            .execute(this.handler.control.commandManager.isPublicApiCall, commandParameters);
        this.lastCell = sameTableCells.lastCell;
    }
    selectWholeInterval(htr, evt, extendSelection) {
        let selection = this.handler.control.selection;
        let position = htr.getPosition();
        let startPosition = position >= this.startCell.endParagrapPosition.value ?
            this.startParentCell.parentRow.getStartPosition() :
            this.startParentCell.parentRow.getEndPosition();
        if (selection.multiselection) {
            selection.changeState((newState) => {
                const interval = FixedInterval.fromPositions(startPosition, position);
                if (extendSelection)
                    newState.addInterval(interval);
                else
                    newState.setInterval(interval);
                newState.resetKeepX().setEndOfLine(true);
            });
        }
        else
            this.continueSelection(htr, evt);
    }
}
