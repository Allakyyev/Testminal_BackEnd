import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ParagraphPropertiesHistoryItem } from '../../history/items/paragraph-properties-history-items';
import { TableCellBordersHistoryItem, TableCellColumnSpanHistoryItem, TableCellPreferredWidthHistoryItem, TableCellShadingInfoHistoryItem, TableCellVerticalAlignmentHistoryItem, TableCellVerticalMergingHistoryItem } from '../../history/items/tables/table-cell-properties-history-items';
import { SubDocumentInterval, SubDocumentPosition } from '../../sub-document';
import { TablePosition } from '../../tables/main-structures/table';
import { TableCellPropertiesMask } from '../../tables/properties/table-cell-properties';
import { TableCellMergingState } from '../../tables/secondary-structures/table-base-structures';
import { TableWidthUnit } from '../../tables/secondary-structures/table-units';
import { TableCellUtils } from '../../tables/table-utils';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
export class MergeTableCellsOperationBase {
    constructor(modelManager, subDocument) {
        this.needDeleteNextTableCell = false;
        this.modelManager = modelManager;
        this.subDocument = subDocument;
    }
    get modelManipulator() { return this.modelManager.modelManipulator; }
    execute(position, suppressNormalizeTableRows, inpPos) {
        let nextCellPosition = this.calculateNextCell(position);
        this.updateCellsProperties(position, nextCellPosition);
        let nextCell = nextCellPosition.cell;
        let cell = position.cell;
        let isEmptyCell = this.isEmptyCell(cell);
        let isEmptyNextCell = this.isEmptyCell(nextCell);
        if (!isEmptyNextCell) {
            let insertPosition = cell.endParagrapPosition.value - 1;
            let nextCellLastParagraph = this.subDocument.paragraphs[this.getCellLastParagraphIndex(nextCell)];
            if (!isEmptyCell) {
                this.modelManager.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(this.subDocument, insertPosition), inpPos));
                insertPosition++;
            }
            this.applyParagraphProperties(this.getCellLastParagraphIndex(cell), nextCellLastParagraph);
            this.modelManager.modelManipulator.range.copyIntervalTo(this.subDocument, FixedInterval.fromPositions(nextCell.startParagraphPosition.value, nextCell.endParagrapPosition.value - 1), insertPosition);
        }
        this.deleteTableCellWithContent(nextCellPosition);
        this.modelManipulator.table.normalizeCellColumnSpans(this.subDocument, position.table, true);
        if (!suppressNormalizeTableRows)
            this.modelManipulator.table.normalizeRows(this.subDocument, cell.parentRow.parentTable);
    }
    getCellLastParagraphIndex(cell) {
        return this.subDocument.getParagraphIndexByPosition(cell.endParagrapPosition.value - 1);
    }
    applyParagraphProperties(targetIndex, source) {
        let target = this.subDocument.paragraphs[targetIndex];
        if (!target.maskedParagraphProperties.equals(source.maskedParagraphProperties) || target.numberingListIndex !== source.numberingListIndex || target.listLevelIndex !== source.listLevelIndex || target.tabs.equals(source.tabs) || target.paragraphStyle !== source.paragraphStyle)
            this.modelManager.history.addAndRedo(new ParagraphPropertiesHistoryItem(this.modelManager.modelManipulator, this.subDocument, targetIndex, source.maskedParagraphProperties, source.paragraphStyle, source.numberingListIndex, source.listLevelIndex, source.tabs));
    }
    deleteTableCellWithContent(nextCellPosition) {
        if (this.needDeleteNextTableCell)
            this.modelManipulator.table.removeTableCellWithContent(this.subDocument, nextCellPosition.table, nextCellPosition.rowIndex, nextCellPosition.cellIndex);
        else {
            let nextCell = nextCellPosition.cell;
            this.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, FixedInterval.fromPositions(nextCell.startParagraphPosition.value, nextCell.endParagrapPosition.value - 1)), true, false);
        }
    }
    isEmptyCell(cell) {
        return cell.endParagrapPosition.value - cell.startParagraphPosition.value === 1;
    }
}
export class MergeTwoTableCellsHorizontallyOperation extends MergeTableCellsOperationBase {
    constructor() {
        super(...arguments);
        this.needDeleteNextTableCell = true;
    }
    calculateNextCell(position) {
        let nextCellIndex = position.cellIndex + 1;
        return TablePosition.createAndInit(position.table, position.rowIndex, nextCellIndex);
    }
    updateCellsProperties(patternCellPosition, nextCellPosition) {
        let patternCell = patternCellPosition.cell;
        let nextCell = nextCellPosition.cell;
        this.modelManager.history.addAndRedo(new TableCellColumnSpanHistoryItem(this.modelManager.modelManipulator, this.subDocument, patternCellPosition.table.index, patternCellPosition.rowIndex, patternCellPosition.cellIndex, patternCell.columnSpan + nextCell.columnSpan));
        let patternCellPreferredWidth = patternCell.preferredWidth;
        let nextCellPreferredWidth = nextCell.preferredWidth;
        if (patternCellPreferredWidth && nextCellPreferredWidth && nextCellPreferredWidth.type === patternCellPreferredWidth.type) {
            let newPreferredWidth = TableWidthUnit.create(patternCellPreferredWidth.value + nextCellPreferredWidth.value, patternCellPreferredWidth.type);
            this.modelManager.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManager.modelManipulator, this.subDocument, patternCellPosition.table.index, patternCellPosition.rowIndex, patternCellPosition.cellIndex, newPreferredWidth));
        }
    }
}
export class MergeTwoTableCellsVerticallyOperation extends MergeTableCellsOperationBase {
    calculateNextCell(position) {
        let nextRowIndex = position.rowIndex + 1;
        let nextRow = position.table.rows[nextRowIndex];
        let columnIndex = TableCellUtils.getStartColumnIndex(position.cell);
        return TablePosition.createAndInit(position.table, nextRowIndex, TableCellUtils.getCellIndexByColumnIndex(nextRow, columnIndex));
    }
    updateCellsProperties(patternCellPosition, nextCellPosition) {
        this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, this.subDocument, patternCellPosition.table.index, patternCellPosition.rowIndex, patternCellPosition.cellIndex, TableCellMergingState.Restart));
        this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, this.subDocument, nextCellPosition.table.index, nextCellPosition.rowIndex, nextCellPosition.cellIndex, TableCellMergingState.Continue));
    }
}
export class InsertTableCellWithShiftToTheDownOperation extends MergeTableCellsOperationBase {
    calculateNextCell(position) {
        return TablePosition.createAndInit(position.table, position.rowIndex - 1, position.cellIndex);
    }
    updateCellsProperties(patternCellPosition, nextCellPosition) {
        let manipulator = this.modelManager.modelManipulator;
        let subDocument = this.subDocument;
        this.modelManager.history.addAndRedo(new TableCellBordersHistoryItem(manipulator, subDocument, patternCellPosition.table.index, patternCellPosition.rowIndex, patternCellPosition.cellIndex, [
            nextCellPosition.cell.properties.borders.topBorder.clone(),
            nextCellPosition.cell.properties.borders.rightBorder.clone(),
            nextCellPosition.cell.properties.borders.bottomBorder.clone(),
            nextCellPosition.cell.properties.borders.leftBorder.clone(),
            nextCellPosition.cell.properties.borders.topLeftDiagonalBorder.clone(),
            nextCellPosition.cell.properties.borders.topRightDiagonalBorder.clone()
        ], [nextCellPosition.cell.properties.getUseValue(TableCellPropertiesMask.UseTopBorder),
            nextCellPosition.cell.properties.getUseValue(TableCellPropertiesMask.UseRightBorder),
            nextCellPosition.cell.properties.getUseValue(TableCellPropertiesMask.UseBottomBorder),
            nextCellPosition.cell.properties.getUseValue(TableCellPropertiesMask.UseLeftBorder),
            nextCellPosition.cell.properties.getUseValue(TableCellPropertiesMask.UseTopLeftDiagonalBorder),
            nextCellPosition.cell.properties.getUseValue(TableCellPropertiesMask.UseTopRightDiagonalBorder)]));
        this.modelManager.history.addAndRedo(new TableCellShadingInfoHistoryItem(manipulator, subDocument, patternCellPosition.table.index, patternCellPosition.rowIndex, patternCellPosition.cellIndex, nextCellPosition.cell.properties.shadingInfo, true));
        this.modelManager.history.addAndRedo(new TableCellVerticalAlignmentHistoryItem(manipulator, subDocument, patternCellPosition.table.index, patternCellPosition.rowIndex, patternCellPosition.cellIndex, nextCellPosition.cell.properties.verticalAlignment, true));
    }
    deleteTableCellWithContent(nextCellPosition) {
        let nextCell = nextCellPosition.cell;
        if (nextCell.endParagrapPosition.value - nextCell.startParagraphPosition.value > 1)
            this.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, FixedInterval.fromPositions(nextCell.startParagraphPosition.value, nextCell.endParagrapPosition.value - 1)), true, false);
    }
}
export class DeleteOneTableCellWithShiftToTheUpOperation extends MergeTwoTableCellsVerticallyOperation {
    execute(position, suppressNormalizeTableRows, inpPos) {
        if (position.rowIndex === position.table.rows.length - 1)
            this.deleteContentFromCell(position.cell);
        else {
            this.deleteContentFromCell(position.cell);
            super.execute(position, suppressNormalizeTableRows, inpPos);
        }
    }
    updateCellsProperties(patternCellPosition, nextCellPosition) {
        if (patternCellPosition.cell.verticalMerging === TableCellMergingState.Restart) {
            this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, this.subDocument, patternCellPosition.table.index, patternCellPosition.rowIndex, patternCellPosition.cellIndex, TableCellMergingState.None));
            if (nextCellPosition.rowIndex === nextCellPosition.table.rows.length - 1)
                this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, this.subDocument, nextCellPosition.table.index, nextCellPosition.rowIndex, nextCellPosition.cellIndex, TableCellMergingState.None));
            else {
                let afterNextCellPosition = this.calculateNextCell(nextCellPosition);
                if (afterNextCellPosition.cell && afterNextCellPosition.cell.verticalMerging === TableCellMergingState.Continue)
                    this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, this.subDocument, nextCellPosition.table.index, nextCellPosition.rowIndex, nextCellPosition.cellIndex, TableCellMergingState.Restart));
                else
                    this.modelManager.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManager.modelManipulator, this.subDocument, nextCellPosition.table.index, nextCellPosition.rowIndex, nextCellPosition.cellIndex, TableCellMergingState.None));
            }
        }
    }
    deleteContentFromCell(cell) {
        let cellInterval = cell.interval;
        if (--cellInterval.length > 0)
            this.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(this.subDocument, cellInterval), true, false);
    }
}
