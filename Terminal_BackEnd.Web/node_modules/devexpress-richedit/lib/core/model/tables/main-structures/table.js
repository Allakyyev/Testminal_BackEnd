import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { TableAlignmentApplier } from '../../../layout-formatter/table/table-alignment-applier';
import { TablePropertiesMergerBorderBottom, TablePropertiesMergerBorderHorizontal, TablePropertiesMergerBorderLeft, TablePropertiesMergerBorderRight, TablePropertiesMergerBorderTop, TablePropertiesMergerBorderVertical, TablePropertiesMergerIndent, TablePropertiesMergerLayoutType, TablePropertiesMergerMarginBottom, TablePropertiesMergerMarginLeft, TablePropertiesMergerMarginRight, TablePropertiesMergerMarginTop } from '../properties-mergers/table-properties-merger';
import { ConditionalTableStyleFormatting, TableCellMergingState, TableLookTypes, TableRowAlignment } from '../secondary-structures/table-base-structures';
import { TableWidthUnit } from '../secondary-structures/table-units';
export class Table {
    constructor(properties, style) {
        this.rows = [];
        this.preferredWidth = TableWidthUnit.createDefault();
        this.lookTypes = TableLookTypes.None;
        this.properties = properties;
        this.style = style;
    }
    getTotalVirtualColumnsCount() {
        return ListUtils.maxExtended(this.rows, row => row.getTotalCellsInRowConsiderGrid()).maxValue;
    }
    destructor(positionManager) {
        for (var rowIndex = 0, tableRow; tableRow = this.rows[rowIndex]; rowIndex++)
            tableRow.destructor(positionManager);
    }
    get interval() { return FixedInterval.fromPositions(this.getStartPosition(), this.getEndPosition()); }
    getParentTable() {
        const parentCell = this.parentCell;
        return parentCell ? this.parentCell.parentRow.parentTable : null;
    }
    getTopLevelParent() {
        let currTable = this;
        while (currTable.parentCell)
            currTable = currTable.getParentTable();
        return currTable;
    }
    getStartPosition() {
        return this.rows[0].getStartPosition();
    }
    getEndPosition() {
        return this.rows[this.rows.length - 1].getEndPosition();
    }
    getLastCell() {
        let lastRow = this.rows[this.rows.length - 1];
        return lastRow.cells[lastRow.cells.length - 1];
    }
    getFirstCell() {
        return this.rows[0].cells[0];
    }
    getActualLeftBorder(defaultTableProperties, isTableOuterBorder = true) {
        return this.getActualBorderCore(new TablePropertiesMergerBorderLeft(isTableOuterBorder), defaultTableProperties);
    }
    getActualRightBorder(defaultTableProperties, isTableOuterBorder = true) {
        return this.getActualBorderCore(new TablePropertiesMergerBorderRight(isTableOuterBorder), defaultTableProperties);
    }
    getActualBottomBorder(defaultTableProperties, isTableOuterBorder = true) {
        return this.getActualBorderCore(new TablePropertiesMergerBorderBottom(isTableOuterBorder), defaultTableProperties);
    }
    getActualTopBorder(defaultTableProperties, isTableOuterBorder = true) {
        return this.getActualBorderCore(new TablePropertiesMergerBorderTop(isTableOuterBorder), defaultTableProperties);
    }
    getActualHorizontalBorder(defaultTableProperties) {
        return this.getActualBorderCore(new TablePropertiesMergerBorderHorizontal(), defaultTableProperties);
    }
    getActualVerticalBorder(defaultTableProperties) {
        return this.getActualBorderCore(new TablePropertiesMergerBorderVertical(), defaultTableProperties);
    }
    getActualBorderCore(tablePropertiesMerger, defaultTableProperties) {
        return tablePropertiesMerger.getProperty(this.properties, this.style, ConditionalTableStyleFormatting.WholeTable, defaultTableProperties);
    }
    getActualLeftMargin(defaultTableProperties) {
        return this.getActualMarginCore(new TablePropertiesMergerMarginLeft(), defaultTableProperties);
    }
    getActualRightMargin(defaultTableProperties) {
        return this.getActualMarginCore(new TablePropertiesMergerMarginRight(), defaultTableProperties);
    }
    getActualTopMargin(defaultTableProperties) {
        return this.getActualMarginCore(new TablePropertiesMergerMarginTop(), defaultTableProperties);
    }
    getActualBottomMargin(defaultTableProperties) {
        return this.getActualMarginCore(new TablePropertiesMergerMarginBottom(), defaultTableProperties);
    }
    getActualMarginCore(merger, defaultTableProperties) {
        return merger.getProperty(this.properties, this.style, ConditionalTableStyleFormatting.WholeTable, defaultTableProperties);
    }
    getActualTableAlignment() {
        return TableAlignmentApplier.getTableAlignment(this);
    }
    getActualTableIndent(defaultTableProperties) {
        const aligment = this.getActualTableAlignment();
        if (aligment != TableRowAlignment.Left)
            return TableWidthUnit.createDefault();
        return new TablePropertiesMergerIndent().getProperty(this.properties, this.style, ConditionalTableStyleFormatting.WholeTable, defaultTableProperties);
    }
    getActualTableLayout(defaultTableProperties) {
        return new TablePropertiesMergerLayoutType().getProperty(this.properties, this.style, ConditionalTableStyleFormatting.WholeTable, defaultTableProperties);
    }
    static comparer(a, b) {
        const cmpPos = a.getStartPosition() - b.getStartPosition();
        return cmpPos == 0 ? a.nestedLevel - b.nestedLevel : cmpPos;
    }
    static sort(tables) {
        tables.sort(Table.comparer);
        for (let tableIndex = 0, table; table = tables[tableIndex]; tableIndex++)
            table.index = tableIndex;
    }
    static advanceIndices(tables, startIndex, shift) {
        for (let i = startIndex, table; table = tables[i]; i++)
            table.index += shift;
    }
    static fillTableByLevels(subDocument) {
        const tableByLevels = subDocument.tablesByLevels;
        let tableByLevelsLength = tableByLevels.length;
        for (let tableIndex = 0, table; table = subDocument.tables[tableIndex]; tableIndex++) {
            table.index = tableIndex;
            if (table.nestedLevel >= tableByLevelsLength) {
                tableByLevels.push([]);
                tableByLevelsLength++;
            }
            tableByLevels[table.nestedLevel].push(table);
        }
    }
    static getTableCellByPosition(tables, position) {
        const table = Table.getTableByPosition(tables, position, true);
        return table ? Table.getTableCellByPositionFromTable(table, position) : null;
    }
    static getTableCellByPositionFromTable(table, position) {
        const rowIndex = SearchUtils.normedInterpolationIndexOf(table.rows, r => r.getStartPosition(), position);
        const row = table.rows[rowIndex];
        const cellIndex = SearchUtils.normedInterpolationIndexOf(row.cells, c => c.startParagraphPosition.value, position);
        return row.cells[cellIndex];
    }
    static getTableByPosition(tables, position, maxNestedLevel, tableIndex = SearchUtils.normedInterpolationIndexOf(tables, (t) => t.getStartPosition(), position)) {
        if (tableIndex < 0)
            return null;
        let table = tables[tableIndex];
        while (position >= table.getEndPosition()) {
            if (table.nestedLevel === 0)
                return null;
            table = table.getParentTable();
        }
        return Table.correctBoundTable(tables, table.index, position, maxNestedLevel ? (index) => ++index : (index) => --index);
    }
    static correctBoundTable(tables, tableIndex, position, indexIterator) {
        let table = tables[tableIndex];
        let tablePos = table.getStartPosition();
        tableIndex = indexIterator(tableIndex);
        for (let neighborTable; neighborTable = tables[tableIndex]; tableIndex = indexIterator(tableIndex)) {
            const neighborTablePos = neighborTable.getStartPosition();
            if (tablePos != neighborTablePos || position >= neighborTable.getEndPosition())
                break;
            tablePos = neighborTablePos;
            table = neighborTable;
        }
        return table;
    }
    static getFirstCellPositionInVerticalMergingGroup(tablePosition) {
        if (tablePosition.cell.verticalMerging != TableCellMergingState.Continue)
            return tablePosition;
        const tblPos = tablePosition.clone().init();
        const cellColumnIndex = tblPos.row.getCellColumnIndex(tblPos.cellIndex);
        while (tblPos.moveToPrevRow()) {
            let columnIndex = tblPos.row.gridBefore;
            tblPos.setCell(0);
            do {
                if (cellColumnIndex <= columnIndex) {
                    if (tblPos.cell.verticalMerging != TableCellMergingState.Continue || tblPos.rowIndex == 0)
                        return tblPos;
                    else
                        break;
                }
                columnIndex += tblPos.cell.columnSpan;
            } while (tblPos.moveToNextCell());
        }
        return null;
    }
    clone(subDocument) {
        const result = new Table(this.properties.clone(), subDocument.documentModel.stylesManager.getTableStyleByName(this.style.styleName));
        result.index = this.index;
        result.nestedLevel = this.nestedLevel;
        const tablesOnLevel = subDocument.tablesByLevels[result.nestedLevel];
        if (!tablesOnLevel)
            subDocument.tablesByLevels.push([result]);
        else
            tablesOnLevel.push(result);
        if (this.parentCell)
            result.parentCell = Table.getTableCellByPositionFromTable(subDocument.tables[this.parentCell.parentRow.parentTable.index], this.parentCell.startParagraphPosition.value);
        result.rows = ListUtils.map(this.rows, r => r.clone(subDocument, result));
        result.preferredWidth = this.preferredWidth.clone();
        result.lookTypes = this.lookTypes;
        return result;
    }
}
export class TablePositionIndexes {
    constructor(rowIndex, cellIndex) {
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
    }
    equals(obj) {
        return obj &&
            this.cellIndex == obj.cellIndex &&
            this.rowIndex == obj.rowIndex;
    }
    copyFrom(obj) {
        this.rowIndex = obj.rowIndex;
        this.cellIndex = obj.cellIndex;
    }
    clone() {
        return new TablePositionIndexes(this.rowIndex, this.cellIndex);
    }
}
export class TablePosition extends TablePositionIndexes {
    constructor(table, rowIndex, cellIndex) {
        super(rowIndex, cellIndex);
        this.table = table;
    }
    initIndexes(rowIndex, cellIndex) {
        this.rowIndex = rowIndex;
        this.cellIndex = cellIndex;
        return this;
    }
    init() {
        this.row = this.table.rows[this.rowIndex];
        this.cell = this.row.cells[this.cellIndex];
        return this;
    }
    setRow(rowIndex) {
        this.rowIndex = rowIndex;
        this.row = this.table.rows[this.rowIndex];
        return this;
    }
    setCell(cellIndex) {
        this.cellIndex = cellIndex;
        this.cell = this.row.cells[cellIndex];
    }
    static createAndInit(table, rowIndex, cellIndex) {
        const position = new TablePosition(table, rowIndex, cellIndex);
        position.init();
        return position;
    }
    static indexOfCell(positions, cell) {
        for (let i = 0, pos; pos = positions[i]; i++) {
            if (pos.cell === cell)
                return i;
        }
        return -1;
    }
    moveToPrevRow() {
        if (!this.rowIndex)
            return false;
        this.rowIndex--;
        this.row = this.table.rows[this.rowIndex];
        return true;
    }
    moveToNextRow() {
        if (this.rowIndex == this.table.rows.length - 1)
            return false;
        this.rowIndex++;
        this.row = this.table.rows[this.rowIndex];
        this.cellIndex = -1;
        return true;
    }
    moveToNextCell() {
        if (this.cellIndex == this.row.cells.length - 1)
            return false;
        this.cellIndex++;
        this.cell = this.row.cells[this.cellIndex];
        return true;
    }
    copyFrom(obj) {
        super.copyFrom(obj);
        this.table = obj.table;
        this.row = obj.row;
        this.cell = obj.cell;
    }
    clone() {
        const pos = new TablePosition(this.table, this.rowIndex, this.cellIndex);
        pos.row = this.row;
        pos.cell = this.cell;
        return pos;
    }
    equals(obj) {
        return obj &&
            this.table == obj.table &&
            this.rowIndex == obj.rowIndex &&
            this.cellIndex == obj.cellIndex;
    }
}
