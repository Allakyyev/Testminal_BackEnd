export class BorderCreator {
    static setColumnHorizontalBorders(currTableColumnInfo, rowInfo, currColumnHorizontalBorders, isThisColumnFirstInTable) {
        const tblRows = currTableColumnInfo.tableRows;
        const columnInfoYOffset = currTableColumnInfo.y;
        for (let tblRowIndex = 0, tblRow; tblRow = tblRows[tblRowIndex]; tblRowIndex++) {
            const isThisRowFirstInColumn = tblRowIndex == 0;
            const isThisRowLastInColumn = tblRowIndex == tblRows.length - 1;
            let rowCellSpacing = rowInfo[tblRow.rowIndex].cellSpacing;
            const rowBrd = currColumnHorizontalBorders[tblRowIndex];
            if (rowCellSpacing > 0) {
                let endIndex;
                if (isThisRowFirstInColumn) {
                    rowBrd[0].yPosition = tblRow.y;
                    rowBrd[0].isOffsetFromTop = true;
                    rowBrd[1].yPosition = rowBrd[0].yPosition + rowBrd[0].maxWidth + rowCellSpacing * (isThisColumnFirstInTable ? 2 : 1) + rowBrd[1].maxWidth;
                    rowBrd[1].isOffsetFromTop = false;
                    endIndex = 3;
                }
                else {
                    rowBrd[0].yPosition = tblRow.y + rowCellSpacing + rowBrd[0].maxWidth;
                    rowBrd[0].isOffsetFromTop = false;
                    endIndex = 2;
                }
                if (isThisRowLastInColumn) {
                    rowBrd[endIndex].yPosition = tblRow.bottom - rowBrd[endIndex].maxWidth;
                    rowBrd[endIndex].isOffsetFromTop = true;
                    rowBrd[endIndex - 1].yPosition = rowBrd[endIndex].yPosition - rowCellSpacing * 2 - rowBrd[endIndex - 1].maxWidth;
                    rowBrd[endIndex - 1].isOffsetFromTop = true;
                }
                else {
                    rowBrd[endIndex - 1].yPosition = tblRow.bottom - rowCellSpacing - rowBrd[endIndex - 1].maxWidth;
                    rowBrd[endIndex - 1].isOffsetFromTop = true;
                }
            }
            else {
                rowBrd[0].yPosition = isThisRowFirstInColumn ? tblRow.y : tblRow.y - rowBrd[0].maxWidth / 2;
                rowBrd[0].isOffsetFromTop = true;
                if (isThisRowLastInColumn) {
                    rowBrd[1].yPosition = tblRow.bottom - rowBrd[1].maxWidth;
                    rowBrd[1].isOffsetFromTop = true;
                }
            }
            for (let brd of rowBrd)
                brd.yPosition -= columnInfoYOffset;
        }
    }
    static setColumnVerticalBorders(currTableColumnInfo, grid, rowInfo, isThisColumnFirstInTable, currColumnHorizontalBorders, newVerticalBorders, verticalBorders, considerSpacing) {
        const tblRows = currTableColumnInfo.tableRows;
        const rows = grid.table.rows;
        for (let tblRowIndex = 0, tblRow; tblRow = tblRows[tblRowIndex]; tblRowIndex++) {
            const isRowFirstInColumn = tblRowIndex == 0;
            const isRowLastInColumn = tblRowIndex == tblRows.length - 1;
            const horRowBorders = currColumnHorizontalBorders[tblRowIndex];
            const nextHorRowBorders = currColumnHorizontalBorders[tblRowIndex + 1];
            const lastHorBorderLineIndex = horRowBorders.length - 1;
            const rowBorders = [];
            newVerticalBorders.push(rowBorders);
            const rowIndex = tblRow.rowIndex;
            const cells = rows[rowIndex].cells;
            const rowCellSpacing = considerSpacing ? rowInfo[rowIndex].cellSpacing : 0;
            for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                const isFirstCellInRow = cellIndex == 0;
                const isLastCellInRow = cellIndex == cells.length - 1;
                const cellGridInfo = grid.tableCellInfos[rowIndex][cellIndex];
                const isThisCellMergedByTop = !isRowFirstInColumn && cellGridInfo.getStartRowIndex() != rowIndex;
                const isThisCellMergedByBottom = !isRowLastInColumn && cellGridInfo.getStartRowIndex() + cellGridInfo.getNumRowsInCell() - 1 != rowIndex;
                const cellBorders = [];
                rowBorders.push(cellBorders);
                for (let brd of verticalBorders[rowIndex][cellIndex])
                    cellBorders.push(brd.clone());
                let topCellBordersLine;
                let bottomCellBordersLine;
                if (rowCellSpacing > 0) {
                    topCellBordersLine = horRowBorders[isRowFirstInColumn ? 1 : 0];
                    bottomCellBordersLine = horRowBorders[lastHorBorderLineIndex - (isRowLastInColumn ? 1 : 0)];
                }
                else {
                    topCellBordersLine = horRowBorders[0];
                    bottomCellBordersLine = isRowLastInColumn ? horRowBorders[lastHorBorderLineIndex] : nextHorRowBorders[0];
                }
                const yPos = topCellBordersLine.yPosition + (topCellBordersLine.isOffsetFromTop ? topCellBordersLine.maxWidth : 0);
                const yEndPos = bottomCellBordersLine.yPosition - (bottomCellBordersLine.isOffsetFromTop ? 0 : bottomCellBordersLine.maxWidth);
                for (let vertCellBorderIndex = 0, vertCellBorder; vertCellBorder = cellBorders[vertCellBorderIndex]; vertCellBorderIndex++) {
                    const isFirstBorderInCell = vertCellBorderIndex == 0;
                    const isLastBorderInCell = vertCellBorderIndex == cellBorders.length - 1;
                    const isBoundBorder = isFirstCellInRow && isFirstBorderInCell || isLastBorderInCell && isLastCellInRow;
                    vertCellBorder.yPos = yPos;
                    if (isBoundBorder || isThisCellMergedByTop)
                        vertCellBorder.yPos -= rowCellSpacing * (isThisColumnFirstInTable && isRowFirstInColumn ? 2 : 1) + topCellBordersLine.maxWidth;
                    vertCellBorder.length = yEndPos - vertCellBorder.yPos;
                    if (isBoundBorder || isThisCellMergedByBottom)
                        vertCellBorder.length += rowCellSpacing * (isRowLastInColumn ? 2 : 1) + bottomCellBordersLine.maxWidth;
                }
            }
        }
    }
}
