import { __awaiter } from "tslib";
import { MapCreator } from '../../../../../base-utils/map-creator';
import { Table } from '../../../../../core/model/tables/main-structures/table';
import { TableLayoutType } from '../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TableWidthUnitType } from '../../../../../core/model/tables/secondary-structures/table-units';
import { TableConditionalFormattingCalculator } from '../../../../../core/model/tables/table-utils';
import { EnumUtils } from '@devexpress/utils/lib/utils/enum';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { BookmarkEndElementDestination } from '../../bookmark/bookmark-end-element-destination';
import { BookmarkStartElementDestination } from '../../bookmark/bookmark-start-element-destination';
import { CustomXmlDestination, ElementDestination, EmptyDestination } from '../../destination';
import { RangePermissionEndElementDestination } from '../../range-permission/range-permission-end-element-destination';
import { RangePermissionStartElementDestination } from '../../range-permission/range-permission-start-element-destination';
import { DeletedRunContentDestination } from '../../runs/deleted-run-content-destination';
import { InsertedRunContentDestination } from '../../runs/inserted-run-content-destination';
import { StructuredDocumentDestination } from '../../structured-document-destination';
import { TableRowDestination } from '../row/table-row-destination';
import { TablePropertiesDestination } from './properties/table-properties-destination';
import { TableGridDestination } from './table-grid-destination';
export class TableDestination extends ElementDestination {
    constructor(data, parentCell = null) {
        super(data);
        this.table = new Table(this.data.subDocumentInfo.tableImporter.createDefaultTableProperties(), this.data.documentModel.stylesManager.getDefaultTableStyle());
        this.table.nestedLevel = this.data.subDocumentInfo.tableStack.count;
        this.table.parentCell = parentCell;
        this.tableGrid = [];
    }
    get elementHandlerTable() {
        return TableDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.data.subDocument.tables.push(this.table);
            this.data.subDocumentInfo.tableStack.push(this.table);
        });
    }
    processElementClose(_reader) {
        if (!this.table.rows.length)
            return this.data.subDocumentInfo.tableImporter.cancelTable(this.table);
        if (this.table.properties.layoutType == TableLayoutType.Fixed && this.tableGrid.length > 0)
            this.ensureTableCellsWidth(this.table);
        this.data.subDocumentInfo.tableStack.pop();
        TableConditionalFormattingCalculator.updateTableWithoutHistory(this.data.documentModel, this.table);
    }
    ensureTableCellsWidth(table) {
        for (const tableRow of table.rows) {
            let columnIndex = 0;
            const cellsCount = tableRow.cells.length;
            ListUtils.forEach(tableRow.cells, (cell, cellIndex) => {
                const remainedCellsCount = cellsCount - cellIndex - 1;
                const maxAvailableColumnSpan = this.tableGrid.length - columnIndex - remainedCellsCount;
                const columnSpan = Math.min(maxAvailableColumnSpan, cell.columnSpan);
                const prefWidth = cell.preferredWidth;
                if (EnumUtils.isAnyOf(prefWidth.type, TableWidthUnitType.Nil, TableWidthUnitType.Auto)) {
                    prefWidth.value = ListUtils.accumulateNumber(this.tableGrid, v => v, 0, columnIndex, columnIndex + columnSpan);
                    prefWidth.type = TableWidthUnitType.ModelUnits;
                }
                columnIndex += columnSpan;
            });
        }
    }
}
TableDestination.handlerTable = new MapCreator()
    .add('tr', (data) => new TableRowDestination(data, TableDestination.getThis(data).table))
    .add('tblPr', (data) => new TablePropertiesDestination(data, TableDestination.getThis(data).table))
    .add('sdt', (data) => new StructuredDocumentDestination(data))
    .add('customXml', (data) => new CustomXmlDestination(data))
    .add('tblGrid', (data) => new TableGridDestination(data, TableDestination.getThis(data).tableGrid))
    .add('del', (data) => data.options.ignoreDeletedText ? new EmptyDestination(data) : new DeletedRunContentDestination(data))
    .add('ins', (data) => data.options.ignoreInsertedText ? new EmptyDestination(data) : new InsertedRunContentDestination(data))
    .add('bookmarkStart', (data) => new BookmarkStartElementDestination(data))
    .add('bookmarkEnd', (data) => new BookmarkEndElementDestination(data))
    .add('permStart', (data) => new RangePermissionStartElementDestination(data))
    .add('permEnd', (data) => new RangePermissionEndElementDestination(data))
    .get();
