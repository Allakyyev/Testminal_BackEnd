import { DocumentFormat } from '../../core/document-format';
import { DocumentExporterOptions } from '../../core/formats/options';
import { DocxExportOptions } from '../../docx/export/docx-export-options';
import { DocxExporter } from '../../docx/export/exporter';
import { RtfExporter } from '../../rtf/export/exporter';
import { RtfDocumentExporterOptions } from '../../rtf/export/rtf-document-exporter-options';
import { TxtExporter } from '../../txt/txt-exporter';
export function exportModelToBase64(modelManipulator, format, callback) {
    getExporter(modelManipulator, format).exportToBase64(callback);
}
export function exportModelToBlob(modelManipulator, format, callback) {
    getExporter(modelManipulator, format).exportToBlob(callback);
}
function getExporter(modelManipulator, format) {
    switch (format) {
        case DocumentFormat.OpenXml: return new DocxExporter(modelManipulator, new DocxExportOptions());
        case DocumentFormat.Rtf: return new RtfExporter(modelManipulator, new RtfDocumentExporterOptions());
        case DocumentFormat.PlainText: return new TxtExporter(modelManipulator, new DocumentExporterOptions());
        default:
            console.log('Unsupported format');
            return null;
    }
}
