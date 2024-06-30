import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { TableProperties } from '../../../tables/properties/table-properties';
import { JSONEnumTableProperty } from '../../enums/table/json-table-enums';
import { JSONShadingInfoConverter } from '../json-shading-info-converter';
import { JSONTableBordersConverter } from './json-table-borders-converter';
import { JSONTableCellMarginsConverter } from './json-table-cell-margins-converter';
import { JSONTableWidthUnitConverter } from './json-table-unit-converter';
export class JSONTablePropertiesConverter {
    static convertFromJSON(obj, colorModelInfoCache, shadingInfoCache) {
        var result = new TableProperties();
        result.cellMargins = JSONTableCellMarginsConverter.convertFromJSON(obj[JSONEnumTableProperty.CellMargins]);
        result.cellSpacing = JSONTableWidthUnitConverter.convertFromJSON(obj[JSONEnumTableProperty.CellSpacing]);
        result.indent = JSONTableWidthUnitConverter.convertFromJSON(obj[JSONEnumTableProperty.Indent]);
        result.borders = JSONTableBordersConverter.convertFromJSON(obj[JSONEnumTableProperty.Borders], colorModelInfoCache);
        result.tableStyleColumnBandSize = obj[JSONEnumTableProperty.TableStyleColBandSize];
        result.tableStyleRowBandSize = obj[JSONEnumTableProperty.TableStyleRowBandSize];
        result.isTableOverlap = !!obj[JSONEnumTableProperty.IsTableOverlap];
        result.avoidDoubleBorders = !!obj[JSONEnumTableProperty.AvoidDoubleBorders];
        result.layoutType = obj[JSONEnumTableProperty.LayoutType];
        result.shadingInfo = shadingInfoCache.getItemByJsonKey(obj[JSONEnumTableProperty.ShadingInfoIndex]);
        result.tableRowAlignment = obj[JSONEnumTableProperty.TableRowAlignment];
        result.bottomFromText = obj[JSONEnumTableProperty.BottomFromText];
        result.leftFromText = obj[JSONEnumTableProperty.LeftFromText];
        result.topFromText = obj[JSONEnumTableProperty.TopFromText];
        result.rightFromText = obj[JSONEnumTableProperty.RightFromText];
        result.tableHorizontalPosition = obj[JSONEnumTableProperty.TableHorizontalPosition];
        result.tableVerticalPosition = obj[JSONEnumTableProperty.TableVerticalPosition];
        result.horizontalAlignMode = obj[JSONEnumTableProperty.HorizontalAlignMode];
        result.verticalAlignMode = obj[JSONEnumTableProperty.VerticalAlignMode];
        result.horizontalAnchorType = obj[JSONEnumTableProperty.HorizontalAnchorType];
        result.verticalAnchorType = obj[JSONEnumTableProperty.VerticalAnchorType];
        result.textWrapping = obj[JSONEnumTableProperty.TextWrapping];
        result.mask = obj[JSONEnumTableProperty.UseValue];
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONEnumTableProperty.CellMargins] = JSONTableCellMarginsConverter.convertToJSON(source.cellMargins);
        result[JSONEnumTableProperty.CellSpacing] = JSONTableWidthUnitConverter.convertToJSON(source.cellSpacing);
        result[JSONEnumTableProperty.Indent] = JSONTableWidthUnitConverter.convertToJSON(source.indent);
        result[JSONEnumTableProperty.Borders] = JSONTableBordersConverter.convertToJSON(source.borders);
        result[JSONEnumTableProperty.TableStyleColBandSize] = source.tableStyleColumnBandSize;
        result[JSONEnumTableProperty.TableStyleRowBandSize] = source.tableStyleRowBandSize;
        result[JSONEnumTableProperty.IsTableOverlap] = boolToInt(source.isTableOverlap);
        result[JSONEnumTableProperty.AvoidDoubleBorders] = boolToInt(source.avoidDoubleBorders);
        result[JSONEnumTableProperty.LayoutType] = source.layoutType;
        result[JSONEnumTableProperty.ShadingInfo] = JSONShadingInfoConverter.convertToJSON(source.shadingInfo);
        result[JSONEnumTableProperty.TableRowAlignment] = source.tableRowAlignment;
        result[JSONEnumTableProperty.BottomFromText] = source.bottomFromText;
        result[JSONEnumTableProperty.LeftFromText] = source.leftFromText;
        result[JSONEnumTableProperty.TopFromText] = source.topFromText;
        result[JSONEnumTableProperty.RightFromText] = source.rightFromText;
        result[JSONEnumTableProperty.TableHorizontalPosition] = source.tableHorizontalPosition;
        result[JSONEnumTableProperty.TableVerticalPosition] = source.tableVerticalPosition;
        result[JSONEnumTableProperty.HorizontalAlignMode] = source.horizontalAlignMode;
        result[JSONEnumTableProperty.VerticalAlignMode] = source.verticalAlignMode;
        result[JSONEnumTableProperty.HorizontalAnchorType] = source.horizontalAnchorType;
        result[JSONEnumTableProperty.VerticalAnchorType] = source.verticalAnchorType;
        result[JSONEnumTableProperty.TextWrapping] = source.textWrapping;
        result[JSONEnumTableProperty.UseValue] = source.mask;
        return result;
    }
}
