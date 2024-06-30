import { __awaiter } from "tslib";
import { TableRowPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-row-property-descriptor';
import { TableRowPropertiesLeafElementDestination } from './table-row-properties-leaf-element-destination';
export class TableRowHeaderDestination extends TableRowPropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.row.properties.setValue(TableRowPropertyDescriptor.header, this.data.readerHelper.getWpSTOnOffValue(reader, 'val', true));
        });
    }
}
