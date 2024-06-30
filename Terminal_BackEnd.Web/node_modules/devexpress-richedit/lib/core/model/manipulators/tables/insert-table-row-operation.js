import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { InsertParagraphHistoryItem } from '../../history/items/insert-paragraph-history-item';
import { InsertTableRowHistoryItem } from '../../history/items/tables/insert-table-row-history-item';
import { TableCellVerticalMergingHistoryItem } from '../../history/items/tables/table-cell-properties-history-items';
import { SubDocumentPosition } from '../../sub-document';
import { TableCellMergingState } from '../../tables/secondary-structures/table-base-structures';
import { TableCellUtils } from '../../tables/table-utils';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
export class InsertTableRowOperationBase {
    constructor(modelManager, subDocument) {
        this.modelManager = modelManager;
        this.subDocument = subDocument;
    }
    get modelManipulator() { return this.modelManager.modelManipulator; }
    execute(table, patternRowIndex) {
        let patternRow = table.rows[patternRowIndex];
        let insertParagraphsPositionInfo = this.getInsertParagraphsPositionInfo(table, patternRowIndex);
        this.insertParagraphs(this.subDocument, insertParagraphsPositionInfo, patternRow);
        patternRowIndex = this.insertRowsCore(table, patternRowIndex);
        this.correctVerticalMerging(this.subDocument, table, patternRowIndex);
    }
    insertParagraphs(subDocument, insertPosition, patternRow) {
        const patternCells = patternRow.cells;
        const propertyBundles = {};
        for (let i = patternCells.length - 1, patternCell; patternCell = patternCells[i]; i--) {
            const pos = patternCell.startParagraphPosition.value;
            const patternCellRun = subDocument.getRunByPosition(pos);
            const patternCellParagraph = subDocument.getParagraphByPosition(pos);
            propertyBundles[i] = {
                charBundle: patternCellRun.getCharPropsBundle(subDocument.documentModel),
                paragraphBundle: patternCellParagraph.getParagraphBundleFull(subDocument.documentModel)
            };
        }
        let needShiftCellContent = !!insertPosition.cell;
        for (let i = patternCells.length - 1; i >= 0; i--) {
            const propertyBundle = propertyBundles[i];
            this.modelManager.history.addAndRedo(new InsertParagraphHistoryItem(this.modelManager.modelManipulator, new InsertParagraphManipulatorParams(new SubDocumentPosition(subDocument, insertPosition.position), propertyBundle.charBundle, propertyBundle.paragraphBundle)));
            if (needShiftCellContent) {
                this.modelManipulator.table.shiftContent(this.subDocument, insertPosition.cell);
                needShiftCellContent = false;
            }
        }
    }
}
export class InsertTableRowAboveOperation extends InsertTableRowOperationBase {
    insertRowsCore(table, patternRowIndex) {
        var newCellsIntervals = [];
        var patternRow = table.rows[patternRowIndex];
        var newCellStartPosition = patternRow.getStartPosition();
        var cellsCount = patternRow.cells.length;
        for (var i = 0; i < cellsCount; i++)
            newCellsIntervals.push(new FixedInterval(newCellStartPosition + i, 1));
        this.modelManager.history.addAndRedo(new InsertTableRowHistoryItem(this.modelManager.modelManipulator, this.subDocument, table.index, table.rows[patternRowIndex], patternRowIndex, newCellsIntervals));
        return patternRowIndex + 1;
    }
    getInsertParagraphsPositionInfo(table, patternRowIndex) {
        return {
            cell: table.rows[patternRowIndex].cells[0],
            position: table.rows[patternRowIndex].getStartPosition()
        };
    }
    correctVerticalMerging(subDocument, table, patternRowIndex) {
        let patternRow = table.rows[patternRowIndex];
        for (let i = 0, patternCell; patternCell = patternRow.cells[i]; i++) {
            if (patternCell.verticalMerging === TableCellMergingState.Restart)
                this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, subDocument, table.index, patternRowIndex - 1, i, TableCellMergingState.None));
        }
    }
}
export class InsertTableRowBelowOperation extends InsertTableRowOperationBase {
    insertRowsCore(table, patternRowIndex) {
        var newCellsIntervals = [];
        var patternRow = table.rows[patternRowIndex];
        var newCellStartPosition = patternRow.getEndPosition();
        var cellsCount = patternRow.cells.length;
        for (var i = 0; i < cellsCount; i++)
            newCellsIntervals.push(new FixedInterval(newCellStartPosition + i, 1));
        this.modelManager.history.addAndRedo(new InsertTableRowHistoryItem(this.modelManager.modelManipulator, this.subDocument, table.index, table.rows[patternRowIndex], patternRowIndex + 1, newCellsIntervals));
        return patternRowIndex;
    }
    getInsertParagraphsPositionInfo(table, patternRowIndex) {
        return {
            cell: table.rows[patternRowIndex + 1] ? table.rows[patternRowIndex + 1].cells[0] : null,
            position: table.rows[patternRowIndex].getEndPosition()
        };
    }
    correctVerticalMerging(subDocument, table, patternRowIndex) {
        let patternRow = table.rows[patternRowIndex];
        let newRowIndex = patternRowIndex + 1;
        let nextRow = table.rows[newRowIndex + 1];
        for (let i = 0, patternCell; patternCell = patternRow.cells[i]; i++) {
            if (patternCell.verticalMerging === TableCellMergingState.Continue) {
                if (!nextRow)
                    this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, subDocument, table.index, newRowIndex, i, TableCellMergingState.None));
                else {
                    let sourceCellStartColumnIndex = TableCellUtils.getStartColumnIndex(patternCell);
                    let indexInNextRow = TableCellUtils.getAbsoluteCellIndexInRow(nextRow, sourceCellStartColumnIndex);
                    if (nextRow.cells[indexInNextRow].verticalMerging !== TableCellMergingState.Continue)
                        this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, subDocument, table.index, newRowIndex, i, TableCellMergingState.None));
                }
            }
            else if (patternCell.verticalMerging === TableCellMergingState.Restart)
                this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, subDocument, table.index, newRowIndex, i, TableCellMergingState.Continue));
        }
    }
}
