import { DocumentFormat } from '../../core/document-format';
import { ClientModelManager } from '../../core/model-manager';
import { RangeCopy } from '../../core/model/manipulators/range/create-range-copy-operation';
import { SubDocumentInterval, SubDocumentIntervals, SubDocumentPosition } from '../../core/model/sub-document';
import { EmptyBatchUpdatableObject } from '@devexpress/utils/lib/class/batch-updatable';
import { Errors } from '@devexpress/utils/lib/errors';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { isString } from '@devexpress/utils/lib/utils/common';
import { Importer } from '../../docx/import/importer';
import { ImporterOptions } from '../../docx/import/importer-options';
import { RtfExporter } from '../../rtf/export/exporter';
import { RtfDocumentExporterOptions } from '../../rtf/export/rtf-document-exporter-options';
import { RtfImporterOptions } from '../../rtf/import/importer-options';
import { RtfImporter } from '../../rtf/import/rtf-importer';
import { TxtImporter } from '../../txt/txt-importer';
export function createImporter(format, throwInvalidFile = reason => {
    throw new Error(Errors.InternalException + " " + reason);
}) {
    switch (format) {
        case DocumentFormat.OpenXml: return new Importer(new ImporterOptions(throwInvalidFile));
        case DocumentFormat.Rtf: return new RtfImporter(new RtfImporterOptions(throwInvalidFile));
        case DocumentFormat.PlainText: return new TxtImporter();
        default:
            console.log('Unsupported format');
            return null;
    }
}
export function insertRtfInSubDocumentPublic(processor, subDocument, position, rtf, callback) {
    const options = new RtfImporterOptions(() => { });
    new RtfImporter(options).importFromString(rtf, processor.modelManager.richOptions, getAfterInsertCallback(processor, subDocument, position, callback), getAfterInsertReject(callback));
}
export function insertContentInSubDocumentPublic(processor, subDocument, position, content, documentFormat, callback) {
    if (content instanceof ArrayBuffer)
        content = Base64Utils.fromArrayBuffer(content);
    if (isString(content))
        content = Base64Utils.getFileFromBase64(content);
    const importer = createImporter(documentFormat, () => { });
    if (!importer)
        throw new Error('Unknown document format');
    importer.importFromFile(content, processor.modelManager.richOptions, getAfterInsertCallback(processor, subDocument, position, callback), getAfterInsertReject(callback));
}
function getAfterInsertCallback(processor, subDocument, position, callback) {
    return (model, formatImagesImporter) => {
        formatImagesImporter.whenAllPicturesLoaded((_success) => {
            processor.beginUpdate();
            const result = processor.modelManager.modelManipulator.subDocument.insertSubDocument(new SubDocumentPosition(subDocument, position), new SubDocumentInterval(model.mainSubDocument, model.mainSubDocument.interval));
            model.updateHyperlinkFields(processor, new SubDocumentInterval(subDocument, result.insetedInterval), result.newSubDocuments);
            processor.endUpdate();
            callback(result.insetedInterval, true);
        }, 5000);
        const clientModelManager = new ClientModelManager(model, processor.modelManager.richOptions, new EmptyBatchUpdatableObject());
        formatImagesImporter.import(clientModelManager.modelManipulator);
    };
}
function getAfterInsertReject(callback) {
    return (_reason) => {
        callback(null, false);
    };
}
export function getRtfFromSubDocumentPublic(richOptions, subDocument, coreInterval) {
    const rangeCopy = RangeCopy.create(new SubDocumentIntervals(subDocument, [coreInterval]));
    const newModelManager = new ClientModelManager(rangeCopy.model, richOptions, new EmptyBatchUpdatableObject());
    return new RtfExporter(newModelManager.modelManipulator, new RtfDocumentExporterOptions()).exportAsString();
}
