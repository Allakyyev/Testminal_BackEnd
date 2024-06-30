import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { TableConditionalStyle } from '../../../tables/styles/table-conditional-style';
import { JSONTableConditionalStyleProperty } from '../../enums/table/json-table-structures-enums';
import { JSONTabConverter } from '../json-tab-converter';
import { JSONTablePropertiesConverter } from './json-table-properties-converter';
export class JSONTableConditionalStyleConverter {
    static convertFromJSON(obj, cache) {
        const tableProperties = JSONTablePropertiesConverter.convertFromJSON(obj[JSONTableConditionalStyleProperty.TableProperties], cache.colorModelInfoCache, cache.shadingInfoCache);
        const tableRowProperties = cache.tableRowPropertiesCache.getItemByJsonKey(obj[JSONTableConditionalStyleProperty.TableRowPropertiesIndex]);
        const tableCellProperties = cache.tableCellPropertiesCache.getItemByJsonKey(obj[JSONTableConditionalStyleProperty.TableCellPropertiesIndex]);
        const maskedParagraphProperties = cache.maskedParagraphPropertiesCache.getItemByJsonKey(obj[JSONTableConditionalStyleProperty.MaskedParagraphPropertiesCacheIndex]);
        const maskedCharacterProperties = cache.maskedCharacterPropertiesCache.getItemByJsonKey(obj[JSONTableConditionalStyleProperty.MaskedCharacterPropertiesCacheIndex]);
        return new TableConditionalStyle(tableProperties, tableRowProperties, tableCellProperties, maskedParagraphProperties, maskedCharacterProperties, JSONTabConverter.convertFromJSONToTabProperties(obj[JSONTableConditionalStyleProperty.Tabs]));
    }
    static convertStylesFromJSON(jsonCondStyles, cache) {
        return NumberMapUtils.map(jsonCondStyles, (obj) => JSONTableConditionalStyleConverter.convertFromJSON(obj, cache));
    }
    static convertToJSON(documentModel, tableConditionalStyle) {
        const maskedParagraphPropertiesCache = documentModel.cache.maskedParagraphPropertiesCache;
        const maskedCharacterPropertiesCache = documentModel.cache.maskedCharacterPropertiesCache;
        const tableRowPropertiesCache = documentModel.cache.tableRowPropertiesCache;
        const tableCellPropertiesCache = documentModel.cache.tableCellPropertiesCache;
        let jsonTableConditionalStyle = {};
        jsonTableConditionalStyle[JSONTableConditionalStyleProperty.TableProperties] =
            JSONTablePropertiesConverter.convertToJSON(tableConditionalStyle.tableProperties);
        jsonTableConditionalStyle[JSONTableConditionalStyleProperty.TableRowPropertiesIndex] =
            tableRowPropertiesCache.indexOf(tableConditionalStyle.tableRowProperties);
        jsonTableConditionalStyle[JSONTableConditionalStyleProperty.TableCellPropertiesIndex] =
            tableCellPropertiesCache.indexOf(tableConditionalStyle.tableCellProperties);
        jsonTableConditionalStyle[JSONTableConditionalStyleProperty.MaskedParagraphPropertiesCacheIndex] =
            maskedParagraphPropertiesCache.indexOf(tableConditionalStyle.maskedParagraphProperties);
        jsonTableConditionalStyle[JSONTableConditionalStyleProperty.MaskedCharacterPropertiesCacheIndex] =
            maskedCharacterPropertiesCache.indexOf(tableConditionalStyle.maskedCharacterProperties);
        jsonTableConditionalStyle[JSONTableConditionalStyleProperty.Tabs] =
            JSONTabConverter.convertFromTabPropertiesToJSON(tableConditionalStyle.tabs);
        return jsonTableConditionalStyle;
    }
    static convertStylesToJSON(documentModel, tableConditionalStyles) {
        return NumberMapUtils.map(tableConditionalStyles, style => JSONTableConditionalStyleConverter.convertToJSON(documentModel, style));
    }
}
