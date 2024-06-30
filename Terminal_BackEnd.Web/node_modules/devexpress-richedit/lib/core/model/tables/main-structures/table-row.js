import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { TableProperties } from '../properties/table-properties';
import { ConditionalTableStyleFormatting } from '../secondary-structures/table-base-structures';
import { TableHeightUnit, TableWidthUnit } from '../secondary-structures/table-units';
export class TableRow {
    constructor(parentTable, properties) {
        this.cells = [];
        this.widthBefore = TableWidthUnit.createDefault();
        this.widthAfter = TableWidthUnit.createDefault();
        this.gridBefore = 0;
        this.gridAfter = 0;
        this.height = TableHeightUnit.createDefault();
        this.tablePropertiesException = new TableProperties();
        this.conditionalFormatting = ConditionalTableStyleFormatting.WholeTable;
        this.parentTable = parentTable;
        this.properties = properties;
    }
    get logicColumnCount() { return this.gridBefore + this.gridAfter + ListUtils.accumulate(this.cells, 0, (acc, c) => acc += c.columnSpan); }
    get isLastRowInTable() {
        return ListUtils.last(this.parentTable.rows) === this;
    }
    destructor(positionManager) {
        for (var cellIndex = 0, cell; cell = this.cells[cellIndex]; cellIndex++)
            cell.destructor(positionManager);
    }
    getStartPosition() {
        return this.cells[0].startParagraphPosition.value;
    }
    getEndPosition() {
        return ListUtils.last(this.cells).endParagrapPosition.value;
    }
    get interval() { return FixedInterval.fromPositions(this.getStartPosition(), this.getEndPosition()); }
    getCellColumnIndex(cellIndex) {
        return ListUtils.accumulate(this.cells, this.gridBefore, (acc, cell) => acc + cell.columnSpan, 0, cellIndex);
    }
    getTotalCellsInRowConsiderGrid() {
        let cells = this.gridBefore;
        for (let i = 0, cell; cell = this.cells[i]; i++)
            cells += cell.columnSpan;
        cells += this.gridAfter;
        return cells;
    }
    clone(subDocument, parentTable) {
        const result = new TableRow(parentTable, subDocument.documentModel.cache.tableRowPropertiesCache.getItem(this.properties));
        result.parentTable = parentTable;
        result.cells = ListUtils.map(this.cells, r => r.clone(subDocument, result));
        result.widthBefore = this.widthBefore.clone();
        result.widthAfter = this.widthAfter.clone();
        result.gridBefore = this.gridBefore;
        result.gridAfter = this.gridAfter;
        result.height = this.height.clone();
        result.tablePropertiesException = this.tablePropertiesException.clone();
        return result;
    }
}
