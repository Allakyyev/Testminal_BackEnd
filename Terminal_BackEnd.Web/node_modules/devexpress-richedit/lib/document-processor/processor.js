import { DocumentFormat } from '../core/document-format';
import { FormatterManager } from '../core/layout-formatter/managers/formatter-manager';
import { AnchorObjectsPositionInfo, DocumentLayout } from '../core/layout/document-layout';
import { Measurer } from '../core/measurer/measurer';
import { InnerClientProperties } from '../core/rich-utils/inner-client-properties';
import { SelectionBase } from '../core/selection/selection-base';
import { StringResources } from '../core/string-resources';
import { ViewSettings } from '../core/view-settings/views-settings';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { exportModelToBase64, exportModelToBlob } from '../model-api/formats/exporter';
import { createImporter } from '../model-api/formats/importer';
export class DocumentProcessorBase {
    constructor(richOptions) {
        this.selection = new SelectionBase();
        this.onCalculateDocumentVariable = null;
        this.measurer = new Measurer('');
        this.modelManager = this.createModelManager(null, richOptions);
        this.innerClientProperties = new InnerClientProperties(new ViewSettings());
    }
    dispose() {
        this.measurer.dispose();
        if (this.layoutFormatterManager)
            this.layoutFormatterManager.dispose();
    }
    openDocument(source, documentFormat, callback) {
        const file = typeof source == 'string' ? Base64Utils.getFileFromBase64(source) : source;
        this.openDocumentInner(file, documentFormat, callback);
    }
    openInnerDocument(model) {
        this.createModel(model);
    }
    exportDocumentToBase64(callback, documentFormat) {
        exportModelToBase64(this.modelManager.modelManipulator, this.exportFormat(documentFormat), callback);
    }
    exportDocumentToBlob(callback, documentFormat) {
        exportModelToBlob(this.modelManager.modelManipulator, this.exportFormat(documentFormat), callback);
    }
    openDocumentInner(file, format, callback) {
        if (this.activeDocumentImporter) {
            callback(false);
            return;
        }
        this.activeDocumentImporter = createImporter(format);
        if (!this.activeDocumentImporter) {
            callback(false);
            return;
        }
        this.activeDocumentImporter.importFromFile(file, this.modelManager.richOptions, (model, formatImagesImporter) => {
            this.activeDocumentImporter = null;
            this.createModel(model);
            this.importImages(formatImagesImporter);
            callback(true);
        }, (_reason) => {
            this.activeDocumentImporter = null;
            callback(false);
        });
    }
    importImages(formatImagesImporter) {
        formatImagesImporter.import(this.modelManager.modelManipulator);
    }
    exportFormat(documentFormat) {
        return documentFormat === undefined || documentFormat === null ? DocumentFormat.OpenXml : documentFormat;
    }
    createModel(model) {
        this.modelManager = this.createModelManager(model, this.modelManager.richOptions);
        const layout = new DocumentLayout(new AnchorObjectsPositionInfo(model));
        layout.pageColor = model.getActualPageBackgroundColor();
        this.layoutFormatterManager = new FormatterManager(this.measurer, this.innerClientProperties, this.modelManager.model, layout, { activeSubDocument: model.mainSubDocument }, this.modelManager.richOptions.bookmarks, this.modelManager.richOptions.documentProtection, { getVisibleAreaHeight(_includeScrollBars) { return 500; } }, new StringResources(), []);
        this.layoutFormatterManager.openDocument();
    }
    beginUpdate() {
        this.layoutFormatterManager.beginUpdate();
    }
    endUpdate() {
        this.layoutFormatterManager.endUpdate();
    }
    invalidateLayoutAfterFontsLoaded() {
        if (this.measurer && this.layoutFormatterManager && this.layoutFormatterManager.invalidator) {
            this.measurer.clearCache();
            this.layoutFormatterManager.invalidator.onChangedAllLayout();
        }
    }
}
