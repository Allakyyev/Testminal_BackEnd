import { ModelScrollManager } from '../../scroll/model-scroll-manager';
import { ControlOptions } from '../../../core/model/options/control';
import { Table } from '../../../core/model/tables/main-structures/table';
import { TableCellUtils } from '../../../core/model/tables/table-utils';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { ScrollState } from '../../scroll/model-states';
import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { isDefined } from '@devexpress/utils/lib/utils/common';
export class SelectTableCommandBase extends CommandBase {
    getState() {
        let state = new SimpleCommandState(this.isEnabled());
        state.visible = this.selection.tableInfo.extendedData.numRows > 0;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    addSelection(firstPos, lastPos, isFirstSelection, visibleModelPosition = ModelScrollManager.StandartScrollPosition) {
        if (isFirstSelection)
            this.selection.deprecatedSetSelection(firstPos, lastPos, false, -1, true, true, false, visibleModelPosition);
        else {
            this.selection.changeState((newState) => {
                newState.addInterval(FixedInterval.fromPositions(Math.min(firstPos, lastPos), Math.max(firstPos, lastPos))).resetKeepX().setEndOfLine(false);
                newState.forwardDirection = lastPos >= firstPos;
            });
            if (visibleModelPosition !== ModelScrollManager.DontChangeScrollPosition) {
                this.selection.scrollManager.setScroll(new ScrollState()
                    .byModelPosition(this.selection)
                    .setModelPosition(lastPos)
                    .useStdRelativePosition()
                    .useStdOffset());
            }
        }
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class SelectTableCellCommand extends SelectTableCommandBase {
    executeCore(_state, _options) {
        const tableInfo = this.selection.tableInfo;
        let isFirstCell = true;
        tableInfo.extendedData.foreach(() => { }, (cellInfo) => {
            const firstPos = cellInfo.cell.startParagraphPosition.value;
            const lastPos = cellInfo.cell.endParagrapPosition.value;
            this.addSelection(firstPos, lastPos, isFirstCell);
            isFirstCell = false;
        });
        return true;
    }
}
export class ExtendSelectTableCellCommand extends SelectTableCellCommand {
    addSelection(firstPos, lastPos, _isFirstSelection) {
        this.selection.changeState((newState) => newState.addInterval(FixedInterval.fromPositions(firstPos, lastPos))
            .resetKeepX().setEndOfLine(false));
    }
}
export class SelectTableColumnCommand extends SelectTableCommandBase {
    DEPRECATEDConvertOptionsParameter(parameter) {
        if (parameter)
            return parameter;
        const columnIndices = [];
        const tableInfo = this.selection.tableInfo;
        const table = tableInfo.table;
        const columnIndicesMap = {};
        tableInfo.extendedData.foreach(() => { }, (cellInfo, rowInfo) => {
            const startColumnIndex = tableInfo.gridInfoManager.tableCellInfos[rowInfo.rowIndex][cellInfo.cellIndex].getGridCellIndex();
            for (let span = 0; span < cellInfo.cell.columnSpan; span++) {
                let columnIndex = startColumnIndex + span;
                if (!columnIndicesMap[columnIndex]) {
                    columnIndices.push(columnIndex);
                    columnIndicesMap[columnIndex] = true;
                }
            }
        });
        return { table: table, columnIndices: columnIndices };
    }
    executeCore(_state, options) {
        let table = options.param.table;
        let columnIndices = options.param.columnIndices;
        let isFirstItem = true;
        let prevAddedCell = null;
        for (let i = 0, columnIndex; (columnIndex = columnIndices[i]) !== undefined; i++) {
            for (let rowIndex = 0, row; row = table.rows[rowIndex]; rowIndex++) {
                let cellIndex = TableCellUtils.getCellIndexByColumnIndex(row, columnIndex);
                let cell = row.cells[cellIndex];
                if (cell && prevAddedCell !== cell) {
                    let firstPos = cell.startParagraphPosition.value;
                    let lastPos = cell.endParagrapPosition.value;
                    this.addSelection(firstPos, lastPos, isFirstItem, ModelScrollManager.DontChangeScrollPosition);
                    isFirstItem = false;
                }
                prevAddedCell = cell;
            }
        }
        return true;
    }
}
export class ExtendSelectTableColumnCommand extends SelectTableColumnCommand {
    addSelection(firstPos, lastPos, _isFirstSelection) {
        this.selection.changeState((newState) => newState.addInterval(FixedInterval.fromPositions(firstPos, lastPos))
            .resetKeepX().setEndOfLine(false));
    }
}
export class SelectTableRowCommandOptions extends CommandOptions {
    constructor(control, table, rowIndices, forwardDirection) {
        super(control);
        if (table) {
            this.forwardDirection = forwardDirection;
            this.rows = ListUtils.map(rowIndices, (rowIndex) => table.rows[rowIndex]);
        }
        else {
            this.forwardDirection = control.selection.forwardDirection;
            this.rows = ListUtils.map(control.selection.tableInfo.extendedData.rows, (rowInfo) => rowInfo.row);
        }
    }
}
export class SelectTableRowCommand extends SelectTableCommandBase {
    executeCore(_state, options) {
        if (!options.isSetManually) {
            options = new SelectTableRowCommandOptions(this.control, null, [], false);
        }
        for (let i = 0, row; row = options.rows[i]; i++)
            this.addSelection(options.forwardDirection ? row.getStartPosition() : row.getEndPosition(), options.forwardDirection ? row.getEndPosition() : row.getStartPosition(), i === 0);
        return true;
    }
}
export class ExtendSelectTableRowCommand extends SelectTableRowCommand {
    addSelection(firstPos, lastPos, _isFirstSelection) {
        this.selection.changeState((newState) => newState.addInterval(FixedInterval.fromPositions(firstPos, lastPos))
            .resetKeepX().setEndOfLine(false));
    }
}
export class SelectTableCommand extends SelectTableCommandBase {
    executeCore(_state) {
        let table = Table.getTableByPosition(this.selection.activeSubDocument.tables, this.selection.intervals[0].start, true);
        if (!isDefined(table))
            return false;
        let firstPos = table.getFirstCell().startParagraphPosition.value;
        let lastPos = table.getLastCell().endParagrapPosition.value;
        this.addSelection(firstPos, lastPos, true);
        return true;
    }
}
export class ExtendSelectTableCommand extends SelectTableCommand {
    addSelection(firstPos, lastPos, _isFirstSelection) {
        this.selection.changeState((newState) => newState.addInterval(FixedInterval.fromPositions(firstPos, lastPos))
            .resetKeepX().setEndOfLine(false));
    }
}
export class SelectTableCellsRangeCommand extends SelectTableCommandBase {
    executeCore(_state, options) {
        const parameter = options.param;
        let forwardDirection = parameter.firstCell.startParagraphPosition.value <= parameter.lastCell.startParagraphPosition.value;
        if (parameter.lastCell.parentRow.parentTable !== parameter.firstCell.parentRow.parentTable)
            throw new Error("cells should be from the same table");
        let table = parameter.firstCell.parentRow.parentTable;
        let startColumnIndex = TableCellUtils.getStartColumnIndex(parameter.firstCell);
        let endColumnIndex = TableCellUtils.getStartColumnIndex(parameter.lastCell);
        let minColumnIndex = Math.min(startColumnIndex, endColumnIndex);
        let maxColumnIndex = Math.max(startColumnIndex + parameter.firstCell.columnSpan - 1, endColumnIndex + parameter.lastCell.columnSpan - 1);
        let startRowIndex = SearchUtils.normedInterpolationIndexOf(table.rows, r => r.getStartPosition(), parameter.firstCell.startParagraphPosition.value);
        let endRowIndex = SearchUtils.normedInterpolationIndexOf(table.rows, r => r.getStartPosition(), parameter.lastCell.startParagraphPosition.value);
        let minRowIndex = Math.min(startRowIndex, endRowIndex);
        let maxRowIndex = Math.max(startRowIndex, endRowIndex);
        let isFirstSelection = true;
        for (let rowIndex = minRowIndex; rowIndex <= maxRowIndex; rowIndex++) {
            let row = table.rows[rowIndex];
            let columnIndex = Math.max(row.gridBefore, minColumnIndex);
            if (columnIndex > maxColumnIndex)
                continue;
            let cellIndex = TableCellUtils.getCellIndexByColumnIndex(row, columnIndex);
            while (columnIndex <= maxColumnIndex) {
                let cell = row.cells[cellIndex];
                if (!cell)
                    break;
                this.addSelection(forwardDirection ? cell.startParagraphPosition.value : cell.endParagrapPosition.value, forwardDirection ? cell.endParagrapPosition.value : cell.startParagraphPosition.value, isFirstSelection && !parameter.extendSelection);
                isFirstSelection = false;
                columnIndex += cell.columnSpan;
                cellIndex++;
            }
        }
        return true;
    }
}
