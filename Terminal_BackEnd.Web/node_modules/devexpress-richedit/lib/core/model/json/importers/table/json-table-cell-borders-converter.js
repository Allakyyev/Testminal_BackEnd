import { TableCellBorders } from '../../../borders/table-cell-borders';
import { JSONTableCellBordersProperty } from '../../enums/table/json-table-structures-enums';
import { JSONBorderInfoConverter } from '../json-border-info-converter';
export class JSONTableCellBordersConverter {
    static convertFromJSON(obj, colorModelInfoCache) {
        var result = new TableCellBorders();
        result.topBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableCellBordersProperty.TopBorder], colorModelInfoCache);
        result.leftBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableCellBordersProperty.LeftBorder], colorModelInfoCache);
        result.rightBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableCellBordersProperty.RightBorder], colorModelInfoCache);
        result.bottomBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableCellBordersProperty.BottomBorder], colorModelInfoCache);
        result.topLeftDiagonalBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableCellBordersProperty.TopLeftDiagonalBorder], colorModelInfoCache);
        result.topRightDiagonalBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableCellBordersProperty.TopRightDiagonalBorder], colorModelInfoCache);
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONTableCellBordersProperty.TopBorder] = JSONBorderInfoConverter.convertToJSON(source.topBorder);
        result[JSONTableCellBordersProperty.LeftBorder] = JSONBorderInfoConverter.convertToJSON(source.leftBorder);
        result[JSONTableCellBordersProperty.RightBorder] = JSONBorderInfoConverter.convertToJSON(source.rightBorder);
        result[JSONTableCellBordersProperty.BottomBorder] = JSONBorderInfoConverter.convertToJSON(source.bottomBorder);
        result[JSONTableCellBordersProperty.TopLeftDiagonalBorder] = JSONBorderInfoConverter.convertToJSON(source.topLeftDiagonalBorder);
        result[JSONTableCellBordersProperty.TopRightDiagonalBorder] = JSONBorderInfoConverter.convertToJSON(source.topRightDiagonalBorder);
        return result;
    }
}
