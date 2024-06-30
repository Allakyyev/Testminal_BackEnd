import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RtfTableRow } from '../model/table/rtf-table-row';
import { RtfImportData } from '../rtf-import-data';
import { RtfTableCellController } from './rtf-table-cell-controller';
export class RtfTableRowController {
    constructor(tableController) {
        this.tableController = tableController;
        this.cellController = this.createCellController();
    }
    createCellController() {
        return new RtfTableCellController(this);
    }
    startNewRow() {
        const table = this.tableController.currentTable;
        this.currentRow = new RtfTableRow(table);
        this.cellController.startNewCell();
    }
    isCurrentRowNotComplete() {
        return !ListUtils.elementBy(this.tableController.currentTable.rows, r => r == this.currentRow) &&
            (this.currentRow.cells.length > 0 || this.cellController.isCurrentCellNotComplete());
    }
    isCurrentRowValid() {
        return ListUtils.elementBy(this.tableController.currentTable.rows, r => r == this.currentRow) && this.currentRow.cells.length > 0;
    }
    assignLastRowAsCurrent() {
        this.currentRow = ListUtils.last(this.tableController.currentTable.rows);
        this.cellController.assignLastCellAsCurrent();
    }
    finishRow() {
        this.finishRowCore();
        this.assignRowProperties();
    }
    finishRowCore() {
        const currentTable = this.tableController.currentTable;
        this.splitTables(currentTable);
        const rows = this.tableController.currentTable.rows;
        if (rows.length == 0 || ListUtils.last(rows) != this.currentRow) {
            this.currentRow.index = rows.length;
            rows.push(this.currentRow);
        }
    }
    splitTables(currentTable) {
        const rows = currentTable.rows;
        if (rows.length == 0 || ListUtils.last(rows) == this.currentRow)
            return;
        if (currentTable.properties.style != this.tableController.reader.tableProperties.style) {
            this.tableController.changeCurrentTable();
            this.currentRow.table = this.tableController.currentTable;
        }
    }
    assignRowProperties() {
        const reader = this.tableController.reader;
        const tableProperties = this.tableController.currentTable.properties;
        if (!tableProperties.isChanged())
            tableProperties.copyFrom(reader.tableProperties);
        tableProperties.style = reader.tableProperties.style;
        const properties = reader.rowProperties;
        this.currentRow.properties.copyFrom(properties);
        this.assignCellProperties();
    }
    assignCellProperties() {
        const reader = this.tableController.reader;
        const cellPropertiesCount = reader.cellPropertiesCollection.length;
        if (cellPropertiesCount == 0)
            RtfImportData.throwInvalidRtfFile();
        const cells = this.currentRow.cells;
        while (cells.length > cellPropertiesCount && cells.length > 1) {
            cells[1].startPos = cells[0].startPos;
            cells.shift();
        }
        cells.forEach((cell, index) => {
            cell.properties.copyFrom(reader.cellPropertiesCollection[index]);
        });
    }
    reset() {
        this.currentRow = null;
        this.cellController.reset();
    }
}
