import { __awaiter } from "tslib";
import { Constants } from '@devexpress/utils/lib/constants';
import { TableCellPropertiesLeafElementDestination } from './table-cell-properties-leaf-element-destination';
export class TableCellColumnSpanDestination extends TableCellPropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val');
            if (value != Constants.MIN_SAFE_INTEGER && value != 0)
                this.cell.columnSpan = value;
        });
    }
}
