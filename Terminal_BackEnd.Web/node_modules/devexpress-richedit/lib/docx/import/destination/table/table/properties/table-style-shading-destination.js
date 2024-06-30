import { __awaiter } from "tslib";
import { TablePropertyDescriptor } from '../../../../../../core/model/tables/properties/table-properties';
import { ShadingHelper } from '../../../shading/shading-helper';
import { TablePropertiesLeafElementDestination } from './table-properties-leaf-element-destination';
export class TableStyleShadingDestination extends TablePropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableProperties.setValue(TablePropertyDescriptor.shadingInfo, ShadingHelper.getShadingValue(this.data, reader));
        });
    }
}
