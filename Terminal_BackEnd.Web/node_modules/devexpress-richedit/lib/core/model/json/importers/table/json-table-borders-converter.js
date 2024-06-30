import { TableBorders } from '../../../borders/table-borders';
import { JSONTableBordersProperty } from '../../enums/table/json-table-structures-enums';
import { JSONBorderInfoConverter } from '../json-border-info-converter';
export class JSONTableBordersConverter {
    static convertFromJSON(obj, colorModelInfoCache) {
        var result = new TableBorders();
        result.topBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableBordersProperty.TopBorder], colorModelInfoCache);
        result.leftBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableBordersProperty.LeftBorder], colorModelInfoCache);
        result.rightBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableBordersProperty.RightBorder], colorModelInfoCache);
        result.bottomBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableBordersProperty.BottomBorder], colorModelInfoCache);
        result.insideHorizontalBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableBordersProperty.InsideHorizontalBorder], colorModelInfoCache);
        result.insideVerticalBorder = JSONBorderInfoConverter.convertFromJSON(obj[JSONTableBordersProperty.InsideVerticalBorder], colorModelInfoCache);
        return result;
    }
    static convertToJSON(source) {
        var result = {};
        result[JSONTableBordersProperty.TopBorder] = JSONBorderInfoConverter.convertToJSON(source.topBorder);
        result[JSONTableBordersProperty.LeftBorder] = JSONBorderInfoConverter.convertToJSON(source.leftBorder);
        result[JSONTableBordersProperty.RightBorder] = JSONBorderInfoConverter.convertToJSON(source.rightBorder);
        result[JSONTableBordersProperty.BottomBorder] = JSONBorderInfoConverter.convertToJSON(source.bottomBorder);
        result[JSONTableBordersProperty.InsideHorizontalBorder] = JSONBorderInfoConverter.convertToJSON(source.insideHorizontalBorder);
        result[JSONTableBordersProperty.InsideVerticalBorder] = JSONBorderInfoConverter.convertToJSON(source.insideVerticalBorder);
        return result;
    }
}
