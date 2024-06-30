import { __awaiter } from "tslib";
import { TablePropertyDescriptor } from '../../../../../../core/model/tables/properties/table-properties';
import { TablePropertiesLeafElementDestination } from './table-properties-leaf-element-destination';
export class TableAvoidDoubleBordersDestination extends TablePropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableProperties.setValue(TablePropertyDescriptor.avoidDoubleBorders, this.data.readerHelper.getWpSTOnOffValue(reader, 'val', false));
        });
    }
}
