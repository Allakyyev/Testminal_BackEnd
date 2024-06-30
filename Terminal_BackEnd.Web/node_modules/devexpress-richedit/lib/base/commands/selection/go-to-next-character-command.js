import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { Field } from '../../../core/model/fields/field';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { SelectionCommandBase } from './selection-command-base';
export class GoToNextCharacterCommandBase extends SelectionCommandBase {
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
            ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, initialModelPosition, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setCustom(true, true, false, false))
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, initialModelPosition, selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setCustom(true, true, false, false));
        var nextCharLayoutPosition;
        if (this.extendSelection()) {
            nextCharLayoutPosition = initialLayoutPosition;
            if (nextCharLayoutPosition.getLogPosition() == initialModelPosition) {
                nextCharLayoutPosition = this.getNextCharacterPosition(nextCharLayoutPosition);
                if (nextCharLayoutPosition.isPositionBeforeFirstBoxInRow())
                    nextCharLayoutPosition = this.getNextCharacterPosition(nextCharLayoutPosition);
            }
            else if (nextCharLayoutPosition.isPositionBeforeFirstBoxInRow())
                nextCharLayoutPosition = this.getNextCharacterPosition(nextCharLayoutPosition);
            else if (nextCharLayoutPosition.getLogPosition() < initialModelPosition)
                nextCharLayoutPosition = this.getNextCharacterPosition(nextCharLayoutPosition);
        }
        else {
            if (!selection.isCollapsed()) {
                var pos;
                if (selection.forwardDirection) {
                    pos = initialLayoutPosition.getLogPosition();
                }
                else {
                    var selectionEndPosition = selection.lastSelectedInterval.end;
                    pos = (subDocument.isMain()
                        ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, selectionEndPosition, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(true))
                        : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, selectionEndPosition, selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                            .create(new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(true))).getLogPosition();
                }
                return pos < subDocument.getDocumentEndPosition() ? pos : pos - 1;
            }
            nextCharLayoutPosition = initialLayoutPosition;
            var needFindPosition = nextCharLayoutPosition.getLogPosition() == initialModelPosition;
            if (!needFindPosition)
                needFindPosition = Field.binaryIndexOf(subDocument.fields, initialModelPosition + 1) >= 0;
            if (needFindPosition) {
                if (nextCharLayoutPosition.box.getLength() == nextCharLayoutPosition.charOffset)
                    nextCharLayoutPosition = this.getNextCharacterPosition(nextCharLayoutPosition);
                do {
                    var prevLP = nextCharLayoutPosition;
                    nextCharLayoutPosition = this.getNextCharacterPosition(prevLP);
                    if (prevLP === nextCharLayoutPosition) {
                        nextCharLayoutPosition = initialLayoutPosition;
                        break;
                    }
                } while (!(nextCharLayoutPosition.box.isVisible() || nextCharLayoutPosition.isPositionBeforeFirstBoxInRow()));
            }
        }
        const nextCharModelPosition = Math.max(initialModelPosition, nextCharLayoutPosition.getLogPosition());
        return nextCharModelPosition == initialModelPosition ? -1 : nextCharModelPosition;
    }
    getNextCharacterPosition(layoutPosition) {
        const nextLayoutPosition = layoutPosition.clone();
        if (nextLayoutPosition.charOffset + 1 <= nextLayoutPosition.box.getLength()) {
            nextLayoutPosition.charOffset++;
            return nextLayoutPosition;
        }
        nextLayoutPosition.charOffset = 0;
        if (nextLayoutPosition.boxIndex + 1 < nextLayoutPosition.row.boxes.length) {
            nextLayoutPosition.boxIndex++;
            nextLayoutPosition.box = nextLayoutPosition.row.boxes[nextLayoutPosition.boxIndex];
            return nextLayoutPosition;
        }
        nextLayoutPosition.boxIndex = 0;
        if (nextLayoutPosition.advanceToNextRow(this.control.layout)) {
            nextLayoutPosition.box = nextLayoutPosition.row.boxes[0];
            return nextLayoutPosition;
        }
        else
            return layoutPosition;
    }
}
export class GoToNextCharacterCommand extends GoToNextCharacterCommandBase {
    setSelection(position) {
        this.selection.deprecatedSetSelection(position, position, false, -1, true);
    }
    extendSelection() {
        return false;
    }
}
export class ExtendGoToNextCharacterCommand extends GoToNextCharacterCommandBase {
    setSelection(position) {
        if (!this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false)))
            ExtendGoToNextCharacterCommand.jumpThroughFieldToRight(this.selection);
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
        const cell = lastRow.row[(forward ? ListUtils.last(lastRow.cells) : lastRow.cells[0]).cellIndex + 1];
        if (cell) {
            return this.control.commandManager.getCommand(RichEditClientCommand.SelectTableCellsRange).execute(this.control.commandManager.isPublicApiCall, forward ? {
                firstCell: rawTblInfo.firstCell,
                lastCell: cell
            } : {
                firstCell: rawTblInfo.lastCell,
                lastCell: cell
            });
        }
        return this.control.commandManager.getCommand(RichEditClientCommand.ExtendLineDown).execute(this.control.commandManager.isPublicApiCall);
    }
    static jumpThroughFieldToRight(selection) {
        const fields = selection.activeSubDocument.fields;
        if (fields.length == 0 || selection.forwardDirection)
            return;
        var interval = selection.lastSelectedInterval;
        var position = interval.start;
        var field = fields[Math.max(0, Field.normedBinaryIndexOf(fields, position + 1))];
        if (field.getFieldStartPosition() == position)
            selection.changeState((newState) => newState.extendLastInterval(field.getFieldEndPosition()).setEndOfLine(false).resetKeepX());
    }
}
