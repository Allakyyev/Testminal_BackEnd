import { RangePermissionElementDestination } from './range-permission-element-destination';
export class RangePermissionEndElementDestination extends RangePermissionElementDestination {
    assignRangePermissionProperties(range, _reader) {
        range.end = this.data.subDocumentInfo.positionImporter.currPosition;
        if (!this.data.subDocumentInfo.tableImporter.isInsideTable && !range.table)
            return;
        const table = this.data.subDocumentInfo.tableStack.last;
        if (this.data.subDocumentInfo.tableImporter.isInsideTable && range.table !== table) {
            range.table = table;
            range.firstRowIndex = 0;
        }
        range.lastRowIndex = this.getLastRowIndexFromTable(range.table);
    }
}
