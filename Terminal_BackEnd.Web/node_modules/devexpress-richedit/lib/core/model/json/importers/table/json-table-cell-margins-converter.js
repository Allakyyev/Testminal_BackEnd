import { TableCellMargins } from '../../../tables/secondary-structures/table-base-structures';
import { JSONTableCellMarginsProperty } from '../../enums/table/json-table-structures-enums';
import { JSONTableWidthUnitConverter } from './json-table-unit-converter';
export class JSONTableCellMarginsConverter {
    static convertFromJSON(obj) {
        var result = new TableCellMargins();
        result.top = JSONTableWidthUnitConverter.convertFromJSON(obj[JSONTableCellMarginsProperty.Top]);
        result.left = JSONTableWidthUnitConverter.convertFromJSON(obj[JSONTableCellMarginsProperty.Left]);
        result.right = JSONTableWidthUnitConverter.convertFromJSON(obj[JSONTableCellMarginsProperty.Right]);
        result.bottom = JSONTableWidthUnitConverter.convertFromJSON(obj[JSONTableCellMarginsProperty.Bottom]);
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONTableCellMarginsProperty.Top] = JSONTableWidthUnitConverter.convertToJSON(source.top);
        result[JSONTableCellMarginsProperty.Left] = JSONTableWidthUnitConverter.convertToJSON(source.left);
        result[JSONTableCellMarginsProperty.Right] = JSONTableWidthUnitConverter.convertToJSON(source.right);
        result[JSONTableCellMarginsProperty.Bottom] = JSONTableWidthUnitConverter.convertToJSON(source.bottom);
        return result;
    }
}
