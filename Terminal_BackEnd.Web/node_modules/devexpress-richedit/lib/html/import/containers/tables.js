import { TableWidthUnit, TableWidthUnitType } from '../../../core/model/tables/secondary-structures/table-units';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class TableInfo {
    constructor(width, properties, rows) {
        this.width = width;
        this.properties = properties;
        this.rows = rows;
        this.normalize();
    }
    get interval() {
        return FixedInterval.fromPositions(this.rows[0].cells[0].startPosition, ListUtils.last(ListUtils.last(this.rows).cells).endPosition);
    }
    normalize() {
        const minGridBefore = ListUtils.min(this.rows, row => row.gridBefore).gridBefore;
        if (minGridBefore > 0)
            ListUtils.forEach(this.rows, (row) => row.gridBefore -= minGridBefore);
        const minGridAfter = ListUtils.min(this.rows, row => row.gridAfter).gridAfter;
        if (minGridAfter > 0)
            ListUtils.forEach(this.rows, (row) => row.gridAfter -= minGridAfter);
        const maxCountLogicColumns = ListUtils.maxExtended(this.rows, (row) => row.countLogicColumns).maxValue;
        ListUtils.forEach(this.rows, (row) => {
            const rowCountLogicColumns = row.countLogicColumns;
            if (rowCountLogicColumns < maxCountLogicColumns) {
                const newGridAfter = maxCountLogicColumns - rowCountLogicColumns - row.gridAfter;
                if (newGridAfter) {
                    if (row.gridAfter == 0)
                        row.widthAfter = new TableWidthUnit().init(0, TableWidthUnitType.Auto);
                    row.gridAfter = newGridAfter;
                }
            }
        });
    }
}
export class ImportedTableRowInfo {
    constructor(gridBefore, gridAfter, widthBefore, widthAfter, properties, cells) {
        this.gridBefore = gridBefore;
        this.gridAfter = gridAfter;
        this.widthBefore = widthBefore;
        this.widthAfter = widthAfter;
        this.properties = properties;
        this.cells = cells;
    }
    get countLogicColumns() {
        return this.gridBefore + this.gridAfter + ListUtils.accumulate(this.cells, 0, (acc, cell) => acc + cell.columnSpan);
    }
    getCellByColumnSpan(colSpan) {
        let currSpan = this.gridBefore;
        return ListUtils.elementBy(this.cells, (cell) => {
            if (new FixedInterval(currSpan, cell.columnSpan).contains(colSpan))
                return true;
            currSpan += cell.columnSpan;
            return false;
        });
    }
}
export class ImportedTableCellInfo {
    constructor(preferredWidth, startPosition, endPosition, columnSpan, rowSpan, properties, firstWhenVerticallyMerged) {
        this.preferredWidth = preferredWidth;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.columnSpan = columnSpan;
        this.rowSpan = rowSpan;
        this.properties = properties;
        this.firstWhenVerticallyMerged = firstWhenVerticallyMerged;
    }
    clone() {
        return new ImportedTableCellInfo(this.preferredWidth, -1, -1, this.columnSpan, this.rowSpan, this.properties, this.firstWhenVerticallyMerged);
    }
}
