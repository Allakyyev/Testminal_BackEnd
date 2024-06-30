import { TableIterator } from '../../../../../core/layout-formatter/box/generator/recursive-objects-iterators';
import { TableCellPropertiesMask } from '../../../../../core/model/tables/properties/table-cell-properties';
import { TableRowPropertiesMask } from '../../../../../core/model/tables/properties/table-row-properties';
import { TableCellMergingState } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { BaseExporter } from '../../base';
import { TableCellPropertiesExporter } from './table-cell-properties';
import { TableRowPropertiesExporter } from './table-row-properties';
export class TableExporter extends BaseExporter {
    constructor() {
        super(...arguments);
        this.tableIndexes = [];
        this.tableInfo = [];
        this.initTableDeferred = false;
    }
    get tables() { return this.data.subDocumentExporter.subDocument.tables; }
    init() {
        this.tableIterator = new TableIterator(this.tables);
        this.tableIterator.init(0);
    }
    checkTable(pos, allowInitNextTable) {
        const newIndexes = this.tableIterator.indexes;
        if (newIndexes.length) {
            const newTableInfo = this.tableIterator.generateInfo(pos);
            this.handleNextCell(this.tableInfo ? ListUtils.last(this.tableInfo) : null, ListUtils.last(newTableInfo));
            this.tableInfo = newTableInfo;
        }
        if (this.initTableDeferred || this.tableIterator.update(pos) || pos == 0 &&
            this.tableIterator.indexes.length) {
            this.initTableDeferred = false;
            this.closeTables(newIndexes);
            this.initNewTables(newIndexes, allowInitNextTable);
            if (allowInitNextTable)
                this.tableInfo = this.tableIterator.generateInfo(pos);
        }
    }
    getTableGrid(table) {
        if (table.rows[0].logicColumnCount < 64)
            return [];
        const colGrid = [];
        return colGrid;
    }
    initNewTables(newIndexes, allowInitNextTable) {
        for (let levelIndex = this.tableIndexes.length; levelIndex < newIndexes.length; levelIndex++) {
            if (allowInitNextTable) {
                const table = this.tables[newIndexes[levelIndex]];
                this.tableIndexes.push(table.index);
                this.startTable(table);
                this.startRow(table.rows[0]);
                this.startCell(table.rows[0].cells[0]);
            }
            else {
                this.initTableDeferred = true;
                break;
            }
        }
    }
    closeTables(newIndexes) {
        let lastEqualTableIndex = 0;
        const listLength = this.tableIndexes.length;
        for (let index = 0; index < listLength; index++) {
            const newInd = newIndexes[index];
            if (newInd === undefined || this.tableIndexes[index] != newInd)
                break;
            lastEqualTableIndex++;
        }
        for (let countOfDeletedTables = this.tableIndexes.length - lastEqualTableIndex; countOfDeletedTables > 0; countOfDeletedTables--) {
            this.tableIndexes.pop();
            this.tableInfo.pop();
            this.writer.endElement();
            this.writer.endElement();
            this.writer.endElement();
        }
    }
    handleNextCell(oldInfo, newInfo) {
        if (!oldInfo || !newInfo)
            return;
        else if (oldInfo.rowIndex != newInfo.rowIndex) {
            this.writer.endElement();
            this.writer.endElement();
            this.startRow(newInfo.row);
            this.startCell(newInfo.cell);
        }
        else if (oldInfo.cellIndex != newInfo.cellIndex) {
            this.writer.endElement();
            this.startCell(newInfo.cell);
        }
    }
    startTable(table) {
        this.writer.writeWpStartElement('tbl');
        this.exportTableProperties(table);
        this.exportTableGrid(table);
    }
    startRow(row) {
        this.writer.writeWpStartElement('tr');
        this.data.tablePropsExporter.exportTablePropertiesException(row.tablePropertiesException);
        if (row.properties.mask != TableRowPropertiesMask.UseNone ||
            row.gridBefore || row.gridAfter || row.gridBefore || row.height.value != 0)
            new TableRowPropertiesExporter(this.data).exportTableRowProperties(row);
    }
    startCell(cell) {
        this.writer.writeWpStartElement('tc');
        if (this.allowExportTableCellProperties(cell))
            new TableCellPropertiesExporter(this.data).exportTableCellProperties(cell);
    }
    exportTableProperties(table) {
        this.writer.writeWpStartElement('tblPr');
        if (table.style)
            this.writer.writeWpStringValue('tblStyle', this.data.tblStyleExporter.getStyleId(this.data.tblStyleExporter.getStyleIndexByName(table.style.styleName)));
        this.data.tablePropsExporter.exportTablePropertiesCore(table, true);
        this.writer.endElement();
    }
    exportTableGrid(table) {
        this.writer.writeWpStartElement('tblGrid');
        for (const column of this.getTableGrid(table)) {
            this.writer.writeWpStartElement('gridCol');
            this.writer.writeWpIntAttr('w', Math.max(1, column));
            this.writer.endElement();
        }
        this.writer.endElement();
    }
    allowExportTableCellProperties(cell) {
        const props = cell.properties;
        return !this.data.tableWidthExporter.forbidExportWidthUnit(cell.preferredWidth) ||
            cell.verticalMerging != TableCellMergingState.None ||
            props.mask != TableCellPropertiesMask.UseNone ||
            cell.columnSpan > 1 ||
            cell.verticalMerging != TableCellMergingState.None;
    }
}
