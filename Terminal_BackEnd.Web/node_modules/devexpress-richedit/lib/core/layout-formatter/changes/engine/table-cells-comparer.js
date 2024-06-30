export class TableCellsComparer {
    constructor() {
        this.cache = {};
    }
    reset() {
        this.cache = {};
    }
    isEquivalent(layoutRowA, layoutRowB) {
        const tableCellA = layoutRowA.tableCellInfo;
        const tableCellB = layoutRowB.tableCellInfo;
        if (!tableCellA && !tableCellB)
            return true;
        if (tableCellA && !tableCellB || !tableCellA && tableCellB)
            return false;
        return this.isCellsEquivalent(tableCellA, tableCellB) &&
            TableCellsComparer.rowsEqualIndex(tableCellA, layoutRowA, tableCellB, layoutRowB);
    }
    isCellsEquivalent(tableCellA, tableCellB) {
        const keyA = TableCellsComparer.getKey(tableCellA);
        const keyB = TableCellsComparer.getKey(tableCellB);
        let cache = this.cache[keyA];
        if (!cache)
            cache = this.cache[keyA] = {};
        const cacheCellsEquivalent = cache[keyB];
        return cacheCellsEquivalent === undefined ? cache[keyB] = TableCellsComparer.compareCells(tableCellA, tableCellB) : cacheCellsEquivalent;
    }
    static compareCells(tableCellA, tableCellB) {
        const tableRowA = tableCellA.parentRow;
        const tableRowB = tableCellB.parentRow;
        const tableA = tableRowA.parentTable;
        const tableB = tableRowB.parentTable;
        return tableA.logicInfo.grid.table == tableB.logicInfo.grid.table &&
            tableRowA.rowIndex == tableRowB.rowIndex &&
            tableCellA.cellGridIndex == tableCellB.cellGridIndex &&
            tableCellA.layoutRows.length == tableCellB.layoutRows.length &&
            TableCellsComparer.equalLengthAndPosition(tableRowA.rowCells, tableCellA, tableRowB.rowCells, tableCellB) &&
            TableCellsComparer.equalLengthAndPosition(tableA.tableRows, tableRowA, tableB.tableRows, tableRowB);
    }
    static equalLengthAndPosition(listA, elemA, listB, elemB) {
        return listA.length == listB.length && listA.indexOf(elemA) == listB.indexOf(elemB);
    }
    static getKey(tableCellA) {
        const row = tableCellA.parentRow;
        return row.parentTable.logicInfo.grid.table.index << (16 * 2) | row.rowIndex << 16 | tableCellA.cellGridIndex;
    }
    static rowsEqualIndex(tableCellA, layoutRowA, tableCellB, layoutRowB) {
        return tableCellA.layoutRows.indexOf(layoutRowA) == tableCellB.layoutRows.indexOf(layoutRowB);
    }
}
