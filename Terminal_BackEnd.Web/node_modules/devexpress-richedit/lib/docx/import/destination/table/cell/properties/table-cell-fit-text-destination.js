import { __awaiter } from "tslib";
import { TableCellPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-cell-properties';
import { TableCellPropertiesLeafElementDestination } from './table-cell-properties-leaf-element-destination';
export class TableCellFitTextDestination extends TableCellPropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cell.properties.setValue(TableCellPropertyDescriptor.fitText, this.data.readerHelper.getWpSTOnOffValue(reader, 'val'));
        });
    }
}
