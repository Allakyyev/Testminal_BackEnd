import { __awaiter } from "tslib";
import { TableWidthUnitType } from '../../../../core/model/tables/secondary-structures/table-units';
import { Constants } from '@devexpress/utils/lib/constants';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { LeafElementDestination } from '../destination';
export class WidthUnitDestination extends LeafElementDestination {
    constructor(data, widthUnit, setMaskTrue) {
        super(data);
        this.widthUnit = widthUnit;
        this.setMaskTrue = setMaskTrue;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const unitType = this.data.readerHelper.getWpEnumValue(reader, 'type', TranslationTables.widthUnitTypesTable.importMap, TableWidthUnitType.Auto);
            const value = this.data.readerHelper.getWpSTIntegerValue(reader, 'w');
            if (this.isValid(value)) {
                this.widthUnit.type = unitType;
                this.widthUnit.value = value;
            }
            else
                this.widthUnit.type = TableWidthUnitType.Auto;
            this.setMaskTrue();
        });
    }
    isValid(value) {
        return value != Constants.MIN_SAFE_INTEGER;
    }
}
export class WidthUnitNonNegativeDestination extends WidthUnitDestination {
    isValid(value) {
        return super.isValid(value) && value >= 0;
    }
}
