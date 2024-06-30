import { FileNameHelper } from '../../core/formats/file-name-helper';
import { ModelCreator } from '../../core/model/creator/creator';
import { ModelCreatorOptions } from '../../core/model/creator/options';
import { Base64Utils } from '@devexpress/utils/lib/utils/base64';
import { FileUtils } from '@devexpress/utils/lib/utils/file';
import { RichEditDocumentApi } from '../../model-api/document';
import { UnitConverterApi as UnitConverter } from '../../model-api/unit-converter';
import { downloadPdf, pdfExport } from '../../pdf/api/pdf';
export class DocumentProcessorBaseApi {
    constructor() {
        this.unitConverter = new UnitConverter();
    }
    set onCalculateDocumentVariable(val) {
        this._processor.onCalculateDocumentVariable = val ? (e) => val(this, e) : null;
    }
    importDocument(source, documentFormat, callback) {
        this._processor.openDocument(source, documentFormat, callback);
        this.document = new RichEditDocumentApi(this._processor);
    }
    exportDocumentToBase64(callback, documentFormat) {
        this._processor.exportDocumentToBase64(callback, documentFormat ? documentFormat : null);
    }
    exportDocumentToBlob(callback, documentFormat) {
        this._processor.exportDocumentToBlob(callback, documentFormat ? documentFormat : null);
    }
    downloadDocument(fileName, documentFormat) {
        const coreDocFormat = documentFormat;
        this._processor.exportDocumentToBlob((blob) => FileUtils.startDownloadFileLocal(blob, fileName + FileNameHelper.convertToString(coreDocFormat)), coreDocFormat);
    }
    exportToPdf(callback, options) {
        pdfExport(this._processor, (blob, stream) => {
            Base64Utils.fromBlobAsArrayBuffer(blob, base64 => callback(base64, blob, stream));
        }, options);
    }
    downloadPdf(fileName, options) {
        downloadPdf(this._processor, fileName, options);
    }
    dispose() {
        this._processor.dispose();
    }
    _importInnerDocument(model) {
        this._processor.openInnerDocument(model);
        this.document = new RichEditDocumentApi(this._processor);
    }
    _initByEmptyModel() {
        const model = new ModelCreator(new ModelCreatorOptions()).createModel(this._processor.modelManager.richOptions).fillModel();
        this._processor.openInnerDocument(model);
        this.document = new RichEditDocumentApi(this._processor);
    }
}
