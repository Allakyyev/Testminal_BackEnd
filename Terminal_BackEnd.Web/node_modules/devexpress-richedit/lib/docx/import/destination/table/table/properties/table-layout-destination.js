import { __awaiter } from "tslib";
import { TablePropertyDescriptor } from '../../../../../../core/model/tables/properties/table-properties';
import { TableLayoutType } from '../../../../../../core/model/tables/secondary-structures/table-base-structures';
import { TranslationTables } from '../../../../../translation-table/translation-tables';
import { TablePropertiesLeafElementDestination } from './table-properties-leaf-element-destination';
export class TableLayoutDestination extends TablePropertiesLeafElementDestination {
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.tableProperties.setValue(TablePropertyDescriptor.layoutType, this.data.readerHelper.getWpEnumValue(reader, 'type', TranslationTables.tableLayoutTypeTable.importMap, TableLayoutType.Autofit));
        });
    }
}
