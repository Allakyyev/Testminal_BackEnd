import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { Calculator } from '../../../layout-formatter/table/grid-engine/calculators/column-width-engine/calculator';
import { BorderInfo } from '../../borders/border-info';
import { BorderLineStyle } from '../../borders/enums';
import { TableStyleChangedSubDocumentChange } from '../../changes/sub-document/style/table-style-changed';
import { TableCellInsertedSubDocumentChange } from '../../changes/sub-document/table/cell-inserted';
import { TableCellMergedHorizontallySubDocumentChange } from '../../changes/sub-document/table/cell-merged-horizontally';
import { TableCellRemovedSubDocumentChange } from '../../changes/sub-document/table/cell-removed';
import { TableCellSplittedHorizontallySubDocumentChange } from '../../changes/sub-document/table/cell-splitted-horizontally';
import { TableCreatedSubDocumentChange } from '../../changes/sub-document/table/created';
import { TableRemovedSubDocumentChange } from '../../changes/sub-document/table/removed';
import { TableRowInsertedSubDocumentChange } from '../../changes/sub-document/table/row-inserted';
import { TableRowRemovedSubDocumentChange } from '../../changes/sub-document/table/row-removed';
import { TableStartPositionShiftedSubDocumentChange } from '../../changes/sub-document/table/start-position-shifted';
import { ParagraphFirstLineIndentHistoryItem, ParagraphFirstLineIndentTypeHistoryItem, ParagraphLeftIndentHistoryItem } from '../../history/items/paragraph-properties-history-items';
import { RemoveIntervalHistoryItem } from '../../history/items/remove-interval-history-item';
import { ShiftTableStartPositionToTheRightHistoryItem } from '../../history/items/tables/change-table-cell-history-items';
import { CreateTableHistoryItem } from '../../history/items/tables/create-table-history-item';
import { RemoveTableCellHistoryItem } from '../../history/items/tables/remove-table-cell-history-item';
import { RemoveTableHistoryItem } from '../../history/items/tables/remove-table-history-item';
import { RemoveTableRowHistoryItem } from '../../history/items/tables/remove-table-row-history-item';
import { TableCellColumnSpanHistoryItem, TableCellPreferredWidthHistoryItem, TableCellVerticalMergingHistoryItem } from '../../history/items/tables/table-cell-properties-history-items';
import { TableBordersHistoryItem, TableLookTypesHistoryItem, TablePreferredWidthHistoryItem } from '../../history/items/tables/table-properties-history-items';
import { TableRowGridAfterHistoryItem, TableRowGridBeforeHistoryItem, TableRowHeightHistoryItem, TableRowWidthAfterHistoryItem, TableRowWidthBeforeHistoryItem } from '../../history/items/tables/table-row-properties-history-items';
import { ModelIterator } from '../../model-iterator';
import { ParagraphFirstLineIndent } from '../../paragraph/paragraph-properties';
import { SubDocumentInterval, SubDocumentPosition } from '../../sub-document';
import { Table, TablePosition } from '../../tables/main-structures/table';
import { TableCell } from '../../tables/main-structures/table-cell';
import { TableRow } from '../../tables/main-structures/table-row';
import { TableCellProperties } from '../../tables/properties/table-cell-properties';
import { TableProperties } from '../../tables/properties/table-properties';
import { TableRowProperties } from '../../tables/properties/table-row-properties';
import { TableCellMergingState, TableLookTypes } from '../../tables/secondary-structures/table-base-structures';
import { TableHeightUnit, TableHeightUnitType, TableWidthUnit, TableWidthUnitType } from '../../tables/secondary-structures/table-units';
import { TableCellUtils } from '../../tables/table-utils';
import { BaseManipulator } from '../base-manipulator';
import { InsertParagraphManipulatorParams } from '../paragraph-manipulator/insert-paragraph-manipulator-params';
import { InsertTableCellToTheLeftOperation, InsertTableCellToTheRightOperation } from './insert-table-cell-operation';
import { InsertTableRowAboveOperation, InsertTableRowBelowOperation } from './insert-table-row-operation';
import { MergeTwoTableCellsHorizontallyOperation, MergeTwoTableCellsVerticallyOperation } from './merge-table-cells-operation';
import { TableCellPropertiesManipulator } from './table-cell-properties-manipulator';
import { TablePropertiesManipulator } from './table-properties-manipulator';
import { TableRowPropertiesManipulator } from './table-row-properties-manipulator';
export class TablesManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.cellProperties = new TableCellPropertiesManipulator(manipulator);
        this.tableProperties = new TablePropertiesManipulator(manipulator);
        this.rowProperties = new TableRowPropertiesManipulator(manipulator);
    }
    static removeTableCore(table, tables, tablesByLevels) {
        const position = table.getStartPosition();
        const tblLevel = tablesByLevels[table.nestedLevel];
        tblLevel.splice(SearchUtils.binaryIndexOf(tblLevel, t => t.getStartPosition() - position), 1);
        tables.splice(table.index, 1);
        Table.advanceIndices(tables, table.index, -1);
    }
    createTable(subDocument, firstParagraphIndex, rowCount, cellCount) {
        let paragraph = subDocument.paragraphs[firstParagraphIndex];
        let parentCell = Table.getTableCellByPosition(subDocument.tables, paragraph.startLogPosition.value);
        let newTable = new Table(new TableProperties(), subDocument.documentModel.getDefaultTableStyle());
        this.createTableStructure(subDocument, firstParagraphIndex, newTable, rowCount, cellCount);
        this.insertTableCore(newTable, subDocument.tables, subDocument.tablesByLevels, parentCell);
        this.modelManipulator.notifyModelChanged(new TableCreatedSubDocumentChange(subDocument.id, newTable));
        return newTable;
    }
    removeTable(subDocument, table) {
        const startPosition = table.getStartPosition();
        const endPosition = table.getEndPosition();
        table.destructor(subDocument.positionManager);
        const removedText = subDocument.getText(table.interval);
        TablesManipulator.removeTableCore(table, subDocument.tables, subDocument.tablesByLevels);
        this.modelManipulator.notifyModelChanged(new TableRemovedSubDocumentChange(subDocument.id, startPosition, endPosition, table.nestedLevel, removedText));
    }
    restoreRemovedTable(subDocument, table, cellsRanges) {
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                let cellRange = cellsRanges[rowIndex][cellIndex];
                cell.startParagraphPosition = subDocument.positionManager.registerPosition(cellRange.start);
                cell.endParagrapPosition = subDocument.positionManager.registerPosition(cellRange.end);
            }
        }
        table.parentCell = Table.getTableCellByPosition(subDocument.tables, table.getStartPosition());
        this.insertTableCore(table, subDocument.tables, subDocument.tablesByLevels, table.parentCell);
        this.modelManipulator.notifyModelChanged(new TableCreatedSubDocumentChange(subDocument.id, table));
    }
    pasteTable(subDocument, patternTable, position) {
        let patternCell = Table.getTableCellByPosition(subDocument.tables, position);
        let newTable = new Table(patternTable.properties, this.model.stylesManager.addTableStyle(patternTable.style));
        newTable.preferredWidth = patternTable.preferredWidth.clone();
        newTable.lookTypes = patternTable.lookTypes;
        for (let rowIndex = 0, patternRow; patternRow = patternTable.rows[rowIndex]; rowIndex++) {
            let newRow = new TableRow(newTable, subDocument.documentModel.cache.tableRowPropertiesCache.getItem(patternRow.properties.clone()));
            newRow.gridAfter = patternRow.gridAfter;
            newRow.gridBefore = patternRow.gridBefore;
            if (patternRow.tablePropertiesException)
                newRow.tablePropertiesException = patternRow.tablePropertiesException.clone();
            newRow.widthAfter = patternRow.widthAfter.clone();
            newRow.widthBefore = patternRow.widthBefore.clone();
            newRow.height = patternRow.height.clone();
            if (patternRow.tablePropertiesException)
                newRow.tablePropertiesException = patternRow.tablePropertiesException.clone();
            for (let cellIndex = 0, patternCell; patternCell = patternRow.cells[cellIndex]; cellIndex++) {
                let cellLength = patternCell.endParagrapPosition.value - patternCell.startParagraphPosition.value;
                let newCell = new TableCell(newRow, subDocument.documentModel.cache.tableCellPropertiesCache.getItem(patternCell.properties.clone()));
                newCell.startParagraphPosition = subDocument.positionManager.registerPosition(position);
                position += cellLength;
                newCell.endParagrapPosition = subDocument.positionManager.registerPosition(position);
                newCell.columnSpan = patternCell.columnSpan;
                newCell.conditionalFormatting = patternCell.conditionalFormatting;
                newCell.verticalMerging = patternCell.verticalMerging;
                newCell.preferredWidth = patternCell.preferredWidth.clone();
                newRow.cells.push(newCell);
            }
            newTable.rows.push(newRow);
        }
        this.insertTableCore(newTable, subDocument.tables, subDocument.tablesByLevels, patternCell);
        this.modelManipulator.notifyModelChanged(new TableCreatedSubDocumentChange(subDocument.id, newTable));
        return newTable;
    }
    insertRow(subDocument, tableIndex, patternRow, targetRowIndex, cellIntervals) {
        var table = subDocument.tables[tableIndex];
        var row = new TableRow(table, patternRow.properties);
        if (cellIntervals.length !== patternRow.cells.length)
            throw new Error("cellIntervals.length should be equal to patternRow.cells.length");
        row.gridAfter = patternRow.gridAfter;
        row.gridBefore = patternRow.gridBefore;
        row.height = patternRow.height.clone();
        row.properties = patternRow.properties;
        row.tablePropertiesException = patternRow.tablePropertiesException;
        row.widthAfter = patternRow.widthAfter.clone();
        row.widthBefore = patternRow.widthBefore.clone();
        for (let i = 0, interval; interval = cellIntervals[i]; i++) {
            let patternCell = patternRow.cells[i];
            let cell = new TableCell(row, patternCell.properties);
            cell.startParagraphPosition = subDocument.positionManager.registerPosition(interval.start);
            cell.endParagrapPosition = subDocument.positionManager.registerPosition(interval.end);
            cell.columnSpan = patternCell.columnSpan;
            cell.conditionalFormatting = patternCell.conditionalFormatting;
            cell.preferredWidth = patternCell.preferredWidth.clone();
            cell.verticalMerging = patternCell.verticalMerging;
            cell.style = patternCell.style;
            row.cells.push(cell);
        }
        table.rows.splice(targetRowIndex, 0, row);
        let nextRow = table.rows[targetRowIndex + 1];
        if (nextRow) {
            subDocument.positionManager.unregisterPosition(nextRow.cells[0].startParagraphPosition);
            nextRow.cells[0].startParagraphPosition = subDocument.positionManager.registerPosition(row.getEndPosition());
        }
        this.modelManipulator.notifyModelChanged(new TableRowInsertedSubDocumentChange(subDocument.id, table, targetRowIndex));
    }
    removeRow(subDocument, tableIndex, rowIndex) {
        const table = subDocument.tables[tableIndex];
        TablesManipulator.removeRowCore(subDocument, table, rowIndex);
        this.modelManipulator.notifyModelChanged(new TableRowRemovedSubDocumentChange(subDocument.id, table, rowIndex));
    }
    static removeRowCore(subDocument, table, rowIndex) {
        const row = table.rows[rowIndex];
        row.destructor(subDocument.positionManager);
        var nextRow = table.rows[rowIndex + 1];
        if (nextRow) {
            var nextRowFirstCell = nextRow.cells[0];
            subDocument.positionManager.unregisterPosition(nextRowFirstCell.startParagraphPosition);
            nextRowFirstCell.startParagraphPosition = subDocument.positionManager.registerPosition(row.getStartPosition());
        }
        table.rows.splice(rowIndex, 1);
    }
    removeCell(subDocument, table, rowIndex, cellIndex) {
        let row = table.rows[rowIndex];
        let cell = row.cells[cellIndex];
        let nextCell = row.cells[cellIndex + 1];
        if (!nextCell && table.rows.length > rowIndex + 1)
            nextCell = table.rows[rowIndex + 1].cells[0];
        cell.destructor(subDocument.positionManager);
        if (nextCell) {
            subDocument.positionManager.unregisterPosition(nextCell.startParagraphPosition);
            nextCell.startParagraphPosition = subDocument.positionManager.registerPosition(cell.startParagraphPosition.value);
        }
        row.cells.splice(cellIndex, 1);
        this.modelManipulator.notifyModelChanged(new TableCellRemovedSubDocumentChange(subDocument.id, table, rowIndex, cellIndex));
    }
    insertCell(subDocument, table, rowIndex, cellIndex, patternCell, length) {
        let row = table.rows[rowIndex];
        var cell = new TableCell(row, patternCell.properties);
        cell.columnSpan = patternCell.columnSpan;
        cell.conditionalFormatting = patternCell.conditionalFormatting;
        cell.preferredWidth = patternCell.preferredWidth.clone();
        cell.style = patternCell.style;
        cell.verticalMerging = patternCell.verticalMerging;
        let startPosition = 0;
        if (cellIndex > 0)
            startPosition = row.cells[cellIndex - 1].endParagrapPosition.value;
        else if (rowIndex > 0)
            startPosition = table.rows[rowIndex - 1].getEndPosition();
        else
            startPosition = table.getStartPosition();
        cell.startParagraphPosition = subDocument.positionManager.registerPosition(startPosition);
        cell.endParagrapPosition = subDocument.positionManager.registerPosition(startPosition + length);
        row.cells.splice(cellIndex, 0, cell);
        let nextCell = row.cells[cellIndex + 1];
        if (!nextCell && table.rows.length > rowIndex + 1)
            nextCell = table.rows[rowIndex + 1].cells[0];
        if (nextCell) {
            subDocument.positionManager.unregisterPosition(nextCell.startParagraphPosition);
            nextCell.startParagraphPosition = subDocument.positionManager.registerPosition(cell.endParagrapPosition.value);
        }
        this.modelManipulator.notifyModelChanged(new TableCellInsertedSubDocumentChange(subDocument.id, table, rowIndex, cellIndex));
    }
    insertParagraphToTheCellStartAndShiftContent(subDocument, cell, inpPos) {
        this.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(subDocument, cell.startParagraphPosition.value), inpPos));
        this.shiftContent(subDocument, cell);
    }
    shiftContent(subDocument, cell) {
        const table = cell.parentRow.parentTable;
        let nextTable = subDocument.tables[table.index + 1];
        let shiftingTables = [];
        while (nextTable && nextTable.nestedLevel > table.nestedLevel) {
            let nextTableStartPosition = nextTable.getStartPosition();
            if (nextTableStartPosition === cell.startParagraphPosition.value)
                shiftingTables.push(nextTable);
            else if (nextTableStartPosition > cell.startParagraphPosition.value)
                break;
            nextTable = subDocument.tables[nextTable.index + 1];
        }
        for (let i = shiftingTables.length - 1, shiftingTable; shiftingTable = shiftingTables[i]; i--) {
            this.history.addAndRedo(new ShiftTableStartPositionToTheRightHistoryItem(this.modelManipulator, subDocument, shiftingTable.index));
        }
    }
    changeTableStartPosition(subDocument, table, newPosition) {
        let cell = table.rows[0].cells[0];
        var oldPosition = cell.startParagraphPosition.value;
        subDocument.positionManager.unregisterPosition(cell.startParagraphPosition);
        cell.startParagraphPosition = subDocument.positionManager.registerPosition(newPosition);
        this.modelManipulator.notifyModelChanged(new TableStartPositionShiftedSubDocumentChange(subDocument.id, table, oldPosition, newPosition));
    }
    shiftTableStartPositionToTheRight(subDocument, table) {
        this.changeTableStartPosition(subDocument, table, table.rows[0].cells[0].startParagraphPosition.value + 1);
    }
    restoreShiftedTableStartPositionToTheRight(subDocument, table) {
        this.changeTableStartPosition(subDocument, table, table.rows[0].cells[0].startParagraphPosition.value - 1);
    }
    splitTableCellHorizontally(subDocument, table, rowIndex, cellIndex, rightDirection, copyProperties) {
        let row = table.rows[rowIndex];
        if (rightDirection)
            this.splitTableCellToTheRightCore(subDocument, row, cellIndex, copyProperties);
        else
            this.splitTableCellToTheLeftCore(subDocument, row, cellIndex, copyProperties);
        this.modelManipulator.notifyModelChanged(new TableCellSplittedHorizontallySubDocumentChange(subDocument.id, table, rowIndex, rightDirection ? cellIndex : (cellIndex + 1), rightDirection));
    }
    restoreSplittedCellHorizontally(subDocument, table, rowIndex, cellIndex, rightDirection) {
        let row = table.rows[rowIndex];
        let targetCell = row.cells[cellIndex];
        let removingCell = rightDirection ? row.cells[cellIndex + 1] : row.cells[cellIndex - 1];
        if (rightDirection) {
            subDocument.positionManager.unregisterPosition(targetCell.endParagrapPosition);
            targetCell.endParagrapPosition = subDocument.positionManager.registerPosition(removingCell.endParagrapPosition.value);
            removingCell.destructor(subDocument.positionManager);
            row.cells.splice(cellIndex + 1, 1);
        }
        else {
            subDocument.positionManager.unregisterPosition(targetCell.startParagraphPosition);
            targetCell.startParagraphPosition = subDocument.positionManager.registerPosition(removingCell.startParagraphPosition.value);
            removingCell.destructor(subDocument.positionManager);
            row.cells.splice(cellIndex - 1, 1);
        }
        this.modelManipulator.notifyModelChanged(new TableCellMergedHorizontallySubDocumentChange(subDocument.id, table, rowIndex, rightDirection ? cellIndex : (cellIndex - 1), rightDirection));
    }
    splitTableCellToTheLeftCore(subDocument, row, splittingCellIndex, copyProperties) {
        if (splittingCellIndex < 0)
            throw new Error("splittingCellIndex should be > 0");
        let splittingCell = row.cells[splittingCellIndex];
        let movingParagraph = subDocument.getParagraphByPosition(splittingCell.startParagraphPosition.value);
        let newTableCell = new TableCell(row, copyProperties ?
            splittingCell.properties : subDocument.documentModel.cache.tableCellPropertiesCache.getItem(new TableCellProperties()));
        newTableCell.preferredWidth = splittingCell.preferredWidth.clone();
        row.cells.splice(splittingCellIndex, 0, newTableCell);
        newTableCell.startParagraphPosition = subDocument.positionManager.registerPosition(movingParagraph.startLogPosition.value);
        newTableCell.endParagrapPosition = subDocument.positionManager.registerPosition(movingParagraph.getEndPosition());
        subDocument.positionManager.unregisterPosition(splittingCell.startParagraphPosition);
        splittingCell.startParagraphPosition = subDocument.positionManager.registerPosition(movingParagraph.getEndPosition());
    }
    splitTableCellToTheRightCore(subDocument, row, splittingCellIndex, copyProperties) {
        if (splittingCellIndex < 0)
            throw new Error("splittingCellIndex should be > 0");
        let splittingCell = row.cells[splittingCellIndex];
        let movingParagraph = subDocument.getParagraphByPosition(splittingCell.endParagrapPosition.value - 1);
        let newTableCell = new TableCell(row, copyProperties ?
            splittingCell.properties : subDocument.documentModel.cache.tableCellPropertiesCache.getItem(new TableCellProperties()));
        newTableCell.preferredWidth = splittingCell.preferredWidth.clone();
        row.cells.splice(splittingCellIndex + 1, 0, newTableCell);
        newTableCell.startParagraphPosition = subDocument.positionManager.registerPosition(movingParagraph.startLogPosition.value);
        newTableCell.endParagrapPosition = subDocument.positionManager.registerPosition(movingParagraph.getEndPosition());
        subDocument.positionManager.unregisterPosition(splittingCell.endParagrapPosition);
        splittingCell.endParagrapPosition = subDocument.positionManager.registerPosition(movingParagraph.startLogPosition.value);
    }
    setTableStyle(subDocument, tableIndex, style) {
        const table = subDocument.tables[tableIndex];
        table.style = style;
        this.resetParagraphCharacterMergedProperties(subDocument, tableIndex);
        this.modelManipulator.notifyModelChanged(new TableStyleChangedSubDocumentChange(subDocument.id, table, style));
    }
    removeTableWithContent(subDocument, table) {
        this.history.beginTransaction();
        this.removeNestedTablesByParentTable(subDocument, table);
        this.history.addAndRedo(new RemoveTableHistoryItem(this.modelManipulator, subDocument, table.index));
        this.history.addAndRedo(new RemoveIntervalHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, FixedInterval.fromPositions(table.getStartPosition(), table.getEndPosition())), false));
        this.history.endTransaction();
    }
    removeTableCellWithContent(subDocument, table, rowIndex, cellIndex) {
        let cell = table.rows[rowIndex].cells[cellIndex];
        this.removeNestedTablesByParentCell(subDocument, cell);
        this.history.addAndRedo(new RemoveTableCellHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex));
        this.history.addAndRedo(new RemoveIntervalHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, cell.interval), false));
    }
    removeTableRowWithContent(subDocument, table, rowIndex) {
        let row = table.rows[rowIndex];
        this.removeNestedTables(subDocument, row);
        this.updateVerticalMergingState(subDocument, table, rowIndex);
        this.history.addAndRedo(new RemoveTableRowHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex));
        this.history.addAndRedo(new RemoveIntervalHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, FixedInterval.fromPositions(row.getStartPosition(), row.getEndPosition())), false));
    }
    updateVerticalMergingState(subDocument, table, rowIndex) {
        let row = table.rows[rowIndex];
        for (let cellIndex = row.cells.length - 1, cell; cell = row.cells[cellIndex]; cellIndex--) {
            if (cell.verticalMerging !== TableCellMergingState.None) {
                let columnIndex = TableCellUtils.getStartColumnIndex(cell);
                let nextRow = table.rows[rowIndex + 1];
                let nextRowCellIndex = nextRow ? TableCellUtils.getCellIndexByColumnIndex(nextRow, columnIndex) : -1;
                let nextRowCell = nextRow ? nextRow.cells[nextRowCellIndex] : null;
                if (cell.verticalMerging == TableCellMergingState.Restart) {
                    if (nextRowCell) {
                        let afterNextRow = table.rows[rowIndex + 2];
                        let afterNextRowCell = afterNextRow ? afterNextRow.cells[TableCellUtils.getCellIndexByEndColumnIndex(afterNextRow, columnIndex)] : null;
                        if (afterNextRowCell && afterNextRowCell.verticalMerging === TableCellMergingState.Continue)
                            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex + 1, nextRowCellIndex, TableCellMergingState.Restart));
                        else
                            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex + 1, nextRowCellIndex, TableCellMergingState.None));
                    }
                }
                else if (cell.verticalMerging == TableCellMergingState.Continue && rowIndex > 0) {
                    let prevRow = table.rows[rowIndex - 1];
                    let prevRowCellIndex = TableCellUtils.getCellIndexByColumnIndex(prevRow, columnIndex);
                    let prevRowCell = prevRow.cells[prevRowCellIndex];
                    if (prevRowCell && prevRowCell.verticalMerging === TableCellMergingState.Restart) {
                        if (!nextRowCell || nextRowCell.verticalMerging !== TableCellMergingState.Continue)
                            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex - 1, prevRowCellIndex, TableCellMergingState.None));
                    }
                }
            }
        }
    }
    removeNestedTables(subDocument, row) {
        let nextNestedTable = subDocument.tables[row.parentTable.index + 1];
        let nestedTables = [];
        while (nextNestedTable && nextNestedTable.nestedLevel > row.parentTable.nestedLevel) {
            if (this.isNestedTableInRow(nextNestedTable, row))
                nestedTables.push(nextNestedTable);
            nextNestedTable = subDocument.tables[nextNestedTable.index + 1];
        }
        for (let i = nestedTables.length - 1, nestedTable; nestedTable = nestedTables[i]; i--)
            this.history.addAndRedo(new RemoveTableHistoryItem(this.modelManipulator, subDocument, nestedTable.index));
    }
    isNestedTableInRow(table, parentRow) {
        return table.parentCell && (table.parentCell.parentRow === parentRow || this.isNestedTableInRow(table.parentCell.parentRow.parentTable, parentRow));
    }
    removeNestedTablesByParentTable(subDocument, parentTable) {
        let nextNestedTable = subDocument.tables[parentTable.index + 1];
        let nestedTables = [];
        while (nextNestedTable && nextNestedTable.nestedLevel > parentTable.nestedLevel) {
            if (this.isNestedTableInTable(nextNestedTable, parentTable))
                nestedTables.push(nextNestedTable);
            nextNestedTable = subDocument.tables[nextNestedTable.index + 1];
        }
        for (let i = nestedTables.length - 1, nestedTable; nestedTable = nestedTables[i]; i--)
            this.history.addAndRedo(new RemoveTableHistoryItem(this.modelManipulator, subDocument, nestedTable.index));
    }
    removeNestedTablesByParentCell(subDocument, parentCell) {
        let nextNestedTable = subDocument.tables[parentCell.parentRow.parentTable.index + 1];
        let nestedTables = [];
        while (nextNestedTable && nextNestedTable.nestedLevel > parentCell.parentRow.parentTable.nestedLevel) {
            if (this.isNestedTableInCell(nextNestedTable, parentCell))
                nestedTables.push(nextNestedTable);
            nextNestedTable = subDocument.tables[nextNestedTable.index + 1];
        }
        for (let i = nestedTables.length - 1, nestedTable; nestedTable = nestedTables[i]; i--)
            this.history.addAndRedo(new RemoveTableHistoryItem(this.modelManipulator, subDocument, nestedTable.index));
    }
    isNestedTableInCell(table, parentCell) {
        return table.parentCell && (table.parentCell === parentCell || this.isNestedTableInCell(table.parentCell.parentRow.parentTable, parentCell));
    }
    isNestedTableInTable(table, parentTable) {
        return table.parentCell && (table.parentCell.parentRow.parentTable === parentTable || this.isNestedTableInTable(table.parentCell.parentRow.parentTable, parentTable));
    }
    normalizeVerticalSpans(subDocument, table) {
        let rowCount = table.rows.length;
        if (rowCount === 1) {
            let row = table.rows[0];
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                if (cell.verticalMerging !== TableCellMergingState.None)
                    this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, 0, cellIndex, TableCellMergingState.None));
            }
            return;
        }
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            let row = table.rows[rowIndex];
            let columnIndex = row.gridBefore;
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                switch (cell.verticalMerging) {
                    case TableCellMergingState.Restart:
                        if (rowIndex == rowCount - 1)
                            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                        else {
                            let bottomCellIndex = TableCellUtils.getCellIndexByColumnIndex(table.rows[rowIndex + 1], columnIndex);
                            let bottomCell = table.rows[rowIndex + 1].cells[bottomCellIndex];
                            if (!bottomCell || bottomCell.verticalMerging !== TableCellMergingState.Continue)
                                this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                        }
                        break;
                    case TableCellMergingState.Continue:
                        if (rowIndex === 0)
                            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                        else {
                            let topCellIndex = TableCellUtils.getCellIndexByColumnIndex(table.rows[rowIndex - 1], columnIndex);
                            let topCell = table.rows[rowIndex - 1].cells[topCellIndex];
                            if (!topCell || topCell.verticalMerging === TableCellMergingState.None) {
                                if (rowIndex == rowCount - 1)
                                    this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                                else {
                                    let bottomCellIndex = TableCellUtils.getCellIndexByColumnIndex(table.rows[rowIndex + 1], columnIndex);
                                    let bottomCell = table.rows[rowIndex + 1].cells[bottomCellIndex];
                                    if (bottomCell && bottomCell.verticalMerging == TableCellMergingState.Continue)
                                        this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.Restart));
                                    else
                                        this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, cellIndex, TableCellMergingState.None));
                                }
                            }
                        }
                        break;
                }
                columnIndex += cell.columnSpan;
            }
        }
    }
    normalizeTableGrid(subDocument, table) {
        var maxEndColumnIndex = -1;
        for (let i = 0, row; row = table.rows[i]; i++) {
            maxEndColumnIndex = Math.max(maxEndColumnIndex, row.getTotalCellsInRowConsiderGrid() - 1);
        }
        for (let i = 0, row; row = table.rows[i]; i++) {
            let currentEndColumnIndex = row.getTotalCellsInRowConsiderGrid() - 1;
            let gridAfterDelta = maxEndColumnIndex - currentEndColumnIndex;
            if (gridAfterDelta != 0)
                this.history.addAndRedo(new TableRowGridAfterHistoryItem(this.modelManipulator, subDocument, table.index, i, row.gridAfter + gridAfterDelta));
        }
    }
    normalizeCellColumnSpans(subDocument, table, canNormalizeWidthBeforeAndWidthAfter) {
        TablesManipulator.normalizeRowsGridBefore(table, canNormalizeWidthBeforeAndWidthAfter, (t, ri, val) => this.history.addAndRedo(new TableRowGridBeforeHistoryItem(this.modelManipulator, subDocument, t.index, ri, val)), (t, ri, val) => this.history.addAndRedo(new TableRowGridAfterHistoryItem(this.modelManipulator, subDocument, t.index, ri, val)), (t, ri, val) => this.history.addAndRedo(new TableRowWidthBeforeHistoryItem(this.modelManipulator, subDocument, t.index, ri, val)), (t, ri, val) => this.history.addAndRedo(new TableRowWidthAfterHistoryItem(this.modelManipulator, subDocument, t.index, ri, val)));
        const intervals = Calculator.getIntervals(table);
        for (let i = table.rows.length - 1; i >= 0; i--) {
            TablesManipulator.normalizeTableRow(table, i, intervals.slice(0), (t, ri, val) => this.history.addAndRedo(new TableRowGridBeforeHistoryItem(this.modelManipulator, subDocument, t.index, ri, val)), (t, ri, val) => this.history.addAndRedo(new TableRowGridAfterHistoryItem(this.modelManipulator, subDocument, t.index, ri, val)), (t, ri, ci, val) => this.history.addAndRedo(new TableCellColumnSpanHistoryItem(this.modelManipulator, subDocument, t.index, ri, ci, val)));
        }
    }
    static normalizeCellColumnSpansWithoutHistory(table, canNormalizeWidthBeforeAndWidthAfter) {
        TablesManipulator.normalizeRowsGridBefore(table, canNormalizeWidthBeforeAndWidthAfter, (t, ri, val) => t.rows[ri].gridBefore = val, (t, ri, val) => t.rows[ri].gridAfter = val, (t, ri, val) => t.rows[ri].widthBefore = val, (t, ri, val) => t.rows[ri].widthAfter = val);
        const intervals = Calculator.getIntervals(table);
        for (let i = table.rows.length - 1; i >= 0; i--) {
            TablesManipulator.normalizeTableRow(table, i, intervals.slice(0), (t, ri, val) => t.rows[ri].gridBefore = val, (t, ri, val) => t.rows[ri].gridAfter = val, (t, ri, ci, val) => t.rows[ri].cells[ci].columnSpan = val);
        }
    }
    static normalizeTableRow(table, rowIndex, intervals, setGridBefore, setGridAfter, setColumnSpan) {
        let row = table.rows[rowIndex];
        let span = TablesManipulator.calculateNewSpan(row.gridBefore, intervals);
        if (row.gridBefore != span)
            setGridBefore(table, rowIndex, span);
        for (let i = 0, cell; cell = row.cells[i]; i++) {
            span = TablesManipulator.calculateNewSpan(cell.columnSpan, intervals);
            if (cell.columnSpan !== span)
                setColumnSpan(table, rowIndex, i, span);
        }
        span = TablesManipulator.calculateNewSpan(row.gridAfter, intervals);
        if (row.gridAfter !== span)
            setGridAfter(table, rowIndex, span);
    }
    static calculateNewSpan(oldSpan, intervals) {
        let result = 0;
        let totalSum = 0;
        while (totalSum < oldSpan) {
            totalSum += intervals[0].colSpan;
            result++;
            intervals.splice(0, 1);
        }
        return result;
    }
    static normalizeRowsGridBefore(table, canNormalizeWidthBeforeAndWidthAfter, setGridBefore, setGridAfter, setWidthBefore, setWidthAfter) {
        let minGridBefore = table.rows[0].gridBefore;
        let minGridAfter = table.rows[0].gridAfter;
        for (let i = 1, row; row = table.rows[i]; i++) {
            minGridBefore = Math.min(minGridBefore, row.gridBefore);
            minGridAfter = Math.min(minGridAfter, row.gridAfter);
        }
        if (minGridBefore == 0 && minGridAfter == 0)
            return;
        for (let i = 0, row; row = table.rows[i]; i++) {
            if (minGridBefore !== 0)
                setGridBefore(table, i, row.gridBefore - minGridBefore);
            if (row.gridBefore === 0 && (row.widthBefore.type != TableWidthUnitType.Nil || row.widthBefore.value != 0) && canNormalizeWidthBeforeAndWidthAfter)
                setWidthBefore(table, i, TableWidthUnit.createDefault());
            if (minGridAfter != 0)
                setGridAfter(table, i, row.gridAfter - minGridAfter);
            if (row.gridAfter == 0 && (row.widthAfter.type != TableWidthUnitType.Nil || row.widthAfter.value != 0) && canNormalizeWidthBeforeAndWidthAfter)
                setWidthAfter(table, i, TableWidthUnit.createDefault());
        }
    }
    normalizeTableCellWidth(subDocument, table) {
        const maxWidth = 5000;
        for (let i = 0, row; row = table.rows[i]; i++) {
            let totalWidth = 0;
            let tableCellPreferredWidths = [];
            for (let j = 0, cell; cell = row.cells[j]; j++) {
                let tableCellPreferredWidth = cell.preferredWidth;
                tableCellPreferredWidths.push(tableCellPreferredWidth);
                if (tableCellPreferredWidth.type === TableWidthUnitType.FiftiethsOfPercent)
                    totalWidth += tableCellPreferredWidth.value;
                else {
                    totalWidth = 0;
                    break;
                }
            }
            if (totalWidth <= maxWidth)
                continue;
            for (let j = 0; j < row.cells.length; j++) {
                let newValue = tableCellPreferredWidths[j].value * maxWidth / totalWidth;
                let newWidth = tableCellPreferredWidths[j].clone();
                newWidth.value = newValue;
                this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, i, j, newWidth));
            }
        }
    }
    createTableStructure(subDocument, paragraphIndex, newTable, rowCount, cellCount) {
        let paragraph = subDocument.paragraphs[paragraphIndex];
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            let row = new TableRow(newTable, subDocument.documentModel.cache.tableRowPropertiesCache.getItem(new TableRowProperties()));
            newTable.rows.push(row);
            for (let cellIndex = 0; cellIndex < cellCount; cellIndex++) {
                let cell = new TableCell(row, subDocument.documentModel.cache.tableCellPropertiesCache.getItem(new TableCellProperties()));
                row.cells.push(cell);
                cell.startParagraphPosition = subDocument.positionManager.registerPosition(paragraph.startLogPosition.value);
                cell.endParagrapPosition = subDocument.positionManager.registerPosition(paragraph.getEndPosition());
                paragraph = subDocument.paragraphs[++paragraphIndex];
            }
        }
    }
    fullCellWidth(widths, startSpan, cellSpan) {
        return ListUtils.accumulate(widths, 0, (acc, w) => acc + w, startSpan, startSpan + cellSpan);
    }
    initializeColumnWidthsWhenInsertTable(subDocument, table, avaliableSpace) {
        this.history.addAndRedo(new TablePreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, TableWidthUnit.create(0, TableWidthUnitType.Auto)));
        const widths = this.distributeWidthsToAllColumns(table, avaliableSpace);
        this.forEachCell(table, (pos, cellSpan) => {
            this.history.addAndRedo(new TableCellPreferredWidthHistoryItem(this.modelManipulator, subDocument, table.index, pos.rowIndex, pos.cellIndex, TableWidthUnit.create(this.fullCellWidth(widths, cellSpan, pos.cell.columnSpan), TableWidthUnitType.ModelUnits)));
        });
    }
    validateTableIndent(subDocument, table) {
        let paragraphIndex = subDocument.getParagraphIndexByPosition(table.getStartPosition());
        let paragraph = subDocument.paragraphs[paragraphIndex];
        let leftIndent = paragraph.getParagraphMergedProperties().leftIndent;
        let firstLineIndent = paragraph.getParagraphMergedProperties().firstLineIndent;
        let firstLineIndentType = paragraph.getParagraphMergedProperties().firstLineIndentType;
        if (leftIndent === 0 && firstLineIndent === 0 && firstLineIndentType === ParagraphFirstLineIndent.None)
            return;
        let endParagraphIndex = subDocument.getParagraphIndexByPosition(table.getEndPosition() - 1);
        for (; paragraphIndex <= endParagraphIndex; paragraphIndex++) {
            paragraph = subDocument.paragraphs[paragraphIndex];
            this.history.addAndRedo(new ParagraphLeftIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), 0, true));
            this.history.addAndRedo(new ParagraphFirstLineIndentHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), 0, true));
            this.history.addAndRedo(new ParagraphFirstLineIndentTypeHistoryItem(this.modelManipulator, new SubDocumentInterval(subDocument, paragraph.interval), ParagraphFirstLineIndent.None, true));
        }
    }
    tryJoinTables(subDocument, table) {
        let paragraphIndex = subDocument.getParagraphIndexByPosition(table.getStartPosition());
        if (paragraphIndex === 0)
            return;
        let previousParagraph = subDocument.paragraphs[paragraphIndex - 1];
        let previousParagraphCell = Table.getTableCellByPosition(subDocument.tables, previousParagraph.startLogPosition.value);
        if (!previousParagraphCell || table.nestedLevel !== previousParagraphCell.parentRow.parentTable.nestedLevel)
            return;
        this.joinTablesCore(subDocument, [previousParagraphCell.parentRow.parentTable, table]);
    }
    joinTablesCore(_subDocument, tables) {
        if (tables.length < 2)
            throw new Error("tables.length should be > 2");
    }
    forEachCell(table, func) {
        const pos = new TablePosition(table, -1, -1);
        while (pos.moveToNextRow()) {
            let cellSpan = pos.row.gridBefore;
            while (pos.moveToNextCell()) {
                func(pos, cellSpan);
                cellSpan += pos.cell.columnSpan;
            }
        }
    }
    distributeWidthsToAllColumns(table, width) {
        const count = table.getTotalVirtualColumnsCount();
        const colWidth = Math.max(Math.ceil(width / count), 1);
        const result = ListUtils.initByValue(count - 1, colWidth);
        result.push(Math.max(1, Math.ceil(width - colWidth * (count - 1))));
        return result;
    }
    insertTableCore(table, tables, tablesByLevels, parentCell) {
        table.nestedLevel = parentCell ? parentCell.parentRow.parentTable.nestedLevel + 1 : 0;
        table.parentCell = parentCell;
        let position = table.getStartPosition();
        if (!tablesByLevels[table.nestedLevel])
            tablesByLevels[table.nestedLevel] = [];
        let indexInNestedLevel = SearchUtils.normedInterpolationIndexOf(tablesByLevels[table.nestedLevel], t => t.getStartPosition(), position);
        tablesByLevels[table.nestedLevel].splice(indexInNestedLevel + 1, 0, table);
        if (!parentCell)
            table.index = Math.max(0, SearchUtils.normedInterpolationIndexOf(tables, t => t.getStartPosition(), position) + 1);
        else {
            let parentTable = parentCell.parentRow.parentTable;
            let index = parentTable.index + 1;
            for (let nextTable; nextTable = tables[index]; index++) {
                if (nextTable.getStartPosition() >= position)
                    break;
            }
            table.index = index;
        }
        tables.splice(table.index, 0, table);
        Table.advanceIndices(tables, table.index + 1, 1);
    }
    normalizeVerticalMerging(subDocument, table, rowIndex, cellIndex) {
        let row = table.rows[rowIndex];
        for (let nextCellIndex = cellIndex + 1, nextCell; nextCell = row.cells[nextCellIndex]; nextCellIndex++) {
            if (nextCell.verticalMerging === TableCellMergingState.None)
                continue;
            let nextCellVerticalMerging = nextCell.verticalMerging;
            let firstCellInMergingGroupPosition = Table.getFirstCellPositionInVerticalMergingGroup(TablePosition.createAndInit(table, rowIndex, nextCellIndex).init());
            let startColumnIndex = TableCellUtils.getStartColumnIndex(firstCellInMergingGroupPosition.cell);
            let verticalSpanCellPositions = TableCellUtils.getVerticalSpanCellPositions(firstCellInMergingGroupPosition, startColumnIndex);
            this.history.addAndRedo(new TableCellVerticalMergingHistoryItem(this.modelManipulator, subDocument, table.index, rowIndex, nextCellIndex, TableCellMergingState.None));
            if (nextCellVerticalMerging === TableCellMergingState.Restart) {
                if (verticalSpanCellPositions.length > 2)
                    this.history.addAndRedo(TableCellVerticalMergingHistoryItem.fromPosition(this.modelManipulator, subDocument, verticalSpanCellPositions[1], TableCellMergingState.Restart));
                else {
                    this.history.addAndRedo(TableCellVerticalMergingHistoryItem.fromPosition(this.modelManipulator, subDocument, verticalSpanCellPositions[0], TableCellMergingState.None));
                    this.history.addAndRedo(TableCellVerticalMergingHistoryItem.fromPosition(this.modelManipulator, subDocument, verticalSpanCellPositions[1], TableCellMergingState.None));
                }
            }
            else {
                let nextCellIndexInMergingGroup = TablePosition.indexOfCell(verticalSpanCellPositions, nextCell);
                if (nextCellIndexInMergingGroup === 1)
                    this.history.addAndRedo(TableCellVerticalMergingHistoryItem.fromPosition(this.modelManipulator, subDocument, verticalSpanCellPositions[0], TableCellMergingState.None));
                if (verticalSpanCellPositions.length - 2 === nextCellIndexInMergingGroup)
                    this.history.addAndRedo(TableCellVerticalMergingHistoryItem.fromPosition(this.modelManipulator, subDocument, verticalSpanCellPositions[verticalSpanCellPositions.length - 1], TableCellMergingState.None));
                else if (verticalSpanCellPositions.length - 1 !== nextCellIndexInMergingGroup)
                    this.history.addAndRedo(TableCellVerticalMergingHistoryItem.fromPosition(this.modelManipulator, subDocument, verticalSpanCellPositions[nextCellIndexInMergingGroup + 1], TableCellMergingState.Restart));
            }
        }
    }
    normalizeRows(subDocument, table) {
        for (let i = table.rows.length - 1, row; row = table.rows[i]; i--) {
            if (this.areAllCellsHasVerticalMerge(row)) {
                let height = row.height;
                if (height.type !== TableHeightUnitType.Auto && i > 0) {
                    let prevRowHeight = table.rows[i - 1].height;
                    this.history.addAndRedo(new TableRowHeightHistoryItem(this.modelManipulator, subDocument, table.index, i - 1, TableHeightUnit.create(prevRowHeight.value + height.value, height.type)));
                }
                this.removeTableRowWithContent(subDocument, table, i);
            }
        }
    }
    areAllCellsHasVerticalMerge(row) {
        for (let i = 0, cell; cell = row.cells[i]; i++) {
            if (cell.verticalMerging !== TableCellMergingState.Continue)
                return false;
        }
        return true;
    }
    mergeTwoTableCellsHorizontally(subDocument, cellPosition, inpPos) {
        new MergeTwoTableCellsHorizontallyOperation(this.modelManipulator.modelManager, subDocument).execute(cellPosition, true, inpPos);
    }
    mergeTwoTableCellsVertically(subDocument, cellPosition, inpPos) {
        new MergeTwoTableCellsVerticallyOperation(this.modelManipulator.modelManager, subDocument).execute(cellPosition, true, inpPos);
    }
    insertCellToTheRight(subDocument, table, rowIndex, cellIndex, inpPos, canNormalizeTable = true, canNormalizeVerticalMerging = true, canCopyProperties = true) {
        new InsertTableCellToTheRightOperation(this.modelManipulator.modelManager, subDocument)
            .execute(table, rowIndex, cellIndex, canNormalizeTable, canNormalizeVerticalMerging, canCopyProperties, inpPos);
    }
    insertCellToTheLeft(subDocument, table, rowIndex, cellIndex, inpPos, canNormalizeTable = true, canNormalizeVerticalMerging = true, canCopyProperties = true) {
        new InsertTableCellToTheLeftOperation(this.modelManipulator.modelManager, subDocument)
            .execute(table, rowIndex, cellIndex, canNormalizeTable, canNormalizeVerticalMerging, canCopyProperties, inpPos);
    }
    insertRowBelow(subDocument, table, rowIndex) {
        new InsertTableRowBelowOperation(this.modelManipulator.modelManager, subDocument).execute(table, rowIndex);
    }
    insertRowAbove(subDocument, table, rowIndex) {
        new InsertTableRowAboveOperation(this.modelManipulator.modelManager, subDocument).execute(table, rowIndex);
    }
    insertTable(subDocument, rowCount, cellCount, position, availableWidth, inpPos, applyInitialBorders = false) {
        if (rowCount < 1 || cellCount < 1)
            throw new Error("rowCount and cellCount must be greater than 0");
        this.history.beginTransaction();
        let targetParagraphIndex = subDocument.getParagraphIndexByPosition(position);
        let targetParagraph = subDocument.paragraphs[targetParagraphIndex];
        if (targetParagraph.startLogPosition.value !== position || SearchUtils.binaryIndexOf(subDocument.tables, t => t.getEndPosition() - position) >= 0) {
            this.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(subDocument, position), inpPos));
            position++;
            targetParagraphIndex++;
        }
        let newParagraphCount = rowCount * cellCount;
        for (let i = 0; i < newParagraphCount; i++)
            this.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(subDocument, position + i), inpPos));
        this.history.addAndRedo(new CreateTableHistoryItem(this.modelManipulator, subDocument, targetParagraphIndex, rowCount, cellCount));
        const table = Table.getTableByPosition(subDocument.tables, position, true);
        this.initializeColumnWidthsWhenInsertTable(subDocument, table, availableWidth);
        this.validateTableIndent(subDocument, table);
        this.history.addAndRedo(new TableLookTypesHistoryItem(this.modelManipulator, subDocument, table.index, TableLookTypes.ApplyFirstRow | TableLookTypes.ApplyFirstColumn | TableLookTypes.DoNotApplyColumnBanding));
        this.tryJoinTables(subDocument, table);
        if (applyInitialBorders)
            this.applyInitialBorders(subDocument, table);
        this.history.endTransaction();
        return table;
    }
    applyInitialBorders(subDocument, table) {
        let newTableBorder = new BorderInfo();
        newTableBorder.style = BorderLineStyle.Single;
        newTableBorder.width = 15;
        newTableBorder.color = this.model.colorProvider.getModelColorFromRgba(0);
        this.history.addAndRedo(new TableBordersHistoryItem(this.modelManipulator, subDocument, table.index, [
            newTableBorder.clone(), newTableBorder.clone(), newTableBorder.clone(), newTableBorder.clone(),
            newTableBorder.clone(), newTableBorder.clone()
        ], [true, true, true, true, true, true]));
    }
    removeTablesOnInterval(subDocInterval, removeTableIfItMatchesWithInterval) {
        const subDocument = subDocInterval.subDocument;
        const interval = subDocInterval.interval;
        let intervalEnd = interval.end;
        let startTableIndex = Math.max(SearchUtils.normedInterpolationIndexOf(subDocument.tables, t => t.getStartPosition(), interval.start), 0);
        while (startTableIndex > 0 && subDocument.tables[startTableIndex].nestedLevel > 0)
            startTableIndex--;
        let tablesForRemoving = [];
        for (let tableIndex = startTableIndex, table; table = subDocument.tables[tableIndex]; tableIndex++) {
            let tableStartPosition = table.getStartPosition();
            if (intervalEnd <= tableStartPosition)
                break;
            let tableEndPosition = table.getEndPosition();
            const tblInterval = table.interval;
            if (tableStartPosition === interval.start && tableEndPosition === intervalEnd) {
                if (removeTableIfItMatchesWithInterval)
                    tablesForRemoving.push(table);
            }
            else if (interval.containsInterval(tblInterval))
                tablesForRemoving.push(table);
        }
        for (let i = tablesForRemoving.length - 1; i >= 0; i--)
            this.history.addAndRedo(new RemoveTableHistoryItem(this.modelManipulator, subDocument, tablesForRemoving[i].index));
    }
    resetParagraphCharacterMergedProperties(subDocument, tableIndex) {
        const table = subDocument.tables[tableIndex];
        const tableStartPosition = table.getStartPosition();
        const tableEndPosition = table.getEndPosition();
        const modelIterator = new ModelIterator(subDocument, false);
        modelIterator.setPosition(tableStartPosition);
        let currPar = null;
        do {
            const run = modelIterator.run;
            if (currPar != run.paragraph) {
                currPar = run.paragraph;
                if (currPar.startLogPosition.value >= tableEndPosition)
                    break;
                currPar.resetParagraphMergedProperties();
            }
            run.resetCharacterMergedProperties();
        } while (modelIterator.moveToNextRun());
    }
}
