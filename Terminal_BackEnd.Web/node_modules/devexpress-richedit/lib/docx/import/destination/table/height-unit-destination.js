import { __awaiter } from "tslib";
import { TableHeightUnitType } from '../../../../core/model/tables/secondary-structures/table-units';
import { Constants } from '@devexpress/utils/lib/constants';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { LeafElementDestination } from '../destination';
export class HeightUnitDestination extends LeafElementDestination {
    constructor(data, heightUnit) {
        super(data);
        this.heightUnit = heightUnit;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const unitType = this.data.readerHelper.getWpEnumValue(reader, 'hRule', TranslationTables.heightUnitTypeTable.importMap, TableHeightUnitType.Minimum);
            this.heightUnit.type = unitType;
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'val');
            if (value != Constants.MIN_SAFE_INTEGER)
                this.heightUnit.value = value;
        });
    }
}
