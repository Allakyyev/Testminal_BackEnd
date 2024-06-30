import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Field } from '../../../core/model/fields/field';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { SelectionCommandBase } from './selection-command-base';
export class GoToPrevCharacterCommandBase extends SelectionCommandBase {
    executeCore(_state, _options) {
        var position = this.getPosition();
        if (position == -1)
            return false;
        this.setSelection(position);
        return true;
    }
    getPosition() {
        var selection = this.selection;
        var subDocument = this.selection.activeSubDocument;
        var initialModelPosition = selection.forwardDirection ? selection.lastSelectedInterval.end : selection.lastSelectedInterval.start;
        var initialLayoutPosition = subDocument.isMain()
            ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, initialModelPosition, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false))
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, initialModelPosition, selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(false));
        var prevCharLayoutPosition;
        if (this.extendSelection()) {
            prevCharLayoutPosition = this.getPrevCharacterPosition(initialLayoutPosition);
        }
        else {
            if (!selection.isCollapsed()) {
                if (selection.forwardDirection) {
                    var selectionEndPosition = selection.lastSelectedInterval.start;
                    return (subDocument.isMain()
                        ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, selectionEndPosition, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(true))
                        : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, selectionEndPosition, selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                            .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(true))).getLogPosition();
                }
                else
                    return initialLayoutPosition.getLogPosition();
            }
            prevCharLayoutPosition = this.getPrevCharacterPosition(initialLayoutPosition);
            if (!prevCharLayoutPosition.box.isVisible() && !prevCharLayoutPosition.isPositionBeforeFirstBoxInRow()) {
                do {
                    var prevLP = prevCharLayoutPosition;
                    prevCharLayoutPosition = this.getPrevCharacterPosition(prevCharLayoutPosition);
                } while (!prevCharLayoutPosition.box.isVisible() && prevLP !== prevCharLayoutPosition);
                prevCharLayoutPosition = prevLP;
            }
        }
        const prevCharModelPosition = Math.min(initialModelPosition, prevCharLayoutPosition.getLogPosition());
        return prevCharModelPosition == initialModelPosition ? -1 : prevCharModelPosition;
    }
    getPrevCharacterPosition(layoutPosition) {
        var prevLayoutPosition = layoutPosition.clone();
        if (prevLayoutPosition.charOffset > 0) {
            prevLayoutPosition.charOffset--;
            return prevLayoutPosition;
        }
        if (prevLayoutPosition.boxIndex - 1 >= 0) {
            prevLayoutPosition.boxIndex--;
            prevLayoutPosition.box = prevLayoutPosition.row.boxes[prevLayoutPosition.boxIndex];
            prevLayoutPosition.charOffset = prevLayoutPosition.box.getLength() - 1;
            return prevLayoutPosition;
        }
        if (prevLayoutPosition.advanceToPrevRow(this.control.layout)) {
            prevLayoutPosition.boxIndex = prevLayoutPosition.row.boxes.length - 1;
            prevLayoutPosition.box = prevLayoutPosition.row.boxes[prevLayoutPosition.boxIndex];
            prevLayoutPosition.charOffset = prevLayoutPosition.box.getLength() - 1;
            return prevLayoutPosition;
        }
        else
            return layoutPosition;
    }
}
export class GoToPrevCharacterCommand extends GoToPrevCharacterCommandBase {
    setSelection(position) {
        this.selection.deprecatedSetSelection(position, position, false, -1, true);
    }
    extendSelection() {
        return false;
    }
}
export class ExtendGoToPrevCharacterCommand extends GoToPrevCharacterCommandBase {
    setSelection(position) {
        if (!this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false)))
            ExtendGoToPrevCharacterCommand.jumpThroughFieldToLeft(this.selection);
    }
    extendSelection() {
        return true;
    }
    executeCore(state, options) {
        const selection = this.selection;
        const tableInfo = selection.tableInfo;
        const rawTblInfo = tableInfo.rawData;
        const canSelectCell = tableInfo.isSelected && rawTblInfo.areCellsSelectedInSeries &&
            rawTblInfo.atLeastOneCellFullySelected(selection.intervals);
        if (!canSelectCell)
            return super.executeCore(state, options);
        const forward = selection.forwardDirection || rawTblInfo.firstRowInfo.cells.length == 1;
        const lastRow = forward ? rawTblInfo.lastRowInfo : rawTblInfo.firstRowInfo;
        const cell = lastRow.row[(forward ? ListUtils.last(lastRow.cells) : lastRow.cells[0]).cellIndex - 1];
        if (cell) {
            return this.control.commandManager.getCommand(RichEditClientCommand.SelectTableCellsRange).execute(this.control.commandManager.isPublicApiCall, forward ? {
                firstCell: rawTblInfo.firstCell,
                lastCell: cell
            } : {
                firstCell: rawTblInfo.lastCell,
                lastCell: cell
            });
        }
        return this.control.commandManager.getCommand(RichEditClientCommand.ExtendLineUp).execute(this.control.commandManager.isPublicApiCall);
    }
    static jumpThroughFieldToLeft(selection) {
        const fields = selection.activeSubDocument.fields;
        if (fields.length == 0 || !selection.forwardDirection)
            return;
        var interval = selection.lastSelectedInterval;
        var position = interval.end;
        var field = fields[Math.max(0, Field.normedBinaryIndexOf(fields, position))];
        if (field.getFieldEndPosition() == position)
            selection.changeState((newState) => newState.extendLastInterval(field.getFieldStartPosition()).resetKeepX().setEndOfLine(false));
    }
}
