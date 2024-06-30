import { __awaiter } from "tslib";
import { TablePropertyDescriptor } from '../../../../../../core/model/tables/properties/table-properties';
import { Constants } from '@devexpress/utils/lib/constants';
import { TablePropertiesLeafElementDestination } from './table-properties-leaf-element-destination';
export class TableStyleColBandSizeDestination extends TablePropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val');
            if (value != Constants.MIN_SAFE_INTEGER)
                this.tableProperties.setValue(TablePropertyDescriptor.styleColumnBandSize, value);
        });
    }
}
