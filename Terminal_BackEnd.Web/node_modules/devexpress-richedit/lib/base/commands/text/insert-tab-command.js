import { LayoutBoxIteratorMainSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-main-sub-document';
import { LayoutBoxIteratorOtherSubDocument } from '../../../core/layout-engine/layout-box-iterator/layout-box-iterator-other-sub-document';
import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator, LayoutPositionOtherSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { ModelIterator } from '../../../core/model/model-iterator';
import { ControlOptions } from '../../../core/model/options/control';
import { RunType } from '../../../core/model/runs/run-type';
import { TablePosition } from '../../../core/model/tables/main-structures/table';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SetSelectionParams } from '../../selection/set-selection-params';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { ChangeIndentCommandBase } from '../paragraph-properties/change-indent-command';
import { ChangeParagraphIndentFromFirstRowCommandBase } from '../paragraph-properties/change-paragraph-indent-from-first-row-command';
export class InsertTabCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    setNextObj(iter) {
        do {
            if (EnumUtils.isAnyOf(iter.run.getType(), RunType.InlinePictureRun, RunType.AnchoredPictureRun, RunType.AnchoredTextBoxRun))
                return true;
        } while (iter.moveToNextRun());
        return false;
    }
    executeCore(_state, options) {
        const specInfo = this.selection.specialRunInfo;
        if (specInfo.isSelected() && (!specInfo.isTextBoxSelected() ||
            this.selection.activeSubDocument.id == specInfo.getParentSubDocument().id)) {
            const iter = new ModelIterator(this.selection.activeSubDocument, true);
            iter.setPosition(specInfo.getPosition() + 1);
            if (!this.setNextObj(iter)) {
                iter.setPosition(0);
                this.setNextObj(iter);
            }
            this.selection.setSelection(new SetSelectionParams().setInterval(new FixedInterval(iter.getAbsolutePosition(), 1)));
            return true;
        }
        var interval = this.selection.lastSelectedInterval.clone();
        var startParagraph = this.selection.activeSubDocument.getParagraphByPosition(interval.start);
        var documentEndPosition = this.selection.activeSubDocument.getDocumentEndPosition();
        if (interval.start >= documentEndPosition)
            throw new Error("InsertTabCommandBase interval.start >= documentEndPosition");
        if (interval.length > 0 && interval.end > documentEndPosition)
            throw new Error("InsertTabCommandBase interval.end > documentEndPosition");
        var subDocument = this.selection.activeSubDocument;
        var startLayoutPosition = subDocument.isMain()
            ? LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, interval.start, DocumentLayoutDetailsLevel.Character, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false))
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, interval.start, this.selection.pageIndex, DocumentLayoutDetailsLevel.Character)
                .create(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(false));
        if (this.addTableRowIfRequired(startLayoutPosition))
            return true;
        if (this.performCellIteratorActionIfRequired(startLayoutPosition, interval.start))
            return true;
        if (!this.control.commandManager.assertLastExecutedCommandsChain(true, InsertTabCommandBase)) {
            if (startParagraph.getTabs().positions.length === 0) {
                if (this.needProcessFirstParagraphRow(interval, startParagraph, startLayoutPosition)) {
                    if (startParagraph.isInList())
                        return this.createIndentNumberingParagraphCommand().execute(this.control.commandManager.isPublicApiCall);
                    return this.createChangeParagraphIndentFromFirstRowCommand().execute(this.control.commandManager.isPublicApiCall);
                }
                if (this.needProcessParagraphLeftIndent(interval, startLayoutPosition))
                    return this.createChangeIndentCommand().execute(this.control.commandManager.isPublicApiCall);
            }
        }
        if (ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tabSymbol))
            this.insertTextWithSelection(options.intervalsInfo.subDocInterval, this.control.modelManager.richOptions.control.tabMarker);
        return true;
    }
    addTableRowIfRequired(lp) {
        const cellInfo = lp.row.tableCellInfo;
        if (!cellInfo)
            return false;
        const rowInfo = cellInfo.parentRow;
        const grid = rowInfo.parentTable.logicInfo.grid;
        const info = grid.tableCellGridInfos[rowInfo.rowIndex][cellInfo.cellGridIndex];
        const rowInd = info.getEndRowIndex();
        const cellInd = info.getCellIndex(info.getNumRowsInCell() - 1);
        const lastRow = ListUtils.last(grid.table.rows);
        if (rowInd == grid.table.rows.length && cellInd == lastRow.cells.length - 1) {
            this.control.commandManager.getCommand(RichEditClientCommand.InsertTableRowBelow)
                .execute(this.control.commandManager.isPublicApiCall);
            this.selection.setSelection(new SetSelectionParams()
                .setPosition(this.selection.intervals[0].start)
                .setEndOfLine(false));
            return true;
        }
        return false;
    }
    needProcessFirstParagraphRow(interval, startParagraph, startLayoutPosition) {
        if (this.control.commandManager.assertLastExecutedCommandsChain(false, InsertTabCommandBase, ChangeParagraphIndentFromFirstRowCommandBase) && this.isIntervalStartInParagraphStart(interval, startParagraph))
            return true;
        return this.isIntervalStartInParagraphStart(interval, startParagraph) && (interval.length === 0 || this.isIntervalEndOnRowEnd(interval, startLayoutPosition));
    }
    needProcessParagraphLeftIndent(interval, startLayoutPosition) {
        if (this.control.commandManager.assertLastExecutedCommandsChain(false, InsertTabCommandBase, ChangeIndentCommandBase))
            return true;
        var subDocument = this.selection.activeSubDocument;
        var endLayoutPosition = (subDocument.isMain()
            ? new LayoutPositionMainSubDocumentCreator(this.control.layout, subDocument, interval.end, DocumentLayoutDetailsLevel.Character)
            : new LayoutPositionOtherSubDocumentCreator(this.control.layout, subDocument, interval.end, this.selection.pageIndex, DocumentLayoutDetailsLevel.Character))
            .create(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(false));
        return startLayoutPosition && startLayoutPosition.isPositionBeforeFirstBoxInRow() && this.isIntervalIncludesWholeRow(startLayoutPosition, endLayoutPosition);
    }
    performCellIteratorActionIfRequired(startLayoutPosition, pos) {
        const startCellInfo = startLayoutPosition.row.tableCellInfo;
        if (!startCellInfo)
            return false;
        let boxIterator;
        const startCellIndexes = this.getTablePos(startCellInfo);
        while (true) {
            boxIterator = this.getBoxIterator(pos, startCellInfo.parentRow.parentTable.getTopLevelColumn().logicInfo.grid.table.getEndPosition() + 1);
            if (boxIterator && boxIterator.isInitialized())
                break;
            this.control.layoutFormatterManager.forceFormatPage(this.control.layout.validPageCount);
        }
        while (this.performCellIteratorAction(boxIterator)) {
            const currIndexes = this.getTablePos(boxIterator.position.row.tableCellInfo);
            if (!startCellIndexes.equals(currIndexes)) {
                if (currIndexes &&
                    (startCellIndexes.table.index == currIndexes.table.index ||
                        currIndexes.table.nestedLevel > startCellIndexes.table.nestedLevel)) {
                    const grid = boxIterator.position.row.tableCellInfo.parentRow.parentTable.logicInfo.grid;
                    const cellStartPos = grid.table.rows[currIndexes.rowIndex].cells[currIndexes.cellIndex].startParagraphPosition.value;
                    this.selection.setSelection(new SetSelectionParams()
                        .setInterval(new FixedInterval(cellStartPos, 0))
                        .setEndOfLine(false));
                }
                break;
            }
        }
        return true;
    }
    getTablePos(cellInfo) {
        if (!cellInfo)
            return null;
        const rowInfo = cellInfo.parentRow;
        const grid = rowInfo.parentTable.logicInfo.grid;
        const info = grid.tableCellGridInfos[rowInfo.rowIndex][cellInfo.cellGridIndex];
        return new TablePosition(grid.table, info.getStartRowIndex(), info.getCellIndex(0));
    }
    isIntervalStartInParagraphStart(interval, paragraph) {
        return interval.start === paragraph.startLogPosition.value;
    }
    isIntervalEndOnRowEnd(interval, layoutPosition) {
        if (!layoutPosition)
            return false;
        return layoutPosition.getRelatedSubDocumentPagePosition() + layoutPosition.pageArea.pageOffset + layoutPosition.column.pageAreaOffset + layoutPosition.row.getEndPosition() === interval.end;
    }
    isIntervalIncludesWholeRow(startLayoutPosition, endLayoutPosition) {
        return !endLayoutPosition || endLayoutPosition.row !== startLayoutPosition.row || endLayoutPosition.isPositionAfterLastBoxInRow();
    }
}
export class InsertTabCommand extends InsertTabCommandBase {
    createIndentNumberingParagraphCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.IncrementNumberingIndent);
    }
    createChangeParagraphIndentFromFirstRowCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.IncrementParagraphIndentFromFirstRow);
    }
    createChangeIndentCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.IncreaseIndent);
    }
    performCellIteratorAction(boxIterator) {
        return boxIterator.moveNext(new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
    }
    getBoxIterator(pos, endPos) {
        const subDocument = this.selection.activeSubDocument;
        const layout = this.control.layout;
        return subDocument.isMain() ?
            new LayoutBoxIteratorMainSubDocument(subDocument, layout, pos, endPos) :
            new LayoutBoxIteratorOtherSubDocument(subDocument, layout, pos, endPos, this.selection.pageIndex);
    }
}
export class InsertShiftTabCommand extends InsertTabCommandBase {
    createIndentNumberingParagraphCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.DecrementNumberingIndent);
    }
    createChangeParagraphIndentFromFirstRowCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.DecrementParagraphIndentFromFirstRow);
    }
    createChangeIndentCommand() {
        return this.control.commandManager.getCommand(RichEditClientCommand.DecreaseIndent);
    }
    performCellIteratorAction(boxIterator) {
        return boxIterator.movePrev(new LayoutPositionCreatorConflictFlags().setDefault(true), new LayoutPositionCreatorConflictFlags().setDefault(true));
    }
    getBoxIterator(pos, _endPos) {
        const subDocument = this.selection.activeSubDocument;
        const layout = this.control.layout;
        return subDocument.isMain() ?
            new LayoutBoxIteratorMainSubDocument(subDocument, layout, 0, pos) :
            new LayoutBoxIteratorOtherSubDocument(subDocument, layout, 0, pos, this.selection.pageIndex);
    }
}
