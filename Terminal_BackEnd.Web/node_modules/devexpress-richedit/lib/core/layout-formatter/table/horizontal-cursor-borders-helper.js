import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { LayoutBorder } from '../../model/borders/layout-border';
import { LayoutCursorHorizontalTableBorder } from './borders/layout-table-border';
export class TableHorizontalCursorBordersHelper {
    static getHorizontalCursorBorders(currTableColumnInfo) {
        const borders = [];
        ListUtils.forEach(currTableColumnInfo.tableRows, (layoutRow, layoutRowIndex) => {
            ListUtils.forEach(layoutRow.rowCells, (layoutCell) => {
                borders.push(TableHorizontalCursorBordersHelper.createHorizontalCursorBorder(currTableColumnInfo, layoutCell, layoutRowIndex));
            });
        });
        return TableHorizontalCursorBordersHelper.combine(borders);
    }
    static combine(borders) {
        const resultBorders = [];
        let prevBorder = borders[0];
        resultBorders.push(prevBorder);
        for (let brdIndex = 1, border; border = borders[brdIndex]; brdIndex++) {
            if (prevBorder.canCombine(border))
                prevBorder.length = border.xPos + border.length - prevBorder.xPos;
            else {
                prevBorder = border;
                resultBorders.push(prevBorder);
            }
        }
        return resultBorders.sort((a, b) => a.yPos - b.yPos);
    }
    static createHorizontalCursorBorder(currTableColumnInfo, cell, layoutRowIndex) {
        return new LayoutCursorHorizontalTableBorder(cell.x - currTableColumnInfo.x, cell.bottom - currTableColumnInfo.y - TableHorizontalCursorBordersHelper.BORDER_HALF_WIDTH, cell.width, LayoutBorder.getEmpty(), layoutRowIndex);
    }
}
TableHorizontalCursorBordersHelper.BORDER_HALF_WIDTH = 2;
