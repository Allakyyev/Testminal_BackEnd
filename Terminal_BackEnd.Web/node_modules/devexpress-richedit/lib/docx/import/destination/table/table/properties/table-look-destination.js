import { __awaiter } from "tslib";
import { Constants } from '@devexpress/utils/lib/constants';
import { TablePropertiesLeafElementDestination } from './table-properties-leaf-element-destination';
export class TableLookDestination extends TablePropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val', Constants.MIN_SAFE_INTEGER, 16);
            if (value != Constants.MIN_SAFE_INTEGER)
                this.table.lookTypes = value;
        });
    }
}
