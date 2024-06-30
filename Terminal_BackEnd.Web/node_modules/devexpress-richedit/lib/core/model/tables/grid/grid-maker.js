import { TableCellMergingState } from '../secondary-structures/table-base-structures';
import { CellGridInfo } from './table-cell-grid-info';
export class GridMaker {
    static fillGridInfo(table, tableCellGridInfos, tableCellInfos) {
        const rows = table.rows;
        for (let rowIndex = 0, row; row = rows[rowIndex]; rowIndex++) {
            const tableCellGridInfo = [];
            const tableCellInfo = [];
            tableCellGridInfos.push(tableCellGridInfo);
            tableCellInfos.push(tableCellInfo);
            let currColSpan = row.gridBefore;
            for (let spacingIndex = currColSpan; spacingIndex > 0; spacingIndex--)
                tableCellGridInfo.push(null);
            for (let cellIndex = 0, cell; cell = row.cells[cellIndex]; cellIndex++) {
                const currCellGridInfo = cell.verticalMerging != TableCellMergingState.Continue ?
                    new CellGridInfo(rowIndex, currColSpan, [cellIndex]) :
                    tableCellGridInfos[rowIndex - 1][currColSpan].addCellIndex(cellIndex);
                tableCellInfo.push(currCellGridInfo);
                for (let spacingIndex = cell.columnSpan; spacingIndex > 0; spacingIndex--)
                    tableCellGridInfo.push(currCellGridInfo);
                currColSpan += cell.columnSpan;
            }
        }
    }
}
