import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
export class ParentLinkTableCell {
    constructor() {
        this.parentCell = null;
        this.parentLink = null;
        this.layoutRowIndexInParentCell = -1;
    }
    createParentLink() {
        return this.createParentLinkInternal(this);
    }
    createParentLinkInternal(link) {
        if (link.parentLink)
            return this.createParentLinkInternal(link.parentLink);
        var newLink = new ParentLinkTableCell();
        link.parentLink = newLink;
        return newLink;
    }
}
export class TableCellIterator {
    constructor(position, layout, measurer) {
        this.tableIndex = -1;
        this.tableRowIndex = -1;
        this.tableCellIndex = -1;
        this.layoutRowIndexInCell = -1;
        this.layoutRowIndexInLayout = -1;
        this.layoutRowIndexInLayoutInitial = -1;
        this.pageIndex = 0;
        this.pageAreaIndex = 0;
        this.columnIndex = 0;
        this.skipCalculateCellIndex = false;
        this.canCalculateLastCellIndex = false;
        this.position = position;
        this.layout = layout;
        this.measurer = measurer;
        this.setPositionProperties();
        if (this.readTables(this.position.column.tablesInfo)) {
            for (let tableIndex = 0, table; table = this.position.column.tablesInfo[tableIndex]; tableIndex++)
                if (table == this.tableInfo) {
                    this.tableIndex = tableIndex;
                    break;
                }
        }
    }
    get tableCellInfo() {
        return this.tableCellInfoInternal;
    }
    get isInTable() {
        return this.layoutRowIndexInCell > -1;
    }
    readTables(tables, parentCell = null, layountIndex = -1) {
        for (let tableIndex = 0, table; table = tables[tableIndex]; tableIndex++) {
            for (let rowIndex = 0, row; row = table.tableRows[rowIndex]; rowIndex++) {
                for (let cellIndex = 0, cell; cell = table.tableRows[rowIndex].rowCells[cellIndex]; cellIndex++) {
                    for (var layountRowIndex in cell.internalTables) {
                        if (this.readTables(this.getConvertedObjectToArray(cell.internalTables), cell, parseInt(layountRowIndex))) {
                            var link = this.parentLink.createParentLink();
                            link.parentCell = parentCell;
                            link.layoutRowIndexInParentCell = layountIndex;
                            return true;
                        }
                    }
                    var index = SearchUtils.binaryIndexOf(cell.layoutRows, (row) => row.indexInColumn - this.position.rowIndex);
                    if (index >= 0) {
                        this.tableInfo = table;
                        this.tableRowIndex = rowIndex;
                        this.tableRowInfo = row;
                        this.tableCellIndex = cellIndex;
                        this.tableCellInfoInternal = cell;
                        this.layoutRowIndexInCell = index;
                        this.layoutRowIndexInLayout = cell.layoutRows[index].indexInColumn;
                        this.layoutRowIndexInLayoutInitial = this.layoutRowIndexInLayout;
                        this.parentLink = new ParentLinkTableCell();
                        this.parentLink.parentCell = parentCell;
                        this.parentLink.layoutRowIndexInParentCell = layountIndex;
                        return true;
                    }
                }
            }
        }
        return false;
    }
    getConvertedObjectToArray(obj) {
        return NumberMapUtils.toList(obj);
    }
    setPositionProperties() {
        this.pageIndex = this.position.pageIndex;
        this.pageAreaIndex = this.position.pageAreaIndex;
        this.columnIndex = this.position.columnIndex;
    }
    isMainSubDocument() {
        return this.position.pageArea.subDocument.isMain();
    }
    getSelectedInterval() {
        return this.tableInfo.logicInfo.grid.table.rows[this.tableRowIndex].cells[this.tableCellInfoInternal.cellGridIndex].interval;
    }
    getModifyPosition() {
        var newPosition = this.position.clone();
        if (this.isMainSubDocument()) {
            newPosition.pageIndex = this.pageIndex;
            newPosition.pageAreaIndex = this.pageAreaIndex;
            newPosition.columnIndex = this.columnIndex;
            newPosition.page = this.layout.pages[newPosition.pageIndex];
            newPosition.pageArea = newPosition.page.mainSubDocumentPageAreas[newPosition.pageAreaIndex];
            newPosition.column = newPosition.pageArea.columns[newPosition.columnIndex];
        }
        newPosition.rowIndex = this.layoutRowIndexInLayout;
        newPosition.row = newPosition.column.rows[newPosition.rowIndex];
        return newPosition;
    }
    tryAdvanceToRightCell() {
        this.skipCalculateCellIndex = true;
        this.tableCellIndex++;
        if (this.tableCellIndex >= this.tableRowInfo.rowCells.length) {
            this.tableCellIndex = 0;
            return this.tryAdvanceToBelowRowInternal();
        }
        return this.updateTableInfosIfAdvanceToBelowRow();
    }
    tryAdvanceToLeftCell() {
        this.skipCalculateCellIndex = true;
        this.tableCellIndex--;
        if (this.tableCellIndex < 0) {
            this.canCalculateLastCellIndex = true;
            return this.tryAdvanceToAboveRowInternal();
        }
        return this.updateTableInfosIfAdvanceToAboveRow();
    }
    tryAdvanceToBelowRow() {
        if (!this.canAdvanceToBelowRow())
            return false;
        return this.tryAdvanceToBelowRowInternal();
    }
    tryAdvanceToBelowRowInternal() {
        this.isDownDirection = true;
        this.tableRowIndex++;
        if (this.tableRowIndex >= this.tableInfo.tableRows.length) {
            this.tableRowIndex = 0;
            this.tableIndex = 0;
            if (!this.isMainSubDocument())
                return this.tryAdvanceToLayoutRowBelowTable();
            this.columnIndex++;
            if (this.columnIndex >= this.position.pageArea.columns.length) {
                this.columnIndex = 0;
                this.pageAreaIndex++;
                if (this.pageAreaIndex >= this.position.page.mainSubDocumentPageAreas.length) {
                    this.pageAreaIndex = 0;
                    this.pageIndex++;
                    if (this.pageIndex >= this.layout.validPageCount)
                        return this.tryAdvanceToLayoutRowBelowTable();
                }
            }
        }
        if (this.updateTableInfosIfAdvanceToBelowRow())
            return true;
        return this.tryAdvanceToLayoutRowBelowTable();
    }
    updateTableInfosIfAdvanceToBelowRow() {
        var tables = this.getTables();
        if (tables.length > 0 && this.isEqualTables(tables[this.tableIndex], this.tableInfo)) {
            this.tableInfo = tables[this.tableIndex];
            this.tableRowInfo = this.tableInfo.tableRows[this.tableRowIndex];
            if (!this.skipCalculateCellIndex)
                this.tableCellIndex = this.findNextCellIndex(this.tableRowInfo);
            this.tableCellInfoInternal = this.tableRowInfo.rowCells[this.tableCellIndex];
            while (!this.tableCellInfoInternal.layoutRows.length) {
                this.tableInfo = this.tableCellInfoInternal.internalTables[0];
                this.tableRowIndex = 0;
                this.tableRowInfo = this.tableInfo.tableRows[this.tableRowIndex];
                this.tableCellIndex = 0;
                this.tableCellInfoInternal = this.tableRowInfo.rowCells[this.tableCellIndex];
            }
            this.layoutRowIndexInLayout = this.tableCellInfoInternal.layoutRows[0].indexInColumn;
            this.goToInternalTableIfExistInFirstBelowRow();
            return true;
        }
        return false;
    }
    tryAdvanceToAboveRow() {
        if (!this.canAdvanceToAboveRow())
            return false;
        return this.tryAdvanceToAboveRowInternal();
    }
    getLayoutTablesAssociatedWithLogicGrid() {
        var list = [];
        this.setPositionProperties();
        list.push(this.tableInfo);
        while (this.tryAdvanceToAboveTable())
            list.push(this.tableInfo);
        return list;
    }
    tryAdvanceToAboveTable() {
        var columnIndexReset = false;
        var pageAreaIndexReset = false;
        this.columnIndex--;
        if (this.columnIndex < 0) {
            columnIndexReset = true;
            this.pageAreaIndex--;
            if (this.pageAreaIndex < 0)
                pageAreaIndexReset = true;
            this.pageIndex--;
            if (this.pageIndex < 0)
                return false;
        }
        if (pageAreaIndexReset)
            this.pageAreaIndex = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas.length - 1;
        if (columnIndexReset)
            this.columnIndex = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas[this.pageAreaIndex].columns.length - 1;
        var tables = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas[this.pageAreaIndex].columns[this.columnIndex].tablesInfo;
        for (let t, i = 0; t = tables[i]; i++) {
            if (t.logicInfo.grid == this.tableInfo.logicInfo.grid) {
                this.tableInfo = t;
                return true;
            }
        }
        return false;
    }
    tryAdvanceToAboveRowInternal() {
        var rowIndexReset = false, columnIndexReset = false, pageAreaIndexReset = false;
        this.isDownDirection = false;
        if (this.tableCellInfoInternal.layoutRows.length == 1 && this.tableCellInfoInternal.internalTables[this.layoutRowIndexInCell])
            if (this.goToInternalTableIfExistInLastAboveRow())
                return true;
        var tables = [];
        this.tableRowIndex--;
        if (this.tableRowIndex < 0) {
            if (!this.isMainSubDocument())
                return this.tryAdvanceToLayoutRowAboveTable();
            rowIndexReset = true;
            this.columnIndex--;
            if (this.columnIndex < 0) {
                columnIndexReset = true;
                this.pageAreaIndex--;
                if (this.pageAreaIndex < 0) {
                    pageAreaIndexReset = true;
                    this.pageIndex--;
                    if (this.pageIndex < 0)
                        return this.tryAdvanceToLayoutRowAboveTable();
                }
            }
            if (pageAreaIndexReset)
                this.pageAreaIndex = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas.length - 1;
            if (columnIndexReset)
                this.columnIndex = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas[this.pageAreaIndex].columns.length - 1;
            if (rowIndexReset) {
                tables = this.getTables();
                if (tables.length == 0)
                    return false;
                this.tableIndex = tables.length - 1;
                this.tableRowIndex = tables[this.tableIndex].tableRows.length - 1;
            }
        }
        if (this.updateTableInfosIfAdvanceToAboveRow())
            return true;
        return this.tryAdvanceToLayoutRowAboveTable();
    }
    updateTableInfosIfAdvanceToAboveRow() {
        var tables = this.getTables();
        if (tables.length > 0 && this.isEqualTables(tables[this.tableIndex], this.tableInfo)) {
            this.tableInfo = tables[this.tableIndex];
            this.tableRowInfo = this.tableInfo.tableRows[this.tableRowIndex];
            if (!this.skipCalculateCellIndex) {
                this.tableCellIndex = this.findNextCellIndex(this.tableRowInfo);
                this.tableRowInfo = this.tableInfo.tableRows[this.tableRowIndex];
            }
            if (this.canCalculateLastCellIndex)
                this.tableCellIndex = this.tableRowInfo.rowCells.length - 1;
            this.tableCellInfoInternal = this.tableRowInfo.rowCells[this.tableCellIndex];
            this.layoutRowIndexInLayout = this.tableCellInfoInternal.layoutRows[this.tableCellInfoInternal.layoutRows.length - 1].indexInColumn;
            this.goToInternalTableIfExistInLastAboveRow();
            return true;
        }
        return false;
    }
    tryAdvanceToLayoutRowBelowTable() {
        this.setPositionProperties();
        var row = ListUtils.last(ListUtils.last(ListUtils.last(this.tableInfo.tableRows).rowCells).layoutRows);
        var column = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas[this.pageAreaIndex].columns[this.columnIndex];
        this.layoutRowIndexInLayout = row.indexInColumn + 1;
        if (this.layoutRowIndexInLayout >= column.rows.length) {
            this.columnIndex++;
            if (this.columnIndex >= this.position.pageArea.columns.length) {
                this.columnIndex = 0;
                this.pageAreaIndex++;
                if (this.pageAreaIndex >= this.position.page.mainSubDocumentPageAreas.length) {
                    this.pageAreaIndex = 0;
                    this.pageIndex++;
                    if (this.pageIndex >= this.layout.validPageCount) {
                        this.setPositionProperties();
                        this.resetLayoutRowIndex();
                        return true;
                    }
                }
            }
            this.layoutRowIndexInLayout = 0;
        }
        return true;
    }
    isAboveLayoutRowOuterTable() {
        return this.parentLink && this.parentLink.parentCell && this.parentLink.layoutRowIndexInParentCell == 0;
    }
    tryAdvanceToLayoutRowOuterTable(parentLink) {
        var parentRow = parentLink.parentCell.parentRow;
        var parentTable = parentRow.parentTable;
        if (parentRow.rowIndex == 0 && parentLink.parentLink.parentCell)
            return this.tryAdvanceToLayoutRowOuterTable(parentLink.parentLink);
        if (parentRow.rowIndex > 0) {
            var index = this.findNextCellIndex(parentTable.tableRows[parentRow.rowIndex - 1], true);
            this.layoutRowIndexInLayout = ListUtils.last(parentTable.tableRows[parentRow.rowIndex - 1].rowCells[index].layoutRows).indexInColumn;
            return true;
        }
        return false;
    }
    tryAdvanceToLayoutRowAboveTable() {
        this.setPositionProperties();
        if (this.isAboveLayoutRowOuterTable())
            return this.tryAdvanceToLayoutRowOuterTable(this.parentLink);
        var columnIndexReset = false, pageAreaIndexReset = false;
        var row = this.tableInfo.tableRows[0].rowCells[0].layoutRows[0];
        this.layoutRowIndexInLayout = row.indexInColumn - 1;
        if (this.layoutRowIndexInLayout < 0) {
            this.columnIndex--;
            if (this.columnIndex < 0) {
                columnIndexReset = true;
                this.pageAreaIndex--;
                if (this.pageAreaIndex < 0) {
                    pageAreaIndexReset = true;
                    this.pageIndex--;
                    if (this.pageIndex < 0) {
                        this.setPositionProperties();
                        this.resetLayoutRowIndex();
                        return true;
                    }
                }
            }
            if (pageAreaIndexReset)
                this.pageAreaIndex = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas.length - 1;
            if (columnIndexReset)
                this.columnIndex = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas[this.pageAreaIndex].columns.length - 1;
            var rows = this.layout.pages[this.pageIndex].mainSubDocumentPageAreas[this.pageAreaIndex].columns[this.columnIndex].rows;
            this.layoutRowIndexInLayout = rows.length - 1;
        }
        return true;
    }
    goToInternalTableIfExistInFirstBelowRow() {
        if (this.tableCellInfoInternal.internalTables && this.tableCellInfoInternal.internalTables[0]) {
            var internalTable = this.tableCellInfoInternal.internalTables[0];
            this.tableCellInfoInternal = internalTable.tableRows[0].rowCells[this.findNextCellIndex(internalTable.tableRows[0])];
            if (this.goToInternalTableIfExistInFirstBelowRow())
                return true;
            this.layoutRowIndexInLayout = this.tableCellInfoInternal.layoutRows[0].indexInColumn;
            return true;
        }
        return false;
    }
    goToInternalTableIfExistInLastAboveRow() {
        var lastLayoutRowIndexInInternalTable = this.tableCellInfoInternal.layoutRows.length - 1;
        if (this.tableCellInfoInternal.internalTables && this.tableCellInfoInternal.internalTables[lastLayoutRowIndexInInternalTable]) {
            var internalTable = this.tableCellInfoInternal.internalTables[lastLayoutRowIndexInInternalTable];
            var lastTableRowIndex = internalTable.tableRows.length - 1;
            var cellIndexInInternalTable = this.findNextCellIndex2(internalTable.tableRows[lastTableRowIndex]);
            var lastLayoutRowIndex = internalTable.tableRows[lastTableRowIndex].rowCells[cellIndexInInternalTable].layoutRows.length - 1;
            this.layoutRowIndexInLayout = internalTable.tableRows[lastTableRowIndex].rowCells[cellIndexInInternalTable].layoutRows[lastLayoutRowIndex].indexInColumn;
            return true;
        }
        return false;
    }
    canAdvanceToBelowRow() {
        return this.isInTable && this.layoutRowIndexInCell == this.tableCellInfoInternal.layoutRows.length - 1;
    }
    canAdvanceToAboveRow() {
        return this.isInTable && this.layoutRowIndexInCell == 0;
    }
    resetLayoutRowIndex() {
        this.layoutRowIndexInLayout = this.layoutRowIndexInLayoutInitial;
    }
    isEqualTables(table1, table2) {
        return table1.logicInfo.grid == table2.logicInfo.grid;
    }
    getTables() {
        if (this.isMainSubDocument())
            return this.layout.pages[this.pageIndex].mainSubDocumentPageAreas[this.pageAreaIndex].columns[this.columnIndex].tablesInfo;
        return this.position.column.tablesInfo;
    }
    findNextCellIndex(newRow, skipSearchCellInAllTable = false) {
        var x = this.position.box.getCharOffsetXInPixels(this.measurer, this.position.charOffset) + this.position.box.x + this.position.row.x;
        if (!this.isDownDirection && !skipSearchCellInAllTable) {
            for (let tableRowInfoIndex = this.tableRowIndex; tableRowInfoIndex >= 0; tableRowInfoIndex--) {
                const tableRowInfo = this.tableInfo.tableRows[tableRowInfoIndex];
                const tableCellInfoIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(tableRowInfo.rowCells, (c) => c.x, x));
                var tableCellInfo = tableRowInfo.rowCells[tableCellInfoIndex];
                if (x >= tableCellInfo.x && x <= (tableCellInfo.x + tableCellInfo.width)) {
                    this.tableRowIndex = tableRowInfoIndex;
                    return tableCellInfoIndex;
                }
            }
        }
        for (var i = 0; i < newRow.rowCells.length; i++) {
            var cell = newRow.rowCells[i];
            if (x >= cell.x && x <= cell.right)
                return i;
        }
        return 0;
    }
    findNextCellIndex2(newRow) {
        var x = this.position.box.getCharOffsetXInPixels(this.measurer, this.position.charOffset) + this.position.box.x + this.position.row.x;
        if (!this.isDownDirection) {
            const tableCellInfoIndex = Math.max(0, SearchUtils.normedInterpolationIndexOf(newRow.rowCells, (c) => c.x, x));
            var tableCellInfo = newRow.rowCells[tableCellInfoIndex];
            if (x >= tableCellInfo.x && x <= (tableCellInfo.right)) {
                this.tableRowIndex = newRow.rowIndex;
                return tableCellInfoIndex;
            }
        }
        for (var i = 0; i < newRow.rowCells.length; i++) {
            var cell = newRow.rowCells[i];
            if (x >= cell.x && x <= cell.right)
                return i;
        }
        return 0;
    }
}
