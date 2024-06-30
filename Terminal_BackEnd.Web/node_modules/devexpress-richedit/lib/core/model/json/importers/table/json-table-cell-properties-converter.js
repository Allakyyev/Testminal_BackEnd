import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { TableCellProperties } from '../../../tables/properties/table-cell-properties';
import { JSONEnumTableCellProperty } from '../../enums/table/json-table-cell-enums';
import { JSONShadingInfoConverter } from '../json-shading-info-converter';
import { JSONTableCellBordersConverter } from './json-table-cell-borders-converter';
import { JSONTableCellMarginsConverter } from './json-table-cell-margins-converter';
export class JSONTableCellPropertiesConverter {
    static convertFromJSON(obj, colorModelInfoCache, shadingInfoCache) {
        const result = new TableCellProperties();
        result.cellMargins = JSONTableCellMarginsConverter.convertFromJSON(obj[JSONEnumTableCellProperty.CellMargins]);
        result.borders = JSONTableCellBordersConverter.convertFromJSON(obj[JSONEnumTableCellProperty.Borders], colorModelInfoCache);
        result.hideCellMark = !!obj[JSONEnumTableCellProperty.HideCellMark];
        result.noWrap = !!obj[JSONEnumTableCellProperty.NoWrap];
        result.fitText = !!obj[JSONEnumTableCellProperty.FitText];
        result.textDirection = obj[JSONEnumTableCellProperty.TextDirection];
        result.verticalAlignment = obj[JSONEnumTableCellProperty.VerticalAlignment];
        result.shadingInfo = shadingInfoCache.getItemByJsonKey(obj[JSONEnumTableCellProperty.ShadingInfoIndex]);
        result.mask = obj[JSONEnumTableCellProperty.UseValue];
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONEnumTableCellProperty.CellMargins] = JSONTableCellMarginsConverter.convertToJSON(source.cellMargins);
        result[JSONEnumTableCellProperty.Borders] = JSONTableCellBordersConverter.convertToJSON(source.borders);
        result[JSONEnumTableCellProperty.HideCellMark] = boolToInt(source.hideCellMark);
        result[JSONEnumTableCellProperty.NoWrap] = boolToInt(source.noWrap);
        result[JSONEnumTableCellProperty.FitText] = boolToInt(source.fitText);
        result[JSONEnumTableCellProperty.TextDirection] = source.textDirection;
        result[JSONEnumTableCellProperty.VerticalAlignment] = source.verticalAlignment;
        result[JSONEnumTableCellProperty.ShadingInfo] = JSONShadingInfoConverter.convertToJSON(source.shadingInfo);
        result[JSONEnumTableCellProperty.UseValue] = source.mask;
        return result;
    }
}
