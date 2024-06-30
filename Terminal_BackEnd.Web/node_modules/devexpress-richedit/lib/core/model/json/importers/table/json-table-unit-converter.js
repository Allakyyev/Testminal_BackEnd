import { TableHeightUnit, TableWidthUnit } from '../../../tables/secondary-structures/table-units';
import { JSONTableHeightUnitProperty, JSONTableWidthUnitProperty } from '../../enums/table/json-table-structures-enums';
export class JSONTableHeightUnitConverter {
    static convertFromJSON(obj) {
        var result = new TableHeightUnit();
        result.type = obj[JSONTableHeightUnitProperty.Type];
        result.value = obj[JSONTableHeightUnitProperty.Value];
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONTableHeightUnitProperty.Type] = source.type;
        result[JSONTableHeightUnitProperty.Value] = source.value;
        return result;
    }
}
export class JSONTableWidthUnitConverter {
    static convertFromJSON(obj) {
        var result = new TableWidthUnit();
        result.type = obj[JSONTableWidthUnitProperty.Type];
        result.value = obj[JSONTableWidthUnitProperty.Value];
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONTableWidthUnitProperty.Type] = source.type;
        result[JSONTableWidthUnitProperty.Value] = source.value;
        return result;
    }
}
