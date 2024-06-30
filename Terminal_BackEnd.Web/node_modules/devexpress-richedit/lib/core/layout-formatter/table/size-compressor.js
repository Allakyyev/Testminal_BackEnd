import { Point } from '@devexpress/utils/lib/geometry/point';
import { HitTestDeviation, Rectangle, RectangleDeviation } from '@devexpress/utils/lib/geometry/rectangle';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export class LayoutTableSizeCompressor {
    static tableRowContentCompress(row) {
        for (let cell of row.rowCells)
            LayoutTableSizeCompressor.cellCompress(cell, cell.createRectangle());
    }
    static tableCompress(tableInfo, boundsRelativeColumn) {
        LayoutTableSizeCompressor.compress(tableInfo, boundsRelativeColumn, true, false);
        const boundsRelativeTable = tableInfo.clone().moveRectangle(-tableInfo.x, -tableInfo.y);
        for (let row of tableInfo.tableRows)
            LayoutTableSizeCompressor.rowCompress(row, boundsRelativeTable, boundsRelativeColumn);
        LayoutTableSizeCompressor.compressBorders(tableInfo.horizontalBorders, boundsRelativeTable, true);
        LayoutTableSizeCompressor.compressBorders(tableInfo.horizontalCursorBorders, boundsRelativeTable, true);
        LayoutTableSizeCompressor.compressBorders(tableInfo.verticalBorders, boundsRelativeTable, false);
        LayoutTableSizeCompressor.compressBorders(tableInfo.verticalCursorBorders, boundsRelativeTable, false);
    }
    static compressBorders(borders, boundsRelativeTable, isHorizontal) {
        const newBorders = [];
        for (let brd of borders)
            if ((isHorizontal ? LayoutTableSizeCompressor.compressHorizontalBorder : LayoutTableSizeCompressor.compressVerticalBorder)(brd, boundsRelativeTable))
                newBorders.push(brd);
        if (borders.length != newBorders.length) {
            borders.splice(0);
            ListUtils.addListOnTail(borders, newBorders);
        }
    }
    static rowCompress(row, boundsRelativeTable, boundsRelativeColumn) {
        LayoutTableSizeCompressor.compress(row, boundsRelativeColumn, true, false);
        for (let bcgInfo of row.backgroundInfos)
            LayoutTableSizeCompressor.compress(bcgInfo, boundsRelativeTable, true, false);
        for (let cell of row.rowCells)
            LayoutTableSizeCompressor.cellCompress(cell, boundsRelativeColumn);
    }
    static cellCompress(cell, boundsRelativeColumn) {
        LayoutTableSizeCompressor.compress(cell, boundsRelativeColumn, true, false);
        for (let layoutRow of cell.layoutRows)
            LayoutTableSizeCompressor.compress(layoutRow, boundsRelativeColumn, true, true);
        boundsRelativeColumn = cell;
        NumberMapUtils.forEach(cell.internalTables, (tbl) => LayoutTableSizeCompressor.tableCompress(tbl, boundsRelativeColumn));
    }
    static compress(obj, bounds, changeWhenNoIntersection, isLayoutRow) {
        const intersection = Rectangle.getIntersection(obj, bounds);
        if (intersection) {
            if (isLayoutRow && obj.x < bounds.x)
                obj.applyXOffsetToBoxes(obj.x - bounds.x);
            obj.setGeomerty(intersection);
            return true;
        }
        if (changeWhenNoIntersection) {
            const deviation = new RectangleDeviation(bounds, new Point(obj.x, obj.y)).calcDeviation().deviation;
            const devRight = deviation.get(HitTestDeviation.Right);
            const devBottom = deviation.get(HitTestDeviation.Bottom);
            const newObjX = devRight ? bounds.right : obj.x;
            const newObjY = devBottom ? bounds.bottom : obj.y;
            obj.setPosition(new Point(newObjX, newObjY));
            obj.setSize(new Size(devRight ? 0 : Math.min(obj.right, bounds.right) - newObjX, devBottom ? 0 : Math.min(obj.bottom, bounds.bottom) - newObjY));
        }
        return false;
    }
    static compressVerticalBorder(border, bounds) {
        const horIntersection = IntervalAlgorithms.getIntersection(new FixedInterval(border.xPos, border.borderInfo.width), new FixedInterval(bounds.x, bounds.width));
        if (horIntersection) {
            const vertIntersection = IntervalAlgorithms.getIntersection(new FixedInterval(border.yPos, border.length), new FixedInterval(bounds.y, bounds.height));
            if (vertIntersection) {
                border.length = Math.min(border.yPos + border.length, bounds.bottom) - border.yPos;
                return true;
            }
            if (border.yPos > bounds.bottom) {
                border.yPos = bounds.bottom;
                border.length = 0;
            }
            return false;
        }
        border.length = Math.min(border.yPos + border.length, bounds.bottom) - border.yPos;
        if (border.xPos < bounds.x)
            return true;
        border.xPos = bounds.right;
        border.borderInfo.width = 0;
        return false;
    }
    static compressHorizontalBorder(border, bounds) {
        const vertIntersection = IntervalAlgorithms.getIntersection(new FixedInterval(border.yPos, border.borderInfo.width), new FixedInterval(bounds.y, bounds.height));
        if (vertIntersection) {
            const horIntersection = IntervalAlgorithms.getIntersection(new FixedInterval(border.xPos, border.length), new FixedInterval(bounds.x, bounds.width));
            if (horIntersection) {
                border.length = Math.min(border.xPos + border.length, bounds.right) - border.xPos;
                return true;
            }
            if (border.xPos > bounds.right) {
                border.xPos = bounds.right;
                border.length = 0;
            }
            return false;
        }
        border.length = Math.min(border.xPos + border.length, bounds.right) - border.xPos;
        if (border.yPos < bounds.y)
            return true;
        border.yPos = bounds.bottom;
        border.borderInfo.width = 0;
        return false;
    }
}
