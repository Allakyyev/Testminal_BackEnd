import { TableCellConditionalFormattingHistoryItem, TableRowConditionalFormattingHistoryItem } from '../history/items/tables/change-table-cell-history-items';
import { TablePosition } from './main-structures/table';
import { TablePropertiesMergerStyleColumnBandSize, TablePropertiesMergerStyleRowBandSize } from './properties-mergers/table-properties-merger';
import { ConditionalTableStyleFormatting, TableCellMergingState, TableLookTypes } from './secondary-structures/table-base-structures';
export class TableCellUtils {
    static getCellIndexByColumnIndex(row, startColumnIndex) {
        let columnIndex = row.gridBefore;
        for (let i = 0, cell; cell = row.cells[i]; i++) {
            if (startColumnIndex >= columnIndex && startColumnIndex < columnIndex + cell.columnSpan)
                return i;
            columnIndex += cell.columnSpan;
        }
        return -1;
    }
    static getCellIndexByEndColumnIndex(row, endColumnIndex) {
        let cellIndexByColumnIndex = this.getCellIndexByColumnIndex(row, endColumnIndex);
        if (cellIndexByColumnIndex < 0)
            return -1;
        let cellByColumnIndex = row.cells[cellIndexByColumnIndex];
        if (this.getStartColumnIndex(cellByColumnIndex) + cellByColumnIndex.columnSpan - 1 <= endColumnIndex)
            return cellIndexByColumnIndex;
        if (cellIndexByColumnIndex != 0)
            return cellIndexByColumnIndex - 1;
        return -1;
    }
    static getStartColumnIndex(cell) {
        let columnIndex = cell.parentRow.gridBefore;
        let row = cell.parentRow;
        for (let i = 0, currentCell; currentCell = row.cells[i]; i++) {
            if (currentCell === cell)
                break;
            columnIndex += currentCell.columnSpan;
        }
        return columnIndex;
    }
    static getEndColumnIndex(cell) {
        return this.getStartColumnIndex(cell) + cell.columnSpan - 1;
    }
    static getColumnCount(table) {
        let row = table.rows[0];
        let result = row.gridBefore + row.gridAfter;
        for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
            result += cell.columnSpan;
        }
        return result;
    }
    static getCellIndicesByColumnsRange(row, interval) {
        let indices = [];
        let startColumnIndex = interval.start;
        while (startColumnIndex < interval.end) {
            let cellIndex = this.getCellIndexByColumnIndex(row, startColumnIndex);
            let cell = row.cells[cellIndex];
            if (!cell)
                return indices;
            indices.push(cellIndex);
            startColumnIndex += startColumnIndex - this.getStartColumnIndex(cell) + cell.columnSpan;
        }
        return indices;
    }
    static getAbsoluteCellIndexInRow(row, columnIndex) {
        if (!row.cells.length)
            throw new Error("Empty row");
        columnIndex -= row.gridBefore;
        let cellIndex = 0;
        let cellsCount = row.cells.length;
        while (columnIndex > 0 && cellIndex < cellsCount) {
            let currentCell = row.cells[cellIndex];
            columnIndex -= currentCell.columnSpan;
            if (columnIndex >= 0)
                cellIndex++;
        }
        return cellIndex;
    }
    static getVerticalSpanCellPositions(restartCellPosition, patternCellStartColumnIndex) {
        let positions = [];
        positions.push(restartCellPosition);
        if (restartCellPosition.cell.verticalMerging !== TableCellMergingState.Restart)
            return positions;
        let table = restartCellPosition.table;
        for (let rowIndex = restartCellPosition.rowIndex + 1, nextRow; nextRow = table.rows[rowIndex]; rowIndex++) {
            let nextRowCellIndex = this.getCellIndexByColumnIndex(nextRow, patternCellStartColumnIndex);
            let nextCell = nextRow.cells[nextRowCellIndex];
            if (nextCell && nextCell.verticalMerging === TableCellMergingState.Continue)
                positions.push(TablePosition.createAndInit(table, rowIndex, nextRowCellIndex));
            else
                break;
        }
        return positions;
    }
    static getSameTableCells(firstCell, lastCell) {
        const rightOrder = firstCell.parentRow.parentTable.nestedLevel >= lastCell.parentRow.parentTable.nestedLevel;
        let topLevelCell = rightOrder ? firstCell : lastCell;
        let lowLevelCell = rightOrder ? lastCell : firstCell;
        while (topLevelCell.parentRow.parentTable.nestedLevel > lowLevelCell.parentRow.parentTable.nestedLevel)
            topLevelCell = topLevelCell.parentRow.parentTable.parentCell;
        while (true) {
            if (topLevelCell.parentRow.parentTable === lowLevelCell.parentRow.parentTable)
                return {
                    firstCell: rightOrder ? topLevelCell : lowLevelCell,
                    lastCell: rightOrder ? lowLevelCell : topLevelCell
                };
            topLevelCell = topLevelCell.parentRow.parentTable.parentCell;
            lowLevelCell = lowLevelCell.parentRow.parentTable.parentCell;
            if (!topLevelCell || !lowLevelCell)
                return null;
        }
    }
}
export class TableConditionalFormattingCalculator {
    static updateTable(control, table, subDocument) {
        let tableStyleColumnBandSize = new TablePropertiesMergerStyleColumnBandSize()
            .getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, control.model.defaultTableProperties);
        let tableStyleRowBandSize = new TablePropertiesMergerStyleRowBandSize()
            .getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, control.model.defaultTableProperties);
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            let rowConditionalFormatting = this.getRowConditionalFormatting(table.lookTypes, tableStyleRowBandSize, table, rowIndex);
            if (row.conditionalFormatting !== rowConditionalFormatting)
                control.history.addAndRedo(new TableRowConditionalFormattingHistoryItem(control.modelManipulator, subDocument, table.index, rowIndex, rowConditionalFormatting));
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                let cellConditionalFormatting = rowConditionalFormatting | this.getCellConditionalFormatting(table.lookTypes, tableStyleColumnBandSize, table, rowIndex, cellIndex);
                if (cell.conditionalFormatting !== cellConditionalFormatting)
                    control.history.addAndRedo(new TableCellConditionalFormattingHistoryItem(control.modelManipulator, subDocument, table.index, rowIndex, cellIndex, cellConditionalFormatting));
            }
        }
    }
    static updateTableWithoutHistory(model, table) {
        let tableStyleColumnBandSize = new TablePropertiesMergerStyleColumnBandSize()
            .getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, model.defaultTableProperties);
        let tableStyleRowBandSize = new TablePropertiesMergerStyleRowBandSize()
            .getProperty(table.properties, table.style, ConditionalTableStyleFormatting.WholeTable, model.defaultTableProperties);
        for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
            row.conditionalFormatting = this.getRowConditionalFormatting(table.lookTypes, tableStyleRowBandSize, table, rowIndex);
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++)
                cell.conditionalFormatting = row.conditionalFormatting |
                    TableConditionalFormattingCalculator.getCellConditionalFormatting(table.lookTypes, tableStyleColumnBandSize, table, rowIndex, cellIndex);
        }
    }
    static getRowConditionalFormatting(tableLook, tableStyleRowBandSize, table, rowIndex) {
        let result = ConditionalTableStyleFormatting.WholeTable;
        if (tableLook & TableLookTypes.ApplyFirstRow) {
            if (rowIndex === 0)
                result |= ConditionalTableStyleFormatting.FirstRow;
        }
        if (tableLook & TableLookTypes.ApplyLastRow) {
            if (rowIndex === table.rows.length - 1)
                result |= ConditionalTableStyleFormatting.LastRow;
        }
        if (!(tableLook & TableLookTypes.DoNotApplyRowBanding) && !(result & ConditionalTableStyleFormatting.FirstRow || result & ConditionalTableStyleFormatting.LastRow)) {
            if (tableLook & TableLookTypes.ApplyFirstRow)
                rowIndex--;
            if (Math.floor(rowIndex / tableStyleRowBandSize) % 2 == 0)
                result |= ConditionalTableStyleFormatting.OddRowBanding;
            else
                result |= ConditionalTableStyleFormatting.EvenRowBanding;
        }
        return result;
    }
    static getCellConditionalFormatting(tableLook, tableStyleColumnBandSize, table, rowIndex, cellIndex) {
        let result = ConditionalTableStyleFormatting.WholeTable;
        let row = table.rows[rowIndex];
        if (tableLook & TableLookTypes.ApplyFirstColumn) {
            if (cellIndex === 0)
                result |= ConditionalTableStyleFormatting.FirstColumn;
        }
        if (tableLook & TableLookTypes.ApplyLastColumn) {
            if (cellIndex === row.cells.length - 1)
                result |= ConditionalTableStyleFormatting.LastColumn;
        }
        if (tableLook & TableLookTypes.ApplyFirstRow && rowIndex === 0) {
            if (tableLook & TableLookTypes.ApplyFirstColumn && cellIndex === 0)
                result |= ConditionalTableStyleFormatting.TopLeftCell;
            if (tableLook & TableLookTypes.ApplyLastColumn && cellIndex === row.cells.length - 1)
                result |= ConditionalTableStyleFormatting.TopRightCell;
        }
        else if (tableLook & TableLookTypes.ApplyLastRow && rowIndex === table.rows.length - 1) {
            if (tableLook & TableLookTypes.ApplyFirstColumn && cellIndex === 0)
                result |= ConditionalTableStyleFormatting.BottomLeftCell;
            if (tableLook & TableLookTypes.ApplyLastColumn && cellIndex === row.cells.length - 1)
                result |= ConditionalTableStyleFormatting.BottomRightCell;
        }
        if (!(tableLook & TableLookTypes.DoNotApplyColumnBanding) && !(result & ConditionalTableStyleFormatting.FirstColumn || result & ConditionalTableStyleFormatting.LastColumn)) {
            if (tableLook & TableLookTypes.ApplyFirstColumn)
                cellIndex--;
            if (Math.floor(cellIndex / tableStyleColumnBandSize) % 2 == 0)
                result |= ConditionalTableStyleFormatting.OddColumnBanding;
            else
                result |= ConditionalTableStyleFormatting.EvenColumnBanding;
        }
        return result;
    }
}
