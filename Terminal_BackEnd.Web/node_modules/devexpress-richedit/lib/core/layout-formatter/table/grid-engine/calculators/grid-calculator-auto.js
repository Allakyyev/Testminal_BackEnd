import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { TablePosition } from '../../../../model/tables/main-structures/table';
import { TableLayoutType } from '../../../../model/tables/secondary-structures/table-base-structures';
import { TableWidthUnitType } from '../../../../model/tables/secondary-structures/table-units';
import { ColumnIntervalAuto, GridColumnBase } from './column-interval';
import { GridCalculator } from './grid-calculator';
import { TableCellWidthCalculator } from './table-width-calculators/table-cell-width-calculator';
export class GridCalculatorAuto extends GridCalculator {
    makeInterval(interval) {
        return new ColumnIntervalAuto(interval);
    }
    applyCellsWidth(_intervals) {
        this.calcCacheCellWidths();
        this.applyCellContentWidth();
    }
    autofitTail(totalWidth, estimatedTableWidth) {
        if (this.currCache.layoutType == TableLayoutType.Fixed)
            return;
        const totalMinWidth = GridColumnBase.totalMinWidth(this.columns);
        let maxPermissibleTableWidth = totalMinWidth;
        if (estimatedTableWidth <= this.percentBaseWidth)
            maxPermissibleTableWidth = Math.min(maxPermissibleTableWidth, this.percentBaseWidth);
        maxPermissibleTableWidth = Math.max(estimatedTableWidth, maxPermissibleTableWidth);
        if (!this.currCache.isFixedTableWidth)
            maxPermissibleTableWidth = Math.min(this.percentBaseWidth, maxPermissibleTableWidth);
        if (totalWidth > maxPermissibleTableWidth) {
            if (maxPermissibleTableWidth > totalMinWidth) {
                this.compressTableGrid(maxPermissibleTableWidth);
            }
            else {
                this.compressProportionallyMinWidth(maxPermissibleTableWidth, totalMinWidth);
            }
        }
    }
    compressProportionallyMinWidth(totalWidth, rest) {
        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];
            const newColumnWidth = rest > 0 ? Math.max(column.bounds.minElement * totalWidth / rest, GridCalculator.minColumnWidth) : GridCalculator.minColumnWidth;
            column.width = newColumnWidth;
            totalWidth -= newColumnWidth;
            rest -= column.bounds.minElement;
        }
    }
    calcCacheCellWidths() {
        const pos = new TablePosition(this.table, -1, -1);
        while (pos.moveToNextRow())
            while (pos.moveToNextCell())
                new TableCellWidthCalculator(this.subDocument, this.boxIterator, this.grid, this.cache, pos, this.percentBaseWidth).cellWidth();
    }
    applyCellContentWidth() {
        const pos = new TablePosition(this.table, -1, -1);
        while (pos.moveToNextRow()) {
            let columnIndex = pos.row.gridBefore;
            while (pos.moveToNextCell()) {
                if (pos.cell.columnSpan == 1)
                    this.applyCellContentWidthWithoutSpan(this.columns, pos, columnIndex);
                columnIndex += pos.cell.columnSpan;
            }
        }
        for (let column of this.columns) {
            if (column.bounds.minElement == 0 && column.bounds.maxElement == 0) {
                if (column.isPercentBased)
                    column.bounds.minElement = column.bounds.maxElement = 1;
                else
                    column.bounds.minElement = column.bounds.maxElement = Math.max(1, column.width);
            }
        }
        pos.initIndexes(-1, -1);
        while (pos.moveToNextRow()) {
            let columnIndex = pos.row.gridBefore;
            while (pos.moveToNextCell()) {
                if (pos.cell.columnSpan > 1)
                    this.applyCellContentWidthWithSpan(this.columns, pos, columnIndex);
                columnIndex += pos.cell.columnSpan;
            }
        }
        for (let column of this.columns)
            column.width = column.bounds.maxElement = Math.max(column.bounds.maxElement, GridCalculator.minColumnWidth);
    }
    applyCellContentWidthWithoutSpan(columns, pos, columnIndex) {
        const cellCache = this.currCache.rows[pos.rowIndex].cells[pos.cellIndex];
        const info = cellCache.contentWidthsInfo;
        const cellMinWidth = Math.max(GridCalculator.minColumnWidth, info.minElement);
        let cellMaxWidth = Math.max(GridCalculator.minColumnWidth, info.maxElement);
        const column = columns[columnIndex];
        column.updateMinBound(cellMinWidth);
        column.updateMaxBound(cellMaxWidth);
        column.totalHorizontalMargins = Math.max(column.totalHorizontalMargins, cellCache.horizontalMargins);
        const preferredWidth = pos.cell.preferredWidth;
        const cellWidthType = preferredWidth.type;
        if (cellWidthType == TableWidthUnitType.FiftiethsOfPercent) {
            if (preferredWidth.value > 0) {
                column.type = TableWidthUnitType.FiftiethsOfPercent;
                const percentWidth = Math.min(this.maxPercentWidth, preferredWidth.value);
                column.percentValue = Math.max(percentWidth, column.percentValue);
            }
            else if (this.currCache.isFixedTableWidth) {
                this.applyPreferredWidth(column, cellMinWidth, 0);
            }
        }
        else if (cellWidthType == TableWidthUnitType.ModelUnits)
            this.applyPreferredWidth(column, cellMinWidth, preferredWidth.asNumber(this.percentBaseWidth, UnitConverter.twipsToPixels));
    }
    applyPreferredWidth(column, cellMinWidth, preferredWidth) {
        preferredWidth = Math.max(cellMinWidth, preferredWidth);
        column.preferredWidth = Math.max(column.preferredWidth, preferredWidth);
        column.updateMaxBound(column.preferredWidth);
    }
    applyCellContentWidthWithSpan(columns, pos, startColumnIndex) {
        const endColumnIndex = startColumnIndex + pos.cell.columnSpan - 1;
        const nextEndColumnIndex = endColumnIndex + 1;
        const cellCache = this.currCache.rows[pos.rowIndex].cells[pos.cellIndex];
        const info = cellCache.contentWidthsInfo;
        const cellMinWidth = Math.max(GridCalculator.minColumnWidth, info.minElement);
        let cellMaxWidth = Math.max(GridCalculator.minColumnWidth, info.maxElement);
        const preferredWidth = pos.cell.preferredWidth;
        const lastColumn = this.columns[endColumnIndex];
        if (preferredWidth.type == TableWidthUnitType.FiftiethsOfPercent) {
            const totalPercent = GridColumnBase.totalPercentWidth(this.columns, startColumnIndex, nextEndColumnIndex);
            const currrentPercentValue = Math.min(this.maxPercentWidth, preferredWidth.value);
            if (ListUtils.allOf(this.columns, (col) => col.isPercentBased, startColumnIndex, nextEndColumnIndex)) {
                const totalBefore = GridColumnBase.totalPercentWidth(this.columns, startColumnIndex, endColumnIndex);
                lastColumn.percentValue = Math.max(currrentPercentValue - totalBefore, lastColumn.percentValue);
            }
            else if (totalPercent > 0) {
                const percentRest = Math.max(0, currrentPercentValue - totalPercent);
                let totaNoPercentMaxWidth = 0;
                ListUtils.forEach(this.columns, (col) => {
                    if (!col.isPercentBased)
                        totaNoPercentMaxWidth += col.bounds.maxElement;
                }, startColumnIndex, nextEndColumnIndex);
                ListUtils.forEach(this.columns, (col) => {
                    if (!col.isPercentBased) {
                        col.percentValue = Math.max(1, percentRest * col.bounds.maxElement / totaNoPercentMaxWidth);
                        col.type = TableWidthUnitType.FiftiethsOfPercent;
                    }
                }, startColumnIndex, nextEndColumnIndex);
            }
        }
        else if (preferredWidth.type == TableWidthUnitType.ModelUnits) {
            let preferredWidthValue = preferredWidth.asNumber(this.percentBaseWidth, UnitConverter.twipsToPixelsF);
            preferredWidthValue = Math.max(cellMinWidth, preferredWidthValue);
            cellMaxWidth = preferredWidthValue;
            if (ListUtils.allOf(this.columns, (col) => { return !col.isPercentBased && col.preferredWidth > 0; }, startColumnIndex, nextEndColumnIndex)) {
                const totalMaxWidthBefore = GridColumnBase.totalMaxWidth(this.columns, startColumnIndex, endColumnIndex);
                lastColumn.preferredWidth = Math.max(lastColumn.preferredWidth, preferredWidthValue - totalMaxWidthBefore);
                lastColumn.updateMaxBound(lastColumn.preferredWidth);
                const gridMinWidth = GridColumnBase.totalMinWidth(this.columns, startColumnIndex, nextEndColumnIndex);
                if (cellMinWidth > gridMinWidth)
                    this.enlargeColumnsMinWidthByPreferredWidth(startColumnIndex, endColumnIndex, cellMinWidth, preferredWidthValue);
                return;
            }
        }
        const gridMinWidth = ColumnIntervalAuto.totalMinWidth(columns, startColumnIndex, nextEndColumnIndex);
        if (cellMinWidth > gridMinWidth)
            this.enlargeColumnsMinWidth(columns, startColumnIndex, nextEndColumnIndex, cellMinWidth);
        const gridMaxWidth = ColumnIntervalAuto.totalMaxWidth(columns, startColumnIndex, nextEndColumnIndex);
        if (cellMaxWidth > gridMaxWidth)
            this.enlargeColumnsMaxWidth(columns, startColumnIndex, nextEndColumnIndex, gridMaxWidth, cellMaxWidth);
        const gridTotalMargins = ColumnIntervalAuto.totalHorizontalMargins(columns, startColumnIndex, nextEndColumnIndex);
        if (cellCache.horizontalMargins > gridTotalMargins)
            this.enlargeColumnsHorizontalMargins(columns, startColumnIndex, nextEndColumnIndex, gridTotalMargins, cellCache.horizontalMargins);
    }
    enlargeColumnsMinWidthByPreferredWidth(startColumnIndex, endColumnIndex, cellMinWidth, totalPreferredWidth) {
        let restMinWidth = cellMinWidth;
        let restTotalPreferredWidth = totalPreferredWidth;
        for (let i = endColumnIndex; i >= startColumnIndex; i--) {
            const column = this.columns[i];
            if (column.preferredWidth > 0 && restTotalPreferredWidth > 0) {
                column.bounds.minElement = column.preferredWidth * restMinWidth / restTotalPreferredWidth;
                column.updateMaxBound(column.bounds.minElement);
                restMinWidth -= column.bounds.minElement;
                restTotalPreferredWidth -= column.preferredWidth;
            }
        }
    }
    enlargeColumnsHorizontalMargins(columns, startColumnIndex, endColumnIndex, oldWidth, newWidth) {
        const equalSpace = oldWidth == 0;
        let totalDelta = newWidth - oldWidth;
        let totalCount = endColumnIndex - startColumnIndex + 1;
        for (let i = endColumnIndex - 1, column; (column = columns[i]) && totalDelta > 0; i--) {
            const delta = equalSpace ? totalDelta / totalCount : totalDelta * column.totalHorizontalMargins / oldWidth;
            totalDelta -= delta;
            oldWidth -= column.totalHorizontalMargins;
            column.totalHorizontalMargins += delta;
            totalCount--;
        }
    }
    enlargeColumnsMinWidth(columns, startColumnIndex, endColumnIndex, newWidth) {
        const hasColumnsWithoutPreferredWidth = ColumnIntervalAuto.hasColumnsWithoutPreferredWidth(columns, startColumnIndex, endColumnIndex);
        let zeroMinWidthCount = 0;
        let existingMinWidth = 0;
        ListUtils.forEach(columns, (column) => {
            if (column.bounds.minElement == 0 && column.bounds.maxElement == 0)
                zeroMinWidthCount++;
            else
                existingMinWidth += column.bounds.minElement;
        }, startColumnIndex, endColumnIndex);
        let rest = ColumnIntervalAuto.totalMaxWidth(columns, startColumnIndex, endColumnIndex) +
            ColumnIntervalAuto.totalMinWidth(columns, startColumnIndex, endColumnIndex);
        const equalSpace = rest == 0;
        if (equalSpace || zeroMinWidthCount > 0) {
            rest = endColumnIndex - startColumnIndex;
            newWidth -= existingMinWidth;
        }
        ListUtils.reverseForEach(columns, (column) => {
            if (!hasColumnsWithoutPreferredWidth || column.preferredWidth == 0) {
                if (zeroMinWidthCount > 0 && (column.bounds.minElement > 0 || column.bounds.maxElement > 0))
                    return;
                const factor = (equalSpace || zeroMinWidthCount > 0) ? 1 : (column.bounds.minElement + column.bounds.maxElement);
                const newMinWidth = factor * newWidth / rest;
                rest -= factor;
                newWidth -= newMinWidth;
                column.updateMinBound(newMinWidth);
                column.updateMaxBound(column.bounds.minElement);
            }
        }, endColumnIndex - 1, startColumnIndex);
    }
    enlargeColumnsMaxWidth(columns, startColumnIndex, endColumnIndex, oldWidth, newWidth) {
        const allColumnsHavePreferredWidth = ListUtils.allOf(columns, (col) => col.preferredWidth != 0, startColumnIndex, endColumnIndex);
        let rest = oldWidth;
        ListUtils.reverseForEach(columns, (column) => {
            if (allColumnsHavePreferredWidth || column.preferredWidth == 0) {
                const newMaxWidth = rest != 0 ? column.bounds.maxElement * newWidth / rest : 0;
                rest -= column.bounds.maxElement;
                newWidth -= newMaxWidth;
                if (rest < 0)
                    rest = 0;
                if (newWidth < 0)
                    newWidth = 0;
                column.bounds.maxElement = Math.max(GridCalculator.minColumnWidth, newMaxWidth);
            }
        }, endColumnIndex - 1, startColumnIndex);
    }
}
