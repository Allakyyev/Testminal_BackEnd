import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { JSONDocumentPropertiesProperty } from '../enums/json-document-enums';
import { JSONSection } from '../enums/json-section-enums';
import { JSONHeaderFooterInfoProperty } from '../enums/json-sub-document-enums';
import { JSONMaskedCharacterPropertiesConverter } from '../importers/json-masked-character-properties-converter';
import { JSONMaskedParagraphPropertiesConverter } from '../importers/json-masked-paragraph-properties-converter';
import { JSONSectionPropertiesConverter } from '../importers/section/json-section-properties-converter';
import { JSONTableCellPropertiesConverter } from '../importers/table/json-table-cell-properties-converter';
import { JSONTablePropertiesConverter } from '../importers/table/json-table-properties-converter';
import { JSONTableRowPropertiesConverter } from '../importers/table/json-table-row-properties-converter';
import { JSONControlOptionsConverter } from './json-control-options-converter';
export class JSONExporter {
    static exportDocumentProperties(documentModel) {
        const result = {};
        result[JSONDocumentPropertiesProperty.DefaultTabWidth] = documentModel.defaultTabWidth;
        result[JSONDocumentPropertiesProperty.DifferentOddAndEvenPages] = boolToInt(documentModel.differentOddAndEvenPages);
        result[JSONDocumentPropertiesProperty.DisplayBackgroundShape] = boolToInt(documentModel.displayBackgroundShape);
        result[JSONDocumentPropertiesProperty.PageBackColor] = documentModel.pageBackColor;
        result[JSONDocumentPropertiesProperty.DefaultCharacterProperties] =
            JSONMaskedCharacterPropertiesConverter.convertToJSON(documentModel.defaultCharacterProperties);
        result[JSONDocumentPropertiesProperty.DefaultParagraphProperties] =
            JSONMaskedParagraphPropertiesConverter.convertToJSON(documentModel.defaultParagraphProperties);
        result[JSONDocumentPropertiesProperty.DefaultTableProperties] =
            JSONTablePropertiesConverter.convertToJSON(documentModel.defaultTableProperties);
        result[JSONDocumentPropertiesProperty.DefaultTableRowProperties] =
            JSONTableRowPropertiesConverter.convertToJSON(documentModel.defaultTableRowProperties);
        result[JSONDocumentPropertiesProperty.DefaultTableCellProperties] =
            JSONTableCellPropertiesConverter.convertToJSON(documentModel.defaultTableCellProperties);
        return result;
    }
    static exportModelHeaderFooter(headersFooters) {
        let jsonHeadersFooters = [];
        for (let headerFooter of headersFooters) {
            let jsonHeaderFooter = {};
            jsonHeaderFooter[JSONHeaderFooterInfoProperty.Type] = headerFooter.getType();
            jsonHeaderFooter[JSONHeaderFooterInfoProperty.SubDocumentId] = headerFooter.subDocumentId;
            jsonHeadersFooters.push(jsonHeaderFooter);
        }
        return jsonHeadersFooters;
    }
    static exportSections(documentModel) {
        let result = [];
        for (let section of documentModel.sections) {
            let jsonSection = {};
            jsonSection[JSONSection.StartPos] = section.startLogPosition.value;
            jsonSection[JSONSection.Length] = section.getLength();
            jsonSection[JSONSection.Properties] = JSONSectionPropertiesConverter.convertToJSON(section.sectionProperties);
            jsonSection[JSONSection.Headers] = this.exportHeaderFooter(section.headers);
            jsonSection[JSONSection.Footers] = this.exportHeaderFooter(section.footers);
            result.push(jsonSection);
        }
        return result;
    }
    static exportHeaderFooter(headersFooters) {
        let jsonHeadersFooters = {};
        for (let type in headersFooters) {
            if (Object.prototype.hasOwnProperty.call(headersFooters, type)) {
                jsonHeadersFooters[type] = {
                    [JSONHeaderFooterInfoProperty.Type]: parseInt(type),
                    [JSONHeaderFooterInfoProperty.SubDocumentId]: headersFooters[type].subDocumentId,
                };
            }
        }
        return jsonHeadersFooters;
    }
    static exportOptions(controlOptions) {
        let result = {};
        result = JSONControlOptionsConverter.convertToJSON(controlOptions);
        return result;
    }
}
