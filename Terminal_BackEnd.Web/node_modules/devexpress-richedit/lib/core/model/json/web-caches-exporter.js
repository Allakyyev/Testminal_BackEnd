import { Errors } from '@devexpress/utils/lib/errors';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { SubDocumentInfoType } from '../enums';
import { SubDocumentInfoBase } from '../sub-document-infos';
import { JSONPieceTableInfo } from './enums/json-sub-document-enums';
import { JSONCachesDataProperty } from './enums/json-top-level-enums';
import { JSONSubDocumentExporter } from './exporters/json-sub-document-exporter';
import { JSONColorModelInfoConverter } from './importers/json-color-model-info-converter';
import { JSONFontInfoConverter } from './importers/json-font-info-converter';
import { JSONMaskedCharacterPropertiesConverter } from './importers/json-masked-character-properties-converter';
import { JSONMaskedParagraphPropertiesConverter } from './importers/json-masked-paragraph-properties-converter';
import { JSONShadingInfoConverter } from './importers/json-shading-info-converter';
import { JSONListLevelPropertiesConverter } from './importers/numbering-list/json-list-level-properties-converter';
import { JSONSubDocumentImporter } from './importers/sub-document/json-sub-document-importer';
import { JSONTableCellPropertiesConverter } from './importers/table/json-table-cell-properties-converter';
import { JSONTableRowPropertiesConverter } from './importers/table/json-table-row-properties-converter';
export class WebCachesExporter {
    constructor(cache, caches, documentModel) {
        this.documentModel = documentModel;
        this.cache = cache;
        const fontInfoCache = caches[JSONCachesDataProperty.FontInfoCache];
        const charPropsCache = caches[JSONCachesDataProperty.CharacterPropertiesCache];
        const parPropsCache = caches[JSONCachesDataProperty.ParagraphPropertiesCache];
        const listLevelPropsCache = caches[JSONCachesDataProperty.ListLevelPropertiesCache];
        const tableRowPropsCache = caches[JSONCachesDataProperty.TableRowPropertiesCache];
        const tableCellPropsCache = caches[JSONCachesDataProperty.TableCellPropertiesCache];
        const colorModelInfoCache = caches[JSONCachesDataProperty.ColorModelInfoCache];
        const shadingInfoCache = caches[JSONCachesDataProperty.ShadingInfoCache];
        if (fontInfoCache)
            cache.fontInfoCache.merge(fontInfoCache, JSONFontInfoConverter.convertFromJSON);
        if (colorModelInfoCache)
            cache.colorModelInfoCache.merge(colorModelInfoCache, JSONColorModelInfoConverter.convertFromJSON);
        if (shadingInfoCache)
            cache.shadingInfoCache.merge(shadingInfoCache, (obj) => JSONShadingInfoConverter.convertFromJSON(obj, cache.colorModelInfoCache));
        if (charPropsCache)
            cache.maskedCharacterPropertiesCache.merge(charPropsCache, (property) => JSONMaskedCharacterPropertiesConverter.convertFromJSON(property, cache.colorModelInfoCache, cache.shadingInfoCache, cache.fontInfoCache));
        if (parPropsCache)
            cache.maskedParagraphPropertiesCache.merge(parPropsCache, (property) => JSONMaskedParagraphPropertiesConverter.convertFromJSON(property, cache.colorModelInfoCache, cache.shadingInfoCache));
        if (listLevelPropsCache)
            cache.listLevelPropertiesCache.merge(listLevelPropsCache, JSONListLevelPropertiesConverter.convertFromJSON);
        if (tableRowPropsCache)
            cache.tableRowPropertiesCache.merge(tableRowPropsCache, JSONTableRowPropertiesConverter.convertFromJSON);
        if (tableCellPropsCache)
            cache.tableCellPropertiesCache.merge(tableCellPropsCache, (property) => JSONTableCellPropertiesConverter.convertFromJSON(property, cache.colorModelInfoCache, cache.shadingInfoCache));
        this.jsonSubDocs = caches[JSONCachesDataProperty.SubDocuments];
    }
    importSubDocuments(documentProtectionSettings, imageCorrespondence) {
        NumberMapUtils.forEach(this.jsonSubDocs, (jsonSubDoc, subDocumentId) => {
            const subDocType = jsonSubDoc[JSONPieceTableInfo.Type];
            let info;
            switch (subDocType) {
                case SubDocumentInfoType.Header:
                    info = WebCachesExporter.getInfoBySubDocumentId(this.documentModel.headers, subDocumentId);
                    break;
                case SubDocumentInfoType.Footer:
                    info = WebCachesExporter.getInfoBySubDocumentId(this.documentModel.footers, subDocumentId);
                    break;
                case SubDocumentInfoType.Main:
                    info = SubDocumentInfoBase.create(subDocType, subDocumentId, -1);
                    break;
                case SubDocumentInfoType.TextBox:
                    info = SubDocumentInfoBase.create(subDocType, subDocumentId, jsonSubDoc[JSONPieceTableInfo.ParentPieceTableId]);
                    break;
                default:
                    throw new Error("Unknown subDocumentType");
            }
            const subDocument = info.isMain ? this.documentModel.mainSubDocument : this.documentModel.importSubDocument(info);
            const jsonSubDocStructures = jsonSubDoc[JSONPieceTableInfo.Info];
            JSONSubDocumentImporter.importSubDocument(subDocument, documentProtectionSettings, jsonSubDocStructures, imageCorrespondence);
        });
    }
    exportSubDocuments() {
        let subDocuments = this.documentModel.subDocuments;
        let jsonSubDocuments = [];
        NumberMapUtils.forEach(subDocuments, subDocument => {
            let jsonSubDocument = [];
            JSONSubDocumentExporter.exportSubDocument(subDocument, jsonSubDocument);
            jsonSubDocuments.push(jsonSubDocument);
        });
        return jsonSubDocuments;
    }
    static getInfoBySubDocumentId(infos, subDocumentId) {
        for (let info of infos)
            if (info.subDocumentId === subDocumentId)
                return info;
        throw new Error(Errors.InternalException);
    }
    dispose() {
        this.cache.clearTemporaryCaches();
    }
}
