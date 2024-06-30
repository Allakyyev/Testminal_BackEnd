import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class TableUtilsEx {
    static getColumnsRangeBySelectedRow(gridInfoManager, rowInfo) {
        const rowGridInfo = gridInfoManager.tableCellInfos[rowInfo.rowIndex];
        const lastCellInfo = ListUtils.last(rowInfo.cells);
        return new BoundaryInterval(rowGridInfo[rowInfo.cells[0].cellIndex].getGridCellIndex(), rowGridInfo[lastCellInfo.cellIndex].getGridCellIndex() + lastCellInfo.cell.columnSpan);
    }
    static getColumnsRangeBySelectedCells(data) {
        return ListUtils.accumulate(data.rows, null, (acc, rowInfo) => {
            const currRowInterval = TableUtilsEx.getColumnsRangeBySelectedRow(data.info.gridInfoManager, rowInfo);
            return acc ? new BoundaryInterval(Math.max(currRowInterval.start, acc.start), Math.min(currRowInterval.end, acc.end)) : currRowInterval;
        });
    }
}
