import { __awaiter } from "tslib";
import { TablePropertyDescriptor } from '../../../../../../core/model/tables/properties/table-properties';
import { TableRowAlignment } from '../../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TranslationTables } from '../../../../../translation-table/translation-tables';
import { TablePropertiesLeafElementDestination } from './table-properties-leaf-element-destination';
export class TableAlignmentDestination extends TablePropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableProperties.setValue(TablePropertyDescriptor.rowAlignment, this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.tableRowAlignmentTable.importMap, TableRowAlignment.Left));
        });
    }
}
