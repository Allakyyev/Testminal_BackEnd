import { __awaiter } from "tslib";
import { TableRowPropertyDescriptor } from '../../../../../../core/model/tables/properties/table-row-property-descriptor';
import { TableRowAlignment } from '../../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TranslationTables } from '../../../../../translation-table/translation-tables';
import { TableRowPropertiesLeafElementDestination } from './table-row-properties-leaf-element-destination';
export class TableRowAlignmentDestination extends TableRowPropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.row.properties.setValue(TableRowPropertyDescriptor.rowAlignment, this.data.readerHelper.getWpEnumValue(reader, 'val', (this.data.constants.strictMode ?
                TranslationTables.strictTableRowAlignmentTable :
                TranslationTables.tableRowAlignmentTable).importMap, TableRowAlignment.Left));
        });
    }
}
