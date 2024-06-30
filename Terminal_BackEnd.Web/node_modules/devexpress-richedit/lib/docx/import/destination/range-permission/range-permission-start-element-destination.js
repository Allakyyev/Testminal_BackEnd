import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RangePermissionElementDestination } from './range-permission-element-destination';
export class RangePermissionStartElementDestination extends RangePermissionElementDestination {
    assignRangePermissionProperties(range, reader) {
        range.start = this.data.subDocumentInfo.positionImporter.currPosition;
        range.columnFirst = this.data.readerHelper.getWpSTIntegerValue(reader, 'colFirst', -1);
        range.columnLast = this.data.readerHelper.getWpSTIntegerValue(reader, 'colLast', -1);
        if (this.data.subDocumentInfo.tableImporter.isInsideTable) {
            range.table = ListUtils.last(this.data.subDocument.tables);
            range.firstRowIndex = this.getLastRowIndexFromTable(range.table);
        }
    }
}
