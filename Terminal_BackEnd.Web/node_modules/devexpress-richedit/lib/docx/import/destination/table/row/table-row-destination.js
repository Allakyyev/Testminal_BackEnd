import { __awaiter } from "tslib";
import { MapCreator } from '../../../../../base-utils/map-creator';
import { TableRow } from '../../../../../core/model/tables/main-structures/table-row';
import { BookmarkEndElementDestination } from '../../bookmark/bookmark-end-element-destination';
import { BookmarkStartElementDestination } from '../../bookmark/bookmark-start-element-destination';
import { CustomXmlDestination, ElementDestination, EmptyDestination } from '../../destination';
import { RangePermissionEndElementDestination } from '../../range-permission/range-permission-end-element-destination';
import { RangePermissionStartElementDestination } from '../../range-permission/range-permission-start-element-destination';
import { DeletedRunContentDestination } from '../../runs/deleted-run-content-destination';
import { InsertedRunContentDestination } from '../../runs/inserted-run-content-destination';
import { StructuredDocumentDestination } from '../../structured-document-destination';
import { TableCellDestination } from '../cell/table-cell-destination';
import { TablePropertiesDestinationCore } from '../table/properties/table-properties-destination-core';
import { TableRowPropertiesDestination } from './properties/table-row-properties-destination';
export class TableRowDestination extends ElementDestination {
    constructor(data, table) {
        super(data);
        this.row = new TableRow(table, this.data.subDocumentInfo.tableImporter.createDefaultRowProperties());
    }
    get elementHandlerTable() {
        return TableRowDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.row.parentTable.rows.push(this.row);
        });
    }
}
TableRowDestination.handlerTable = new MapCreator()
    .add('tc', (data) => new TableCellDestination(data, TableRowDestination.getThis(data).row))
    .add('trPr', (data) => new TableRowPropertiesDestination(data, TableRowDestination.getThis(data).row))
    .add('tblPrEx', (data) => new TablePropertiesDestinationCore(data, TableRowDestination.getThis(data).row.parentTable, TableRowDestination.getThis(data).row.tablePropertiesException))
    .add('sdt', (data) => new StructuredDocumentDestination(data))
    .add('customXml', (data) => new CustomXmlDestination(data))
    .add('del', (data) => data.options.ignoreDeletedText ? new EmptyDestination(data) : new DeletedRunContentDestination(data))
    .add('ins', (data) => data.options.ignoreInsertedText ? new EmptyDestination(data) : new InsertedRunContentDestination(data))
    .add('bookmarkStart', (data) => new BookmarkStartElementDestination(data))
    .add('bookmarkEnd', (data) => new BookmarkEndElementDestination(data))
    .add('permStart', (data) => new RangePermissionStartElementDestination(data))
    .add('permEnd', (data) => new RangePermissionEndElementDestination(data))
    .get();
