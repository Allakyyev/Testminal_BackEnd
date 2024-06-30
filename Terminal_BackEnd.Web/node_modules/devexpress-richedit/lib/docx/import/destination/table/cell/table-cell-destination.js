import { __awaiter } from "tslib";
import { MapCreator } from '../../../../../base-utils/map-creator';
import { TableCell } from '../../../../../core/model/tables/main-structures/table-cell';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { BookmarkEndElementDestination } from '../../bookmark/bookmark-end-element-destination';
import { BookmarkStartElementDestination } from '../../bookmark/bookmark-start-element-destination';
import { CustomXmlDestination, ElementDestination, EmptyDestination } from '../../destination';
import { AltChunkDestination } from '../../document/alt-chunk-destination';
import { ParagraphDestination } from '../../paragraph/paragraph-destination';
import { RangePermissionEndElementDestination } from '../../range-permission/range-permission-end-element-destination';
import { RangePermissionStartElementDestination } from '../../range-permission/range-permission-start-element-destination';
import { DeletedRunContentDestination } from '../../runs/deleted-run-content-destination';
import { InsertedRunContentDestination } from '../../runs/inserted-run-content-destination';
import { StructuredDocumentDestination } from '../../structured-document-destination';
import { TableDestination } from '../table/table-destination';
import { TableCellPropertiesDestination } from './properties/table-cell-properties-destination';
export class TableCellDestination extends ElementDestination {
    constructor(data, row) {
        super(data);
        this.startParagraph = this.data.subDocumentInfo.paragraphImporter.paragraph;
        this.cell = new TableCell(row, this.data.subDocumentInfo.tableImporter.createDefaultCellProperties());
        this.paragraphRequired = true;
    }
    get elementHandlerTable() {
        return TableCellDestination.handlerTable;
    }
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cell.startParagraphPosition = this.data.subDocumentInfo.subDocument.positionManager.registerPosition(this.data.subDocumentInfo.paragraphImporter.paragraph.startLogPosition.value);
            this.cell.parentRow.cells.push(this.cell);
        });
    }
    processElementClose(_reader) {
        if (this.paragraphRequired) {
            this.endParagraph = this.data.subDocumentInfo.paragraphImporter.paragraph;
            this.data.subDocumentInfo.paragraphImporter.insertParagraph();
        }
        this.cell.endParagrapPosition = this.data.subDocumentInfo.subDocument.positionManager.registerPosition(ListUtils.last(this.data.subDocumentInfo.subDocument.paragraphs).getEndPosition());
    }
}
TableCellDestination.handlerTable = new MapCreator()
    .add('p', (data) => {
    const destination = TableCellDestination.getThis(data);
    destination.endParagraph = data.subDocumentInfo.paragraphImporter.paragraph;
    destination.paragraphRequired = false;
    return new ParagraphDestination(data);
})
    .add('tbl', (data) => {
    const destination = TableCellDestination.getThis(data);
    destination.paragraphRequired = true;
    return new TableDestination(data, destination.cell);
})
    .add('tcPr', (data) => new TableCellPropertiesDestination(data, TableCellDestination.getThis(data).cell))
    .add('bookmarkStart', (data) => new BookmarkStartElementDestination(data))
    .add('bookmarkEnd', (data) => new BookmarkEndElementDestination(data))
    .add('permStart', (data) => new RangePermissionStartElementDestination(data))
    .add('permEnd', (data) => new RangePermissionEndElementDestination(data))
    .add('sdt', (data) => new StructuredDocumentDestination(data))
    .add('customXml', (data) => new CustomXmlDestination(data))
    .add('altChunk', (data) => {
    const destination = TableCellDestination.getThis(data);
    destination.endParagraph = data.subDocumentInfo.paragraphImporter.paragraph;
    destination.paragraphRequired = false;
    return new AltChunkDestination(data);
})
    .add('del', (data) => data.options.ignoreDeletedText ? new EmptyDestination(data) : new DeletedRunContentDestination(data))
    .add('ins', (data) => data.options.ignoreInsertedText ? new EmptyDestination(data) : new InsertedRunContentDestination(data))
    .get();
