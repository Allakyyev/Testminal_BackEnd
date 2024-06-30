import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
import { DocumentModel } from '../../document-model';
import { SubDocumentInterval, SubDocumentPosition } from '../../sub-document';
import { FooterSubDocumentInfo, HeaderSubDocumentInfo } from '../../sub-document-infos';
import { JSONDocumentModelProperty } from '../enums/json-document-enums';
import { JSONUpdateFieldCommandResult } from '../enums/json-field-enums';
import { WebCachesExporter } from '../web-caches-exporter';
import { JSONCacheImageInfoConverter } from './image-cache-info-converter';
import { JSONDrawingColorConverter } from './json-drawing-color-converter';
import { JSONImporter } from './json-importer';
import { JSONStylesExporter } from './json-styles-exporter';
import { JSONNumberingListImporter } from './numbering-list/json-numbering-list-importer';
export class ServerModelInserter {
    static insertDocumentModelFromServer(modelManager, response, insertToPos, insertToSubDocumentId) {
        const model = modelManager.model;
        const newDocumentModel = new DocumentModel(model.modelOptions, 0);
        newDocumentModel.cache.fontInfoCache = model.cache.fontInfoCache;
        newDocumentModel.cache.imageCache = model.cache.imageCache;
        const cachesExporter = new WebCachesExporter(newDocumentModel.cache, response[JSONUpdateFieldCommandResult.Caches], newDocumentModel);
        const imageCorrespondence = response[JSONUpdateFieldCommandResult.ImageCorrespondence];
        ServerModelInserter.processNewDocumentResponse(newDocumentModel, imageCorrespondence, response[JSONUpdateFieldCommandResult.DocumentModel]);
        cachesExporter.importSubDocuments(modelManager.richOptions.documentProtection, imageCorrespondence);
        const subDocument = model.subDocuments[insertToSubDocumentId];
        const result = modelManager.modelManipulator.subDocument.insertSubDocument(new SubDocumentPosition(subDocument, insertToPos), new SubDocumentInterval(newDocumentModel.mainSubDocument, new FixedInterval(0, response[JSONUpdateFieldCommandResult.DocumentLength])));
        cachesExporter.dispose();
        return result.insetedInterval;
    }
    static processNewDocumentResponse(documentModel, imageCorrespondence, obj) {
        JSONImporter.importDocumentProperties(documentModel, obj[JSONDocumentModelProperty.DocumentProperties]);
        JSONImporter.importCompatibilitySettings(documentModel, obj[JSONDocumentModelProperty.CompatibilitySettings]);
        JSONStylesExporter.importStyles(documentModel, obj[JSONDocumentModelProperty.Styles]);
        JSONImporter.importModelHeaderFooter(documentModel.headers, obj[JSONDocumentModelProperty.Headers], HeaderSubDocumentInfo);
        JSONImporter.importModelHeaderFooter(documentModel.footers, obj[JSONDocumentModelProperty.Footers], FooterSubDocumentInfo);
        JSONImporter.importSections(documentModel, obj[JSONDocumentModelProperty.Sections]);
        JSONNumberingListImporter.importAbstractNumberingLists(documentModel, obj[JSONDocumentModelProperty.AbstractNumberingLists]);
        JSONNumberingListImporter.importNumberingLists(documentModel, obj[JSONDocumentModelProperty.NumberingLists]);
        JSONNumberingListImporter.importAbstractNumberingListTemplates(documentModel, obj[JSONDocumentModelProperty.AbstractNumberingListTemplates]);
        JSONCacheImageInfoConverter.importImageCache(documentModel.cache.imageCache, imageCorrespondence, obj[JSONDocumentModelProperty.Images]);
        const paletteColors = obj[JSONDocumentModelProperty.PaletteColors];
        NumberMapUtils.forEach(paletteColors, (color, index) => documentModel.colorProvider.palette.setColor(index, color));
        const officeThemeColors = obj[JSONDocumentModelProperty.OfficeThemeColors];
        NumberMapUtils.forEach(officeThemeColors, (color, index) => documentModel.colorProvider.officeTheme.colors.setDrawingColor(index, JSONDrawingColorConverter.convertFromJSON(color)));
    }
}
