import { updateMinMaxBounds } from '../../../../../../base-utils/min-max';
import { MinMaxNumber } from '@devexpress/utils/lib/class/min-max';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { TablePosition } from '../../../../../model/tables/main-structures/table';
import { Grid } from '../../grid';
import { TableCellWidthCalculator } from './table-cell-width-calculator';
export class TableWidthCalculator {
    constructor(subDocument, boxIterator, cache, table, avaliableSpacing) {
        this.containsCellsMergedByHorizontal = false;
        this.table = table;
        this.map = {};
        const grid = new Grid(this.table);
        const pos = new TablePosition(this.table, -1, -1);
        while (pos.moveToNextRow())
            while (pos.moveToNextCell()) {
                const cellWidth = new TableCellWidthCalculator(subDocument, boxIterator, grid, cache, pos, avaliableSpacing).cellWidth();
                this.register(new CellHorizontalBoundsInfo(new CellHorizontalBounds(grid.tableCellInfos[pos.rowIndex][pos.cellIndex].getGridCellIndex(), pos.cell.columnSpan), cellWidth));
            }
    }
    register(info) {
        const key = info.pos.columnIndex * 250 + info.pos.span;
        const existingCellInfo = this.map[key];
        if (existingCellInfo)
            updateMinMaxBounds(existingCellInfo.info, info.info);
        else
            this.map[key] = info;
        if (!this.containsCellsMergedByHorizontal)
            this.containsCellsMergedByHorizontal = info.pos.span > 1;
    }
    tableWidth() {
        if (!this.containsCellsMergedByHorizontal) {
            let min = 0;
            let max = 0;
            NumberMapUtils.forEach(this.map, (value) => {
                min += value.info.minElement;
                max += value.info.maxElement;
            });
            return new MinMaxNumber(min, max);
        }
        let list = NumberMapUtils.toList(this.map);
        list = list.sort((a, b) => {
            const diffByColumns = a.pos.columnIndex - b.pos.columnIndex;
            return diffByColumns ? diffByColumns : a.pos.span - b.pos.span;
        });
        const summaryListLength = list.length;
        const summary = ListUtils.initByCallback(summaryListLength + 1, () => new MinMaxNumber(0, 0));
        for (let info of list) {
            const existingSummary = summary[info.pos.columnIndex];
            const newSummary = new MinMaxNumber(existingSummary.minElement + info.info.minElement, existingSummary.maxElement + info.info.maxElement);
            for (let i = info.pos.endColumnIndex; i < summaryListLength; i++) {
                const oldSummary = summary[i];
                if (oldSummary.minElement > newSummary.minElement && oldSummary.maxElement > newSummary.maxElement)
                    break;
                updateMinMaxBounds(oldSummary, newSummary);
            }
            ;
        }
        return summary[summaryListLength - 1];
    }
}
class CellHorizontalBounds {
    constructor(columnIndex, span) {
        this.columnIndex = columnIndex;
        this.span = span;
    }
    get endColumnIndex() { return this.columnIndex + this.span; }
}
class CellHorizontalBoundsInfo {
    constructor(pos, info) {
        this.pos = pos;
        this.info = info;
    }
}
