import { __awaiter } from "tslib";
import { TableCellPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-cell-properties';
import { TableCellVerticalAlignment } from '../../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TranslationTables } from '../../../../../translation-table/translation-tables';
import { TableCellPropertiesLeafElementDestination } from './table-cell-properties-leaf-element-destination';
export class TableCellVerticalAlignmentDestination extends TableCellPropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cell.properties.setValue(TableCellPropertyDescriptor.vertivalAlignment, this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.verticalAlignmentTable.importMap, TableCellVerticalAlignment.Top));
        });
    }
}
