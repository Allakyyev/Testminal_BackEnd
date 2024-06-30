import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SelectionCommandBase } from './selection-command-base';
export class SelectLineCommand extends SelectionCommandBase {
    executeCore(_state, options) {
        var selection = this.selection;
        var subDocument = this.selection.activeSubDocument;
        var clickLayoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, options.param, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, options.param, selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
        if (!clickLayoutPosition)
            return false;
        var clickRowEndBox = clickLayoutPosition.row.boxes[clickLayoutPosition.row.boxes.length - 1];
        var clickRowStartPosition = clickLayoutPosition.getRelatedSubDocumentPagePosition() + clickLayoutPosition.pageArea.pageOffset + clickLayoutPosition.column.pageAreaOffset + clickLayoutPosition.row.columnOffset;
        var clickRowEndPosition = clickRowStartPosition + clickRowEndBox.rowOffset + clickRowEndBox.getLength();
        this.setSelection(clickRowStartPosition, clickRowEndPosition);
        return true;
    }
    setSelection(startPosition, endPosition) {
        this.selection.deprecatedSetSelection(startPosition, endPosition, false, -1, true);
    }
}
export class AddSelectedLineCommandNoUpdateControlState extends SelectLineCommand {
    setSelection(startPosition, endPosition) {
        this.selection.changeState((newState) => newState.addInterval(FixedInterval.fromPositions(startPosition, endPosition))
            .resetKeepX().setEndOfLine(false));
    }
}
export class ExtendSelectLineCommand extends SelectionCommandBase {
    executeCore(_state, options) {
        const clickPosition = options.param;
        var selection = this.selection;
        var currentInterval = selection.lastSelectedInterval;
        var intervalEnd = currentInterval.end;
        if (intervalEnd == this.selection.activeSubDocument.getDocumentEndPosition())
            intervalEnd--;
        var subDocument = this.selection.activeSubDocument;
        var startSelectionRowStartLayoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, currentInterval.start, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, currentInterval.start, selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (!startSelectionRowStartLayoutPosition)
            return false;
        var startSelectionEndBox = startSelectionRowStartLayoutPosition.row.boxes[startSelectionRowStartLayoutPosition.row.boxes.length - 1];
        var endSelectionRowStartLayoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, intervalEnd, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, intervalEnd, selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (!endSelectionRowStartLayoutPosition)
            return false;
        var endSelectionEndBox = endSelectionRowStartLayoutPosition.row.boxes[endSelectionRowStartLayoutPosition.row.boxes.length - 1];
        var clickRowStartLayoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, clickPosition, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, clickPosition, selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (!clickRowStartLayoutPosition)
            return false;
        var clickEndBox = clickRowStartLayoutPosition.row.boxes[clickRowStartLayoutPosition.row.boxes.length - 1];
        var startSelectionRowStartPosition = startSelectionRowStartLayoutPosition.getRelatedSubDocumentPagePosition() + startSelectionRowStartLayoutPosition.pageArea.pageOffset +
            startSelectionRowStartLayoutPosition.column.pageAreaOffset + startSelectionRowStartLayoutPosition.row.columnOffset;
        var startSelectionRowEndPosition = startSelectionRowStartPosition + startSelectionEndBox.rowOffset + startSelectionEndBox.getLength();
        var endSelectionRowStartPosition = endSelectionRowStartLayoutPosition.getRelatedSubDocumentPagePosition() + endSelectionRowStartLayoutPosition.pageArea.pageOffset +
            endSelectionRowStartLayoutPosition.column.pageAreaOffset + endSelectionRowStartLayoutPosition.row.columnOffset;
        var endSelectionRowEndPosition = endSelectionRowStartPosition + endSelectionEndBox.rowOffset + endSelectionEndBox.getLength();
        var clickStartRowPosition = clickRowStartLayoutPosition.getRelatedSubDocumentPagePosition() + clickRowStartLayoutPosition.pageArea.pageOffset +
            clickRowStartLayoutPosition.column.pageAreaOffset + clickRowStartLayoutPosition.row.columnOffset;
        var clickEndRowPosition = clickStartRowPosition + clickEndBox.rowOffset + clickEndBox.getLength();
        if (currentInterval.start == startSelectionRowStartPosition && currentInterval.end == endSelectionRowEndPosition) {
            if (selection.forwardDirection) {
                if (clickStartRowPosition < startSelectionRowStartPosition)
                    selection.deprecatedSetSelection(startSelectionRowEndPosition, clickStartRowPosition, false, -1, true);
                else
                    selection.deprecatedSetSelection(startSelectionRowStartPosition, clickEndRowPosition, false, -1, true);
            }
            else {
                if (clickStartRowPosition >= endSelectionRowStartPosition)
                    selection.deprecatedSetSelection(endSelectionRowStartPosition, clickEndRowPosition, false, -1, true);
                else
                    selection.deprecatedSetSelection(endSelectionRowEndPosition, clickStartRowPosition, false, -1, true);
            }
        }
        else {
            if (selection.forwardDirection) {
                var selectionEnd = clickStartRowPosition <= currentInterval.start ? Math.min(clickStartRowPosition, startSelectionRowStartPosition) : clickStartRowPosition;
                selection.deprecatedSetSelection(currentInterval.start, selectionEnd, false, -1, true);
            }
            else
                selection.deprecatedSetSelection(intervalEnd, clickStartRowPosition, false, -1, true);
        }
        return true;
    }
}
export class SelectLineCommandNoUpdateControlState extends SelectLineCommand {
}
export class ExtendSelectLineCommandNoUpdateControlState extends ExtendSelectLineCommand {
}
