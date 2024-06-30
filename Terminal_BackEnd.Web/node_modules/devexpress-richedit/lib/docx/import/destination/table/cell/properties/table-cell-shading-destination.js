import { __awaiter } from "tslib";
import { TableCellPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-cell-properties';
import { ShadingHelper } from '../../../shading/shading-helper';
import { TableCellPropertiesLeafElementDestination } from './table-cell-properties-leaf-element-destination';
export class TableCellShadingDestination extends TableCellPropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cell.properties.setValue(TableCellPropertyDescriptor.shadingInfo, ShadingHelper.getShadingValue(this.data, reader));
        });
    }
}
