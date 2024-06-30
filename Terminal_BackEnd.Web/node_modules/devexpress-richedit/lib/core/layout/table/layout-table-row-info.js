import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { TableCellBoundFlags } from './layout-table-cell-info';
export class LayoutTableCellBackgroundInfo extends Rectangle {
    constructor(bound, color) {
        super(bound.x, bound.y, bound.width, bound.height);
        this.color = color;
    }
}
export class LayoutTableRowInfo extends Rectangle {
    constructor(parentTable, bound, rowIndex) {
        super(bound.x, bound.y, bound.width, bound.height);
        this.parentTable = parentTable;
        this.rowCells = [];
        this.backgroundInfos = [];
        this.rowIndex = rowIndex;
    }
    isBoundWithPrev() {
        return ListUtils.indexBy(this.rowCells, (cell) => !cell.boundFlags.get(TableCellBoundFlags.StartOnThisColumn)) >= 0;
    }
    getCellIndexByExactlyCellGridIndex(cellGridIndex) {
        return SearchUtils.binaryIndexOf(this.rowCells, (cell) => cell.cellGridIndex - cellGridIndex);
    }
    getCellByExactlyCellGridIndex(cellGridIndex) {
        const cellIndex = this.getCellIndexByExactlyCellGridIndex(cellGridIndex);
        return cellIndex < 0 ? null : this.rowCells[cellIndex];
    }
}
