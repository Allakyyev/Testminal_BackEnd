import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { TableRowProperties } from '../../../tables/properties/table-row-properties';
import { JSONEnumTableRowProperty } from '../../enums/table/json-table-row-enums';
import { JSONTableWidthUnitConverter } from './json-table-unit-converter';
export class JSONTableRowPropertiesConverter {
    static convertFromJSON(obj) {
        var result = new TableRowProperties();
        result.cellSpacing = JSONTableWidthUnitConverter.convertFromJSON(obj[JSONEnumTableRowProperty.CellSpacing]);
        result.header = !!obj[JSONEnumTableRowProperty.Header];
        result.hideCellMark = !!obj[JSONEnumTableRowProperty.HideCellMark];
        result.cantSplit = !!obj[JSONEnumTableRowProperty.CantSplit];
        result.tableRowAlignment = obj[JSONEnumTableRowProperty.TableRowAlignment];
        result.mask = obj[JSONEnumTableRowProperty.UseValue];
        result.divId = obj[JSONEnumTableRowProperty.DivId];
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONEnumTableRowProperty.CellSpacing] = JSONTableWidthUnitConverter.convertToJSON(source.cellSpacing);
        result[JSONEnumTableRowProperty.Header] = boolToInt(source.header);
        result[JSONEnumTableRowProperty.HideCellMark] = boolToInt(source.hideCellMark);
        result[JSONEnumTableRowProperty.CantSplit] = boolToInt(source.cantSplit);
        result[JSONEnumTableRowProperty.TableRowAlignment] = source.tableRowAlignment;
        result[JSONEnumTableRowProperty.UseValue] = source.mask;
        result[JSONEnumTableRowProperty.DivId] = source.divId;
        return result;
    }
}
