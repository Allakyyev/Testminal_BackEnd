import { Rectangle } from '@devexpress/utils/lib/geometry/rectangle';
import { LayoutTableCellBackgroundInfo } from '../../layout/table/layout-table-row-info';
import { TableCellPropertiesMergerShadingInfo } from '../../model/tables/properties-mergers/table-cell-properties-merger';
import { TableCellMergingState } from '../../model/tables/secondary-structures/table-base-structures';
export class TableBackgroundInfoCreator {
    static createBackgroundInfos(colorProvider, defaultTblCellProps, grid, currTableColumnInfo, currColumnVerticalBorders, currColumnHorizontalBorders, rowInfo) {
        const tableStyle = grid.table.style;
        const modelRows = grid.table.rows;
        for (let rowIndexInColumn = 0, vertRowBrds; vertRowBrds = currColumnVerticalBorders[rowIndexInColumn]; rowIndexInColumn++) {
            const tblRowInfo = currTableColumnInfo.tableRows[rowIndexInColumn];
            const modelRowIndex = tblRowInfo.rowIndex;
            const rowCellSpacing = rowInfo[modelRowIndex].cellSpacing;
            const cells = modelRows[modelRowIndex].cells;
            const rowHorizontalBorders = currColumnHorizontalBorders[rowIndexInColumn];
            const isRowFirstInColumn = rowIndexInColumn == 0;
            const isRowLastInColumn = rowIndexInColumn == currColumnVerticalBorders.length - 1;
            for (let cellIndex = 0, cellVerticalBorders; cellVerticalBorders = vertRowBrds[cellIndex]; cellIndex++) {
                const cell = cells[cellIndex];
                if (cell.verticalMerging == TableCellMergingState.Continue && rowIndexInColumn != 0)
                    continue;
                const isCellLastInRow = cellIndex == vertRowBrds.length - 1;
                const cellGridInfo = grid.tableCellInfos[modelRowIndex][cellIndex];
                const lastCellRowIndex = Math.min(cellGridInfo.getStartRowIndex() + cellGridInfo.getNumRowsInCell() - modelRowIndex + rowIndexInColumn, currColumnVerticalBorders.length) - 1;
                const cellLastBrdsLines = currColumnHorizontalBorders[lastCellRowIndex];
                const rect = new Rectangle(0, 0, 0, 0);
                if (rowCellSpacing) {
                    const isCellFirstInRow = cellIndex == 0;
                    const leftBrdIndex = isCellFirstInRow ? 1 : 0;
                    const rightBrdIndex = cellVerticalBorders.length - (isCellLastInRow ? 2 : 1);
                    rect.x = cellVerticalBorders[leftBrdIndex].xPos + cellVerticalBorders[leftBrdIndex].borderInfo.width;
                    rect.width = cellVerticalBorders[rightBrdIndex].xPos - rect.x;
                    const topHorBrdLine = rowHorizontalBorders[isRowFirstInColumn ? 1 : 0];
                    rect.y = topHorBrdLine.yPosition + topHorBrdLine.maxWidth;
                    rect.height = cellLastBrdsLines[cellLastBrdsLines.length - (isRowLastInColumn ? 2 : 1)].yPosition - rect.y;
                }
                else {
                    rect.x = cellVerticalBorders[0].xPos + cellVerticalBorders[0].borderInfo.width;
                    const rightBrd = isCellLastInRow ? cellVerticalBorders[1] : vertRowBrds[cellIndex + 1][0];
                    rect.width = rightBrd.xPos - rect.x;
                    const topHorBrdLine = rowHorizontalBorders[0];
                    const botHorBrdLine = lastCellRowIndex == currColumnVerticalBorders.length - 1 ?
                        currColumnHorizontalBorders[lastCellRowIndex][1] : currColumnHorizontalBorders[lastCellRowIndex + 1][0];
                    rect.y = topHorBrdLine.yPosition + topHorBrdLine.maxWidth;
                    rect.height = botHorBrdLine.yPosition - rect.y;
                }
                const getColorFromCell = cell.verticalMerging == TableCellMergingState.Continue ?
                    modelRows[cellGridInfo.getStartRowIndex()].cells[cellGridInfo.getCellIndex(0)] :
                    cell;
                const cellBackgroundColor = new TableCellPropertiesMergerShadingInfo()
                    .getProperty(getColorFromCell.properties, tableStyle, getColorFromCell.conditionalFormatting, defaultTblCellProps).getActualColor(colorProvider);
                tblRowInfo.backgroundInfos.push(new LayoutTableCellBackgroundInfo(rect, cellBackgroundColor));
            }
        }
    }
}
